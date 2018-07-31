<template>
  <div class="home">
    <div class="home-nav">
      <div class="home-nav-top">
        <div class="nav-title">{{$t('message.fund')}}</div>
        <div class="nav-info">
          <div class="nav-all">
            <div class="nav-left">
              {{$t('message.fundTotal')}}：
            </div>
            <div class="nav-right">
              <ProgressBar colorData="#658EC7" :widthData=this.balanceData.balanceWidth></ProgressBar>
              <label class="number">{{this.balanceData.balance}} NULS</label>
            </div>
          </div>
          <div class="nav-all cl">
            <div class="nav-left">
              {{$t('message.fundLock')}}：
            </div>
            <div class="nav-right">
              <ProgressBar colorData="#f64b3e" :widthData=this.balanceData.lockedWidth></ProgressBar>
              <label class="number">{{this.balanceData.locked}} NULS</label>
            </div>
          </div>
          <div class="nav-all cl">
            <div class="nav-left">
              {{$t('message.fundUsable')}}：
            </div>
            <div class="nav-right">
              <ProgressBar colorData="#82bd39" :widthData=this.balanceData.usableWidth></ProgressBar>
              <label class="number">{{this.balanceData.usable}} NULS</label>
            </div>
          </div>
        </div>
      </div>
      <div class="home-nav-top">
        <div class="nav-title">{{$t('message.consensus1')}}</div>
        <div class="nav-info">
          <ul>
            <li class="cl">
              <label class="fl">{{$t('message.annualYield')}}：</label>
              <span>{{this.allNodeList.nodeNumber}} {{$t('message.c30')}}</span>
            </li>
            <li class="cl">
              <label class="fl">{{$t('message.pledge')}}：</label>
              <span class="number">{{this.allNodeList.entrust}} NULS</span>
            </li>
            <li class="cl">
              <label class="fl">{{$t('message.income')}}：</label>
              <span class="number">{{this.allNodeList.consensusAccountNumber}} {{$t('message.c30')}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="div-title">{{$t('message.applicationsNode')}}</div>
    <div class="cl home-info">
      <div class="home-info-consensus" v-loading.lock="loading">
        <div id="world-map-markers" style="height: 28rem;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProgressBar from '@/components/ProgressBar.vue'
  import '@/assets/css/jquery-jvectormap.css'
  import '@/assets/js/jvectormap/jquery-jvectormap-2.0.3.min'
  import '@/assets/js/jvectormap/jquery-jvectormap-world-mill-en.js'
  import {LeftShiftEight} from '@/api/util.js'
  import {getAccountAssets, getConsensus} from '@/api/httpData.js'

  export default {
    data() {
      return {
        //地图加载
        loading: true,
        //我的资产Info
        balanceData: {
          balance: 0,
          balanceWidth: '0',
          locked: 0,
          lockedWidth: '0',
          usable: 0,
          usableWidth: '0',
        },
        //全网共识Info
        allNodeList: {
          entrust: 0,
          consensusAccountNumber: 0,
          nodeNumber: 0,
        },
        //ipInfo
        ipData: [],
        //
        mapObj: [],
        //经纬度Info
        ipObj: [],
        homeSetInterval: null,
      }
    },
    components: {
      ProgressBar,
    },
    created() {
      if (localStorage.getItem('newAccountAddress') !== '') {
        this.getAccountAddress(localStorage.getItem('newAccountAddress'))
      }
      //设置后端语言
      if (localStorage.hasOwnProperty('language')) {
        this.selectLanguage();
      }
      this.queryConsensus();
      this.getNetWork();
      setTimeout(() => {
        this.getCoordinate(this.ipData);
      }, 300);
      setTimeout(() => {
        //console.log(this.arrCount(this.ipObj));
        this.methodsMaps(this.ipObj)
      }, 1000);
      //页面第一次进入判断浏览器内核
      console.log("V1.0.1:" + this.defaultBrowser());
      if (!sessionStorage.hasOwnProperty('browserOk')) {
        if (this.defaultBrowser() !== 'Chrome') {
          this.$alert(this.$t('message.c174'), '', {
            confirmButtonText: this.$t('message.confirmButtonText'),
            center: true
          }).then(() => {
            sessionStorage.setItem('browserOk', true)
          }).catch(() => {

          });
        }
      }
    },
    mounted() {
      //5秒循环一次我的资产和全网共识
      this.homeSetInterval = setInterval(() => {
        if (localStorage.getItem('newAccountAddress') !== '') {
          this.getAccountAddress(localStorage.getItem('newAccountAddress'))
        }
        this.queryConsensus();
        this.getNetWork();
        setTimeout(() => {
          this.getCoordinate(this.ipData);
        }, 500);
        let map = $('#world-map-markers').vectorMap('get', 'mapObject');
        setTimeout(() => {
          map.clearSelectedMarkers();
          map.addMarkers(this.ipObj);
        }, 1000)
      }, 9000);
    },
    //离开当前页面后执行
    destroyed() {
      clearInterval(this.homeSetInterval)
    },
    methods: {
      /**
       * 根据账户地址获取总金、冻结、可用额
       *Get the total amount, freezing and availability according to the account address.
       * @param address
       */
      getAccountAddress(address) {
        getAccountAssets(address)
          .then((response) => {
            if (response.success) {
              this.balanceData = response.data.list[0];
              this.balanceData.balance = LeftShiftEight(this.balanceData.balance).toString();
              this.balanceData.locked = LeftShiftEight(this.balanceData.locked).toString();
              this.balanceData.usable = LeftShiftEight(this.balanceData.usable).toString();
              if (this.balanceData.balance !== 0) {
                this.balanceData.balanceWidth = (this.balanceData.balance / this.balanceData.balance * 100).toFixed(2) + '%';
                this.balanceData.lockedWidth = (this.balanceData.locked / this.balanceData.balance * 100).toFixed(2) + '%';
                this.balanceData.usableWidth = (this.balanceData.usable / this.balanceData.balance * 100).toFixed(2) + '%'
              }
            }
          })
          .catch((reject) => {
            console.log(reject)
          });
      },

      /**
       * 获取所有共识信息
       * Get all the consensus information
       */
      queryConsensus() {
        getConsensus()
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.allNodeList.nodeNumber = response.data.consensusAccountNumber;
              this.allNodeList.entrust = LeftShiftEight(response.data.totalDeposit).toString();
              this.allNodeList.consensusAccountNumber = response.data.packingAgentCount
            }
          })
      },

      /**
       * 获取 ip
       * getNetWork
       */
      getNetWork() {
        this.$fetch('/network/nodes')
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.ipData = response.data.list;
            }
          })
          .catch((reject) => {
            console.log(reject)
          });
      },

      /**
       * 根据ip 获取经纬度
       **/
      getCoordinate(arr) {
        //新数组
        let newArr = [];
        let s = parseInt((arr.length / 50).toString());
        let n = 0;
        for (let i = 1; i <= s; i++) {
          let star = (i - 1) * 50;
          newArr[n++] = arr.slice(star, star + 50);
        }
        let y = arr.length - s * 50;
        if (y > 0) {
          newArr[n++] = arr.slice(s * 50);
        }

        this.ipObj = [];
        //循环新数组，获取经纬度
        for (let k = 0; k < newArr.length; k++) {
          axios.get("http://50.62.6.187:8766/nuls/ip/getlist/?iplist=" + newArr[k])
            .then((response) => {
              //console.log(response);
              if (response.data.success) {
                for (let j = 0; j < response.data.data.length; j++) {
                    this.ipObj.push({
                      'ip': response.data.data[j].ip,
                      'latLng': [response.data.data[j].latitude, response.data.data[j].longitude],
                      'name': response.data.data[j].city === 'null' ? '':response.data.data[j].city
                    });
                }
              } else {
                console.log("Failure to convert coordinates to IP")
              }
            })
        }
      },

      //数组统计
      arrCount(arr) {
        let list = arr;
        let newlist = [];
        let listMap = [];
        for (let i = 0, len = list.length, latLng, name, key; i < len; i++) {
          latLng = list[i].latLng;
          name = list[i].name;
          key = latLng + '-' + name;
          if (!!listMap[key]) {
            listMap[key]++;
          } else {
            listMap[key] = 1;
          }
        }
        for (let item in listMap) {
          newlist.push({
            latLng: [item.split('-')[0].split(',')[0], item.split('-')[0].split(',')[0]],
            name: item.split('-')[1]+" "+listMap[item],
            //number: listMap[item],
            style: {r: 2, fill: '#fesdfe'}
          })
        }
        return newlist;
      },

      /**
       * 根据坐标标注位置
       * According to coordinate annotation position
       * @param maps
       * @returns {Promise}
       */
      methodsMaps(maps) {
        setTimeout(() => {
          $('#world-map-markers').vectorMap({
            map: 'world_mill_en',
            normalizeFunction: 'polynomial',
            hoverOpacity: 0.7,
            hoverColor: false,
            zoomOnScroll: false,
            zoomStep: 1,
            backgroundColor: 'transparent',
            regionStyle: {
              initial: {
                fill: 'none',
                'fill-opacity': 0.5,
                stroke: '#6da6f5',
                'stroke-width': 0.8,
                'stroke-opacity': 0.6
              },
              hover: {
                'fill-opacity': 0.7,
                cursor: 'pointer'
              },
              selected: {
                fill: 'yellow'
              },
              selectedHover: {}
            },
            markerStyle: {
              initial: {
                fill: '#00a65a',
                stroke: '#82bd39',
                r: 3,
              },
              hover: {
                r: 4,
                fill: '#dbf433',
                stroke: '#82bd39',
              }
            },
            markers: maps,
            /* markers: [
               {latLng: [30.2936, 120.1614], name: 'Hangzhou 5'},
               {latLng: [34.74, 113.66], name: '河南 - 郑州  2010,2011,2012'},
               {latLng: [39.95, 116.34], name: '北京  2013'},
               {latLng: [38.97, 121.53], name: '辽宁 - 大连  2010-2014'},
               {latLng: [29.88, 121.64], name: '浙江 - 宁波  2014.04'},
               ]*/
          });
        }, 1000);


        this.loading = false
      },

      /**
       * 修改描点
       */
      eMethodsMaps(maps) {
        console.log("修改描点");

      },

      //设置后端返回语言
      selectLanguage() {
        let param = localStorage.getItem('language');
        this.$put('/sys/lang/' + param)
          .then((response) => {
            if (response.success) {

            } else {

            }
          })
      },

      /**
       *判断默认浏览器信息
       **/
      defaultBrowser() {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
          return "Opera"
        } //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
          return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
          return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
          return "IE";
        } //判断是否IE浏览器
      },

    },
    watch: {
      newValue(val, oldVal) {
        let newValue = new Set(val);
        let oldValue = new Set(oldVal);
        //加入
        let inDifference = new Set([...newValue].filter(x => !oldValue.has(x)));
        //重复
        let intersect = new Set([...newValue].filter(x => oldValue.has(x)));
        //移除
        let outDifference = new Set([...oldValue].filter(x => !newValue.has(x)));
        /* this.eMethodsMaps("123456");*/
        /* console.log(inDifference);
         console.log("inDifference");
         console.log(intersect);
         console.log("intersect");
         console.log(outDifference)*/
      },
    },
    computed: {
      newValue() {
        return this.ipObj
      }
    }
  }
