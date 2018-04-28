<template>
    <div class="agency-node">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{$t('message.c43')}}</h2>
        <div class="agency-node-top">
            <div class="search-div fl">
                <el-input :placeholder="this.$t('message.c44')" v-model="keyword">
                    <template slot="append">
                        <el-button slot="append" @click="searchConsensus">{{$t('message.c45')}}</el-button>
                    </template>
                </el-input>
            </div>
            <div class="select-div fl">
                <div class="address-select sort-select" @click="showDataList">
                    <div class="sub-selected-value">
                        {{this.sortValue}}
                        <div class="sub-select-list" v-if="showData">
                            <div class="sub-select-item sort-select-item" v-for="item in sortConsensusList"
                                 @click.stop="sortConsensus(item.sortName,item.sortKey)">
                                {{item.sortName}}
                            </div>
                        </div>
                    </div>
                    <i class="el-icon-arrow-up" :class="showData ? 'i_reverse':''"></i>
                </div>

            </div>
        </div>
        <div class="agency-node-bottom">
            <div class="div-icon cursor-p" v-for="(item,index) in allConsensus" @click="toNodePage(item.agentAddress)">
                <p class="subscript" :class="item.status === 1  ? 'stay' : ''">
                    {{ $t('message.status'+item.status) }}
                </p>
                <h3>{{item.agentName}}</h3>
                <ul>
                    <li class="overflow"><label>{{$t('message.c16')}}：</label>{{ item.agentAddresss }}</li>
                    <li><label>{{$t('message.c17')}}：</label>{{ item.commissionRate }}%</li>
                    <li><label>{{$t('message.c25')}}：</label>{{ (item.owndeposit).toFixed(2)}} NULS</li>
                    <li class="cb">
                        <label class="fl">{{$t('message.c47')}}：</label>{{(item.totalDeposit).toFixed(2)}}
                    </li>
                    <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                        <label class="fl cursor-p">{{$t('message.c18')}}:</label>
                        <ProgressBar :colorData="item.creditRatios < 0 ? '#f64b3e':'#82bd39'" :widthData="item.creditRatio"></ProgressBar>
                    </li>

                </ul>
                <div class="credit-valuesDiv" v-show="creditValuesShow0">
                    <h2>
                        <label class="fl">能力系数&nbsp;</label>
                        <ProgressBar colorData="#82BD39" widthData="50%"></ProgressBar>
                    </h2>
                    <p class="cb">根据近100轮出块数量计算</p>
                    <h4>
                        <label class="fl">责任系数&nbsp;</label>
                        <ProgressBar colorData="#82BD39" widthData="80%"></ProgressBar>
                    </h4>
                    <p class="cb">根据近100轮违规情况和出块正确性计算</p>
                </div>
            </div>
        </div>
        <el-pagination layout="prev, pager, next" :page-size="6" :total=this.totalAll
                       v-show="totalOK = this.totalAll > 6 ? true:false" class="cb"
                       @current-change="allConsensusSize"></el-pagination>
    </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import ProgressBar from './../../components/ProgressBar.vue'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      return {
        showData: false,
        sortValue: this.$t('message.c46'),
        sortConsensusList: [
          {sortName: this.$t('message.c46'), sortKey: ''},
          {sortName: this.$t('message.c17'), sortKey: 'commissionRate'},
          {sortName: this.$t('message.c25'), sortKey: 'owndeposit'},
          {sortName: this.$t('message.c18'), sortKey: 'creditRatio'}
        ],
        keyword: '',
        selectKeyword: '',
        creditValuesShow0: false,
        creditValuesShow1: false,
        creditValuesShow2: false,

        allConsensus: [],
        totalAll: 0,
        pageNumber:1,
      }
    },
    components: {
      Back,
      ProgressBar,
    },
    mounted () {
      let _this = this
      this.getAllConsensus('/consensus/agent/list/', {'pageSize': '6', 'pageNumber': this.pageNumber})
    },
    methods: {
      //获取全部共识列表
      getAllConsensus (url, params) {
        this.$fetch(url, params)
          .then((response) => {
            console.log(params);
            console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].creditRatios = response.data.list[i].creditRatio
                response.data.list[i].owndeposit = parseFloat(leftShift.times(response.data.list[i].owndeposit).toString())
                response.data.list[i].agentAddresss = (response.data.list[i].agentAddress).substr(0, 6) + '...' + (response.data.list[i].agentAddress).substr(-6)
                /*if (response.data.list[i].creditRatio !== 0) {
                  if (response.data.list[i].creditRatio > 0) {
                    response.data.list[i].creditRatio = ((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed() + '%'
                  } else {
                    response.data.list[i].creditRatio = (parseFloat(response.data.list[i].creditRatio) * 100).toFixed(6).substr(1, 5) + '%'
                  }
                } else {
                  response.data.list[i].creditRatio = '50%'
                }*/
                response.data.list[i].creditRatio = (((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed()).toString() + '%'
                response.data.list[i].totalDeposit = parseFloat(leftShift.times(response.data.list[i].totalDeposit).toString())
              }
              this.totalAll = response.data.total
              this.allConsensus = response.data.list
            } else {
              this.totalAll = 0
              this.allConsensus = []
            }
          }).catch((reject) => {
          console.log('获取全部共识列表：' + reject)
        })
      },
      //全部共识分页
      allConsensusSize (events) {
        this.pageNumber = events;
        this.getAllConsensus('/consensus/agent/list/', {'pageNumber': events, 'pageSize': '6'})
      },
      showDataList () {
        this.showData = !this.showData
      },
      //搜索功能
      searchConsensus () {
        if (this.keyword !== '') {
          const params = {'keyword': this.keyword, 'pageSize': '6', 'pageNumber': '1'}
          this.getAllConsensus('/consensus/agent/list/', params)
        } else {
          this.getAllConsensus('/consensus/agent/list/', {'pageSize': '6', 'pageNumber': '1'})
        }
      },
      //排序共识
      sortConsensus (sortName, sortKey) {
        this.showData = false
        this.sortValue = sortName
        if (this.keyword !== '') {
          const params = {'keyword': this.keyword, 'sortType': sortKey, 'pageSize': '6', 'pageNumber': '1'}
          this.getAllConsensus('/consensus/agent/list/', params)
        } else {
          const params = {'sortType': sortKey, 'pageSize': '6', 'pageNumber': '1'}
          this.getAllConsensus('/consensus/agent/list/', params)
        }

      },
      //显示隐藏信用值
      toggleShow (e) {
        this.creditValuesShow0 = !this.creditValuesShow0
      },
      //查看节点详情
      toNodePage (index) {
        this.$router.push({
          name: '/nodePage',
          params: {address: index},
        })
      }
    }
  }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .agency-node {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 10px;
        }
        .agency-node-top {
            width: 80%;
            margin: auto;
            height: 30px;
            .search-div {
                width: 433px;
                input[type="text"],
                select {
                    background-color: #17202e;
                    border: 1px solid #658ec7;
                    padding: 0 2px;
                }
                .el-select-dropdown__list {
                    width: 165px;
                }
                .el-input-group__append {
                    border-left: 0;
                    background-color: #658ec7;
                    border-color: #658ec7;
                    border-radius: 0;
                    color: #ffffff;
                    font-size: 12px;
                }
            }
            .select-div {
                margin-left: 3%;
                width: 165px;
                .sort-select {
                    width: 135px;
                    .sort-select-item {
                        width: 135px;
                    }
                }
            }
        }
        .agency-node-bottom {
            width: 80%;
            margin: auto;
            .div-icon {
                height: 145px;
                margin-top: 15px;
                margin-right: 6px;
                display: inline-block;
            }
        }
        .el-scrollbar__wrap {
            overflow: visible;
        }
    }

    .el-popper[x-placement^=bottom] .popper__arrow {
        display: none;
    }
</style>