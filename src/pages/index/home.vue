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
              <label class="number">{{this.balanceData.balance.toFixed(8)}} NULS</label>
            </div>
          </div>
          <div class="nav-all cl">
            <div class="nav-left">
              {{$t('message.fundLock')}}：
            </div>
            <div class="nav-right">
              <ProgressBar colorData="#f64b3e" :widthData=this.balanceData.lockedWidth></ProgressBar>
              <label class="number">{{this.balanceData.locked.toFixed(8)}} NULS</label>
            </div>
          </div>
          <div class="nav-all cl">
            <div class="nav-left">
              {{$t('message.fundUsable')}}：
            </div>
            <div class="nav-right">
              <ProgressBar colorData="#82bd39" :widthData=this.balanceData.usableWidth></ProgressBar>
              <label class="number">{{this.balanceData.usable.toFixed(8)}} NULS</label>
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
        this.getAccountAddress('/account/assets/' + localStorage.getItem('newAccountAddress'))
      }
      this.getConsensus('/consensus');
      this.getNetWork();
      setTimeout(() => {
        this.methodsMaps(this.ipObj)
      }, 1000);
      //页面第一次进入判断浏览器内核
      //console.log("浏览器:" + this.defaultBrowser());
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
        }, 5000)
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
            //console.log(response);
            if (response.success) {
              this.balanceData = response.data.list[0];
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
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.allNodeList.nodeNumber = response.data.consensusAccountNumber;
              this.allNodeList.entrust = parseFloat(leftShift.times(response.data.totalDeposit).toString());
              this.allNodeList.consensusAccountNumber = response.data.packingAgentCount
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
              this.ipData = response.data.list;
              if (this.ipData.length > 0) {
                this.ipObj = [];
                let leng = this.ipData.length > 50 ? 50 : this.ipData.length;
                for (let j = 0; j < leng; j++) {
                  axios.get('http://freegeoip.net/json/' + this.ipData[j])
                    .then((response) => {
                      //console.log(response.data);
                      let latLngs = [response.data.latitude, response.data.longitude];
                      let names = response.data.region_code;
                      this.ipObj.push({'latLng': latLngs, 'name': names})
                    })
                }
              } else {
                console.log('没有获取到ip')
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
             {latLng: [34.62, 112.45], name: '河南 - 洛阳  家'},
             {latLng: [34.74, 113.66], name: '河南 - 郑州  2010,2011,2012'},
             {latLng: [39.95, 116.34], name: '北京  2013'},
             {latLng: [38.97, 121.53], name: '辽宁 - 大连  2010-2014'},
             {latLng: [29.88, 121.64], name: '浙江 - 宁波  2014.04'},
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
    watch: {}
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
        .nav-info{
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
            width:20%;
          }
          .nav-right {
            width: 80%;
            float: left;
            .bar-bg{
             margin-top: 12px;
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
