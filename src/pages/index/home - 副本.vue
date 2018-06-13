<template>
  <div class="home">
    <div class="home-nav">
      <div class="home-nav-top">
        <div class="nav-title">{{$t('message.fund')}}</div>
        <div class="nav-all">
          <label class="fl">{{$t('message.fundTotal')}}：</label>
          <ProgressBar colorData="#658EC7"
                       :widthData=this.balanceData.balanceWidth></ProgressBar>
          <label class="number">{{this.balanceData.balance.toFixed(8)}} NULS</label>
        </div>
        <div class="nav-lock cl">
          <label class="fl">{{$t('message.fundLock')}}：</label>
          <ProgressBar colorData="#f64b3e"
                       :widthData=this.balanceData.lockedWidth></ProgressBar>
          <label class="number">{{this.balanceData.locked.toFixed(8)}} NULS</label>
        </div>
        <div class="nav-usable cl">
          <label class="fl">{{$t('message.fundUsable')}}：</label>
          <ProgressBar colorData="#82bd39"
                       :widthData=this.balanceData.usableWidth></ProgressBar>
          <label class="number">{{this.balanceData.usable.toFixed(8)}} NULS</label>
        </div>
      </div>
      <div class="home-nav-top">
        <div class="nav-title">{{$t('message.consensus1')}}</div>
        <ul>
          <li class="cl">
            <label class="fl">{{$t('message.annualYield')}}：</label>
            <span>{{this.allNodeList.nodeNumber}} {{$t('message.c30')}}</span>
          </li>
          <li>
            <label class="fl">{{$t('message.pledge')}}：</label>
            <span class="number">{{this.allNodeList.entrust}} NULS</span>
          </li>
          <li class="cl" v-show="false">
            <label class="fl">{{$t('message.income')}}：</label>
            <span class="number">{{this.allNodeList.income}} NULS</span>
          </li>
        </ul>
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
  import {jvectormap} from '@/assets/js/jvectormap/jquery-jvectormap-2.0.3.min'
  import {jvectormap1} from '@/assets/js/jvectormap/jquery-jvectormap-world-mill-en.js'
  import {BigNumber} from 'bignumber.js'

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
          income: 0,
          nodeNumber: 0,
        },
        //ipInfo
        ipData: [],
        numbers: 0,
        oldDifference: [],
        newDifference: [],
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
        this.getAccountAddress('/account/assets/' + localStorage.getItem('newAccountAddress'))
      }
      this.getConsensus('/consensus');
      this.getNetWork();
      setTimeout(() => {
        this.methodsMaps(this.ipObj)
      }, 1000);
      //页面第一次进入判断浏览器内核
      console.log("浏览器:" + this.defaultBrowser());
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
      setTimeout(() => {
        let map = $('#world-map-markers').vectorMap('get', 'mapObject');
        this.homeSetInterval = setInterval(() => {
          if (localStorage.getItem('newAccountAddress') !== '') {
            this.getAccountAddress('/account/assets/' + localStorage.getItem('newAccountAddress'))
          }
          this.getConsensus('/consensus');
          this.getNetWork();
          //console.log(this.ipObj)
          setTimeout(() => {
            map.clearSelectedMarkers();
            map.addMarkers(this.ipObj)
          }, 1000)
        }, 36000)
      }, 1000)

    },
    //离开当前页面后执行
    destroyed() {
      clearInterval(this.homeSetInterval)
    },
    methods: {
      /**
       * 根据账户地址获取总金、冻结、可用额
       *Get the total amount, freezing and availability according to the account address.
       * @param url
       */
      getAccountAddress(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(url)
            //console.log(response)
            if (response.success) {
              this.balanceData = response.data[0];
              let leftShift = new BigNumber(0.00000001);
              this.balanceData.balance = parseFloat(leftShift.times(this.balanceData.balance).toString());
              this.balanceData.locked = parseFloat(leftShift.times(this.balanceData.locked).toString());
              this.balanceData.usable = parseFloat(leftShift.times(this.balanceData.usable).toString());
              if (this.balanceData.balance !== 0) {
                this.balanceData.balanceWidth = (this.balanceData.balance / this.balanceData.balance * 100).toFixed(2) + '%';
                this.balanceData.lockedWidth = (this.balanceData.locked / this.balanceData.balance * 100).toFixed(2) + '%';
                this.balanceData.usableWidth = (this.balanceData.usable / this.balanceData.balance * 100).toFixed(2) + '%'
              }
            }
          })
      },

      /**
       * 获取所有共识信息
       * Get all the consensus information
       * @param url
       */
      getConsensus(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.allNodeList.nodeNumber = response.data.agentCount;
              this.allNodeList.entrust = parseFloat(leftShift.times(response.data.totalDeposit).toString());
              this.allNodeList.income = parseFloat(leftShift.times(response.data.rewardOfDay).toString())
            }
          })
      },

      /**
       * getNetWork
       * getNetWork
       */
      getNetWork() {
        this.$fetch('/network/nodes')
          .then((response) => {
            if (response.success) {
              //console.log(response);
              let newIpData = new Set(response.data);
              //let oldDifference = new Set();
              //let newDifference = new Set();
              //不是第一获取ip列表，获取差集
              if (this.numbers !== 0) {
                // 差集
                this.oldDifference = new Set([...this.ipData].filter(x => !newIpData.has(x)));
                this.newDifference = new Set([...newIpData].filter(x => !this.ipData.has(x)));
              }
              console.log(this.oldDifference);
              console.log(this.newDifference);
              this.ipData = new Set(response.data);
              this.numbers = +1;
              if (this.ipData.size > 0) {
                this.ipObj = [];
                /* for (let j = 0, len = this.ipData.size; j < len; j++) {
                   axios.get('http://api.ipstack.com/'+this.ipData[j]+'?access_key=ea5e31ea15522d0fabfd8cc445227197')
                     .then((response) => {
                       //console.log(response.data);
                       let latLngs = [response.data.latitude, response.data.longitude];
                       let names = response.data.region_code;
                       this.ipObj.push({'latLng': latLngs, 'name': names})
                     })
                 }*/
              } else {
                console.log('没有获取到ip');
              }
            }
          })
      },
      /**
       * 根据坐标标注位置
       * According to coordinate annotation position
       * @param url
       * @param data
       * @returns {Promise}
       */
      methodsMaps(maps) {
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
             {latLng: [41.90, 12.45], name: 'Vatican City'},
             {latLng: [43.73, 7.41], name: 'Monaco'},
             {latLng: [-0.52, 166.93], name: 'Nauru'},
             {latLng: [-8.51, 179.21], name: 'Tuvalu'},
             {latLng: [43.93, 12.46], name: 'San Marino'},
             {latLng: [47.14, 9.52], name: 'Liechtenstein'}
             ]*/
        });
        this.loading = false
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
      oldDifference: {
        handler(newValue, oldValue) {
          for (let i = 0; i < newValue.length; i++) {
            if (oldValue[i] != newValue[i]) {
              console.log(newValue)
            }
          }
        },
        deep: true
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
      width: 900px;
      height: 148px;
      margin: auto;
      .home-nav-top {
        width: 428px;
        height: 120px;
        float: left;
        margin: 24px 40px 0 0;
        border: 1px solid #658ec7;
        background-color: #17202e;
        .nav-title {
          text-align: center;
          font-size: 14px;
          line-height: 2rem;
        }
        ul {
          li {
            font-size: 12px;
            line-height: 22px;
            label {
              display: block;
              width: 105px;
              float: left;
              margin-left: 16px;
              text-align: right;
            }
            .number {

            }
          }
        }
        .nav-all {

        }
        .nav-all,
        .nav-usable,
        .nav-lock {
          font-size: 12px;
          line-height: 1.5rem;
          .bar-bg {
            margin-top: 13px;
          }
          label {
            margin-left: 16px;
            width: 60px;
            text-align: right;
          }
          span {
            margin-right: 5px;
          }
          .number {
            display: block;
            float: left;
            text-align: right;
            margin-left: 5px;
            min-width: 151px;
          }
        }
      }
      .home-nav-top:last-child {
        margin-right: 0;
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
      font-size: 14px;
    }
  }

  .jvectormap-labels {
    font-size: 12px;
    color: #C1C5C9;
  }
</style>
