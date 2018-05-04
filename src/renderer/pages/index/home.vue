<template>
    <div class="home">
        <div class="home-nav">
            <div class="home-nav-top">
                <div class="nav-title">{{$t('message.fund')}}</div>
                <div class="nav-all">
                    <label class="fl">{{$t('message.fundTotal')}}：</label>
                    <ProgressBar colorData="#658EC7"
                                 :widthData=this.balanceData.balanceWidth></ProgressBar>
                    <label class="number">{{this.balanceData.balance}} NULS</label>
                </div>
                <div class="nav-lock cl">
                    <label class="fl">{{$t('message.fundLock')}}：</label>
                    <ProgressBar colorData="#f64b3e"
                                 :widthData=this.balanceData.lockedWidth></ProgressBar>
                    <label class="number">{{this.balanceData.locked}} NULS</label>
                </div>
                <div class="nav-usable cl">
                    <label class="fl">{{$t('message.fundUsable')}}：</label>
                    <ProgressBar colorData="#82bd39"
                                 :widthData=this.balanceData.usableWidth></ProgressBar>
                    <label class="number">{{this.balanceData.usable}} NULS</label>
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
                    <li class="cl">
                        <label class="fl">{{$t('message.income')}}：</label>
                        <span class="number">{{this.allNodeList.income}} NULS</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="div-title">{{$t('message.applicationsNode')}}</div>
        <div class="cl home-info">
            <div class="home-info-consensus" v-loading.lock="loading">
                <div id="world-map-markers" style="height: 18rem;">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import ProgressBar from '@/components/ProgressBar.vue'
  import '@/assets/css/jquery-jvectormap-2.0.3.css'
  import { jquery } from '@/assets/js/jquery.min.js'
  import { jvectormap } from '@/assets/js/jvectormap/jquery-jvectormap-2.0.3.min.js'
  import { world_mill } from '@/assets/js/jvectormap/jquery-jvectormap-world-mill.js'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
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
        //
        mapObj: [],
        //经纬度Info
        ipObj: [],
        homeSetInterval: null,
        homeSetIntervals: null,
      }
    },
    components: {
      ProgressBar,
    },
    created () {
      this.getAccountAddress('/account/balances/')
      this.getConsensus('/consensus')
      this.getNetWork()
      setTimeout(() => {
        this.methodsMaps(this.ipObj)
      }, 1000)
    },
    mounted () {
      //5秒循环一次我的资产和全网共识
      let map = $('#world-map-markers').vectorMap('get', 'mapObject')
      this.homeSetInterval = setInterval(() => {
        this.getAccountAddress('/account/balances/')
        this.getConsensus('/consensus')
      }, 8000)

      this.homeSetIntervals = setInterval(() => {
        this.getNetWork()
        setTimeout(() => {
          map.clearSelectedMarkers()
          map.addMarkers(this.ipObj)
        }, 1000)
      }, 15000)
    },
    //离开当前页面后执行
    destroyed () {
      clearInterval(this.homeSetInterval)
      clearInterval(this.homeSetIntervals)
    },
    methods: {
      /**
       * 根据账户地址获取总金、冻结、可用额
       *Get the total amount, freezing and availability according to the account address.
       * @param url
       */
      getAccountAddress (url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              this.balanceData = response.data
              let leftShift = new BigNumber(0.00000001)
              this.balanceData.balance = parseFloat(leftShift.times(this.balanceData.balance).toString())
              this.balanceData.locked = parseFloat(leftShift.times(this.balanceData.locked).toString())
              this.balanceData.usable = parseFloat(leftShift.times(this.balanceData.usable).toString())
              if (this.balanceData.balance !== 0) {
                this.balanceData.balanceWidth = (this.balanceData.balance / this.balanceData.balance * 100).toFixed(2) + '%'
                this.balanceData.lockedWidth = (this.balanceData.locked / this.balanceData.balance * 100).toFixed(2) + '%'
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
      getConsensus (url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              this.allNodeList.nodeNumber = response.data.agentCount
              this.allNodeList.entrust = parseFloat(leftShift.times(response.data.totalDeposit).toString())
              this.allNodeList.income = parseFloat(leftShift.times(response.data.rewardOfDay).toString())
            }
          })
      },
      /**
       * getNetWork
       * getNetWork
       */
      getNetWork () {
        this.$fetch('/network/nodes')
          .then((response) => {
            if (response.success) {
              //console.log(response);
              this.ipData = response.data
              if (this.ipData.length > 0) {
                this.ipObj = []
                for (let j = 0, len = this.ipData.length; j < len; j++) {
                  axios.get('http://freegeoip.net/json/' + this.ipData[j])
                    .then((response) => {
                      //console.log(response.data);
                      let latLngs = [response.data.latitude, response.data.longitude]
                      let names = response.data.region_code
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
      methodsMaps (maps) {
        $('#world-map-markers').vectorMap({
          map: 'world_mill',
          normalizeFunction: 'polynomial',
          hoverOpacity: 0.7,
          zoomButtons:false,
          zoomOnScroll:false,
          zoomMax:4,
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
        })
        this.loading = false
      },
    },
    watch: {
      ipObj: {
        handler: function (val, oldVal) {
          if (val !== oldVal) {
            //console.log("旧数据=新数据");
            //this.removeJvpMarkers(oldVal);
            //this.addJvpMarkers(val);
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
            width: 645px;
            height: 148px;
            margin: auto;
            .home-nav-top {
                width: 300px;
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
                            max-width: 95px;
                            float: left;
                            margin-left: 16px;
                            text-align: left;
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
                        max-width: 60px;
                        text-align: left;
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