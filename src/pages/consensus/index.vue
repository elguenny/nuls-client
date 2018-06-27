<template>
  <div class="consensus-index" v-loading="loading">
    <div class="account-top" v-show="tabelShow">
      <label v-show="accountAddressOk">{{$t('message.indexAccountAddress')}}：</label>
      <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
      <i class="copy_icon copyBtn cursor-p" :data-clipboard-text="accountAddressValue"
         @click="accountCopy" :title="$t('message.c143')"></i>
    </div>
    <div class="consensus-index-title">
      <label>{{$t('message.c1')}}{{$t('message.c1_1')}}：</label>
      {{this.allTotalDeposit.toString()}} NULS，
      <label>{{$t('message.c2')}}：</label>{{this.allAgentCount}}
    </div>
    <div class="consensus-center">
      <ul>
        <li class="li-bg">
          <label>{{$t('message.c3')}}：</label>
        </li>
        <li class="li-bg">
          <label>{{$t('message.c7')}}：</label>{{this.myInfoData.reward}} NULS
        </li>
        <li>
          <label>{{$t('message.c4')}}：</label>{{this.myInfoData.agentCount}} {{$t('message.c30')}}
          <span v-if="this.myInfoData.agentCount > 0">(<span
            @click="toCheck" class="span">{{$t('message.c5_1')}}</span>)</span>
          <span v-else>(<span @click="toNewNode" class="span">{{$t('message.c5')}}</span>)</span>
        </li>
        <li>
          <label>{{$t('message.c8')}}：</label>{{this.myInfoData.joinAgentCount}} {{$t('message.c30')}}
          (<span
          @click="toAgencyNode"
          class="span">{{$t('message.c9')}}</span>)
        </li>
        <li>
          <label>{{$t('message.c6')}}：</label>{{this.myInfoData.usableBalance.toString()}} NULS
        </li>
        <li>
          <label>{{$t('message.c10')}}：</label>
          <span @click="toPledgeInfo" class="span">
                    {{this.myInfoData.totalDeposit.toString()}} NULS
                    </span>
        </li>

      </ul>
    </div>
    <div class="consensus-bottom" v-show="tabelShow">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('message.c11')" name="first">
            <div class="div-icon cursor-p fl" v-for="(item,index) in allConsensus"
                 @click="toNodePage(item.txHash)">
              <p class="subscript" :class="item.status === 0  ? 'stay' : ''">
                {{ $t('message.status'+item.status) }}
              </p>
              <h3 class="overflow">{{item.agentId}}</h3>
              <ul>
                <li class="overflow"><label>{{$t('message.c16')}}：</label>{{ item.agentName ? item.agentName :
                  item.agentAddresss }}
                </li>
                <li><label>{{$t('message.c17')}}：</label>{{ item.commissionRate }}%</li>
                <li><label>{{$t('message.c25')}}：</label>{{ (item.deposit).toFixed(2)}} NULS</li>
                <li class="cb">
                  <label class="fl">{{$t('message.c19')}}：</label>{{item.memberCount}}
                </li>
                <li>
                  <label class="fl">{{$t('message.c20')}}：</label>
                  {{ (item.totalDeposit).toFixed(2) }}
                </li>
                <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                  <label class="fl cursor-p">{{$t('message.c18')}}:</label>
                  <ProgressBar :colorData="item.creditVals < 0 ? '#f64b3e':'#82bd39'"
                               :widthData="item.creditVal"></ProgressBar>
                </li>
              </ul>
            </div>
            <el-pagination layout="prev, pager, next" :page-size="12" :total=this.totalAll class="cb"
                           v-show="totalAllOk = this.totalAll>12 ?true:false"
                           @current-change="allConsensusSize"></el-pagination>
          </el-tab-pane>
          <el-tab-pane :label="$t('message.c12')" name="second">
            <div class="div-icon cursor-p fl" v-for="(item,index) in myConsensus"
                 @click="toMyNode(accountAddressValue,item.agentHash)">
              <p class="subscript" :class="item.status === 0  ? 'stay' : ''">
                {{ $t('message.status'+item.status) }}
              </p>
              <h3 class="overflow">{{item.agentId}}</h3>
              <ul>
                <li class="overflow"><label>{{$t('message.c16')}}：</label>{{ item.agentName ? item.agentName :
                  item.agentAddresss }}
                </li>
                <li><label>{{$t('message.c17')}}：</label>{{ item.commissionRate }}%</li>
                <li><label>{{$t('message.c25')}}：</label>{{ (item.deposit*0.00000001).toFixed(2) }}
                  NULS
                </li>
                <li class="cb">
                  <label class="fl">{{$t('message.c19')}}：</label>{{item.memberCount}}
                </li>
                <li class="cb">
                  <label class="fl">{{$t('message.c20')}}：</label>{{ (item.totalDeposit).toFixed(2) }}
                </li>
                <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                  <label class="fl cursor-p">{{$t('message.c18')}}:</label>
                  <ProgressBar :colorData="item.creditVals < 0 ? '#f64b3e':'#82bd39'"
                               :widthData="item.creditVal"></ProgressBar>
                </li>

              </ul>
            </div>
            <el-pagination layout="prev, pager, next" :page-size="12" :total=this.myTotalAll class="cb"
                           v-show="totalAllOk = this.myTotalAll>12 ?true:false"
                           @current-change="myConsensusSize"></el-pagination>
            <div class="noData" v-show="noDataOK" @click="toNodeList">
              <i class="el-icon-plus"></i>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '@/components/ProgressBar.vue'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import {BigNumber} from 'bignumber.js'
  import copy from 'copy-to-clipboard'

  export default {
    data() {
      return {
        loading: false,
        tabelShow: false,
        accountAddressOk: true,
        accountAddress: [],
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        activeName: sessionStorage.getItem('consensusTabName'),
        tabName: 'first',

        creditValuesShow0: false,
        creditValuesShow1: false,
        creditValuesShow2: false,
        noDataOK: false,
        myConsensusSizeOK: true,

        allAgentCount: 0,
        allTotalDeposit: 0,

        myInfoData: {
          agentCount: 0,
          totalDeposit: 0,
          reward: 0,
          joinAgentCount: 0,
          usableBalance: 0,
          rewardOfDay: 0,
        },

        creditColor: '#6e84f7',
        totalColor: '#f64b3e',
        memberColor: '#82BD39',

        allConsensus: [],
        allEvents: 1,
        totalAll: 0,

        myConsensus: [],
        myEvents: 1,
        myTotalAll: 0,

        consensusSetInterval: null,

      }
    },
    components: {
      ProgressBar,
      AccountAddressBar,
    },
    computed: {
      getAddressList() {
        return this.$store.getters.getAddressList
      },
    },
    created() {
      this.getConsensus('/consensus');
      if (localStorage.getItem('newAccountAddress') !== '') {
        this.getConsensusAddress('/consensus/address/' + localStorage.getItem('newAccountAddress'))
      }
      this.getAllConsensus('/consensus/agent/list', {'pageSize': '12', 'pageNumber': '1'});
      if (localStorage.getItem('newAccountAddress') !== '') {
        this.accountAddressValue = localStorage.getItem('newAccountAddress');
        this.getMyConsensus('/consensus/agent/address/' + localStorage.getItem('newAccountAddress'), {
          'pageSize': '12',
          'pageNumber': '1'
        });
        /**
         * 5秒查询列表
         * 5second list
         */
        this.consensusSetInterval = setInterval(() => {
          //this.getConsensus('/consensus')
          this.getConsensusAddress('/consensus/address/' + localStorage.getItem('newAccountAddress'));
          if (this.tabName === 'first') {
            this.getAllConsensus('/consensus/agent/list', {'pageSize': '12', 'pageNumber': this.allEvents})
          } else {
            this.getMyConsensus('/consensus/agent/address/' + localStorage.getItem('newAccountAddress'), {
              'pageSize': '12',
              'pageNumber': this.myEvents
            })
          }
        }, 5000)
      }
    },
    destroyed() {
      clearInterval(this.consensusSetInterval)
    },
    methods: {
      //获取下拉选择地址
      chenckAccountAddress(chenckAddress) {
        this.accountAddressValue = chenckAddress;
        this.getConsensusAddress('/consensus/address/' + chenckAddress);
        if (sessionStorage.getItem('consensusTabName') === 'first') {
          this.getAllConsensus('/consensus/agent/list', {'pageSize': '12', 'pageNumber': '1'})
        } else {
          this.getMyConsensus('/consensus/agent/address/' + chenckAddress, {'pageSize': '12', 'pageNumber': '1'})
        }
      },
      /**
       * 复制功能
       * copy
       */
      accountCopy() {
        copy(this.accountAddressValue);
        this.$message({
          message: this.$t('message.c129'), type: 'success', duration: '800'
        })
      },
      //获取共识信息
      getConsensus(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.allAgentCount = response.data.agentCount;
              this.allTotalDeposit = parseFloat(leftShift.times(response.data.totalDeposit).toString())
            }
          })
      },
      //获取钱包内账户参与共识基本信息
      getConsensusAddress(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.myInfoData = response.data;
              this.myInfoData.reward = parseFloat(leftShift.times(response.data.reward).toString());
              this.myInfoData.usableBalance = parseFloat(leftShift.times(response.data.usableBalance).toString());
              this.myInfoData.totalDeposit = parseFloat(leftShift.times(response.data.totalDeposit).toString())
            }
          })
      },
      //获取我的共识列表
      getMyConsensus(url, params) {
        this.$fetch(url, params)
          .then((response) => {
            //console.log(response);
            this.myTotalAll = 1;
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              if (response.data.list.length !== 0) {
                this.noDataOK = false;
                this.myConsensusSizeOK = true
              } else {
                this.noDataOK = true;
                this.myConsensusSizeOK = false
              }
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].creditVals = response.data.list[i].creditVal;
                response.data.list[i].creditVal = (((((response.data.list[i].creditVal + 1) / 2)) * 100).toFixed()).toString() + '%';
                response.data.list[i].agentAddresss = (response.data.list[i].agentAddress).substr(0, 6) + '...' + (response.data.list[i].agentAddress).substr(-6);
                response.data.list[i].totalDeposit = parseFloat(leftShift.times(response.data.list[i].totalDeposit).toString())
              }
              this.loading = false;
              this.tabelShow = true;
              this.myTotalAll = response.data.total;
              this.myConsensus = response.data.list
            }
          })
      },
      //我的共识列表分页
      myConsensusSize(events) {
        this.myEvents = events;
        this.getMyConsensus('/consensus/agent/address/' + localStorage.getItem('newAccountAddress'), {
          'pageNumber': events,
          'pageSize': '12'
        })
      },
      //获取全部共识列表
      getAllConsensus(url, params) {
        this.$fetch(url, params)
          .then((response) => {
            if (response.success) {
              //console.log(response);
              let leftShift = new BigNumber(0.00000001);
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].creditVals = response.data.list[i].creditVal;
                response.data.list[i].creditVal = (((((response.data.list[i].creditVal + 1) / 2)) * 100).toFixed()).toString() + '%';
                response.data.list[i].agentAddresss = (response.data.list[i].agentAddress).substr(0, 6) + '...' + (response.data.list[i].agentAddress).substr(-6);
                response.data.list[i].totalDeposit = parseFloat(leftShift.times(response.data.list[i].totalDeposit).toString());
                response.data.list[i].deposit = parseFloat(leftShift.times(response.data.list[i].deposit).toString())
              }
              this.loading = false;
              this.tabelShow = true;
              this.totalAll = response.data.total;
              this.allConsensus = response.data.list
            }
          })
      },
      //全部共识分页
      allConsensusSize(events) {
        this.allEvents = events;
        this.getAllConsensus('/consensus/agent/list/', {'pageNumber': events, 'pageSize': '12'})
      },
      //创建节点跳转
      toNewNode() {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
          this.$router.push({
            path: '/consensus/newNode'
          })
        } else {
          this.$message({
            message: this.$t('message.c133'),
          })
        }
      },
      //查看抵押详情跳转
      toPledgeInfo() {
        this.$router.push({
          path: '/consensus/pledgeInfo'
        })
      },
      //点击全部共识跳转加入节点页面
      toNodePage(index) {
        this.$router.push({
          path: '/consensus/nodePage',
          query: {address: index}
        })
      },
      //委托节点跳转
      toAgencyNode() {
        this.$router.push({
          path: '/consensus/agencyNode',
          query: {indexTo: 1}
        })
      },
      //我的节点跳转
      toMyNode(address, hash) {
        this.$fetch('/consensus/deposit/address/' + address, {
          'agentHash': hash,
          'pageSize': '10',
          'pageNumber': this.pageNumber
        })
          .then((response) => {
            console.log(response);
            if (response.success) {
              if (response.data.list.length > 0) {
                this.$router.push({
                  path: '/consensus/myNode',
                  query: {'agentAddress': address, 'agentHash': hash}
                })
              } else {
                this.$router.push({
                  path: '/consensus/nodePage',
                  query: {address: hash}
                })
              }
            } else {
              this.$router.push({
                path: '/consensus/nodePage',
                query: {address: hash}
              })
            }
          });
      },

      //查看节点
      toCheck() {
        this.$router.push({
          path: '/consensus/nodeInfo',
          query: {"txHash": this.myInfoData.agentHash}
        })
      },
      //显示隐藏信用系数规则
      toggleShow(index) {
        //console.log(index);
        /*this.creditValuesShow0 = !this.creditValuesShow0;*/
      },
      //切换tab
      handleClick(tab) {
        this.tabName = tab.name;
        sessionStorage.setItem('consensusTabName', this.tabName);
        if (localStorage.getItem('newAccountAddress') !== '') {
          if (tab.name !== 'first') {
            //this.myConsensusSize(this.myEvents);
            this.getMyConsensus('/consensus/agent/address/' + localStorage.getItem('newAccountAddress'), {
              'pageSize': '12',
              'pageNumber': '1'
            })
          } else {
            this.allConsensusSize(this.allEvents)
            //this.getAllConsensus("/consensus/agent/list", {"pageSize": "3","pageNumber":"1"});
          }
        }
      },
      //跳转加入共识列表
      toNodeList() {
        this.$router.push({
          name: '/agencyNode'
        })
      },
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style");

  .consensus-index {
    width: 1024px;
    margin: auto;
    .account-top {
      margin: 68px 0 0 0;
      width: 530px;
      .copy_icon {
        position: relative;
        margin-left: 10px;
        width: 30px;
        height: 20px;
        display: block;
        float: left;
        background-size: @bg-size;
        background: @bg-image -198px -46px;
      }
    }
    .consensus-index-title {
      width: 100%;
      margin: 30px auto 0;
      font-size: 12px;
      line-height: 32px;
      color: #658ec7;
      text-align: left;
      clear: both;
      label {
      }
    }
    .consensus-center {
      width: 100%;
      height: 90px;
      margin: auto;
      border: 1px solid #658ec7;
      text-align: center;
      ul {
        width: 100%;
        margin-top: 11px;
        li {
          width: 40%;
          height: 25px;
          line-height: 25px;
          padding-left: 10%;
          text-align: left;
          float: left;
          font-size: 12px;
          color: #C1C5C9;
          label {
          }
          .span {
            text-decoration: underline;
            cursor: pointer;
          }
          span.span {
            text-decoration: underline;
            cursor: pointer;
          }
        }
        li.li-bg {
          background-color: #222d3f;
        }
      }

    }
    .consensus-bottom {
      width: 100%;
      margin: 5px auto 0;
      h3 {
        text-align: center;
        font-size: 14px;
        line-height: 35px;
      }
      ul {
        li {
          label {
          }
          .bar-bg {
            margin-top: 10px;
          }
        }
      }
      .noData {
        width: 130px;
        height: 100px;
        text-align: center;
        border: 1px solid #658ec7;
        line-height: 90px;
        font-size: 50px;
        color: #c1c1c1;
        margin: 50px auto;
        background-color: #17202e;
      }
      .noData:hover {
        border: 1px solid #3a8ee6;
        cursor: pointer;
      }
      .div-icon {
        margin-top: 13px;
        height: 165px;
      }
    }
  }
</style>