</script>
<style lang="less">
  @import url("../../assets/css/style.less");

  .home {
    width: 100%;
    height: 100%;
    margin: auto;
    background-color: #0c1323;
    .home-nav {
      width: 1024px;
      height: 245px;
      margin: auto;
      .home-nav-top {
        width: 47%;
        height: auto;
        float: left;
        margin: 68px 0 0;
        .nav-title {
          text-align: center;
          font-size: 16px;
          margin: 20px 0;
          font-weight: bold;
        }
        .nav-info {
          border: 1px solid #658ec7;
          background-color: #17202e;
          height: 90px;
          padding: 20px 0 0;
        }
        ul {
          li {
            font-size: 16px;
            line-height: 22px;
            width: 100%;
            label {
              display: block;
              width: auto;
              float: left;
              margin-left: 30px;
              text-align: left;
            }
            span {
              display: block;
              float: right;
              text-align: right;
              margin-left: 0;
              margin-right: 30px;
            }
          }
        }

        .nav-all {
          font-size: 16px;
          line-height: 1.5rem;
          margin: 0 30px;
          .nav-left {
            float: left;
            width: 16%;
          }
          .nav-right {
            width: 84%;
            float: left;
            .bar-bg {
              margin-top: 12px;
              width: 150px;
            }
            .number {
              display: block;
              float: right;
              text-align: right;
              width: auto;
            }
          }
        }
      }
      .home-nav-top:last-child {
        margin-right: 0;
        float: right;
      }
      .home-info {
        width: 100%;
        height: 25rem;
        margin-top: 0.5rem;
        border: 1px solid #333333;

      }
    }
    .div-title {
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      margin-top: 20px;
      font-weight: bold;
    }
  }

  .jvectormap-labels {
    font-size: 12px;
    color: #C1C5C9;
  }
</style>
