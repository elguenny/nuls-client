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
      <div class="div-icon cursor-p" v-for="(item,index) in allConsensus" @click="toNodePage(item.agentHash)">
        <p class="subscript" :class="item.status === 0  ? 'stay' : ''">
          {{ $t('message.status'+item.status) }}
        </p>
        <h3>{{item.agentId}}</h3>
        <ul>
          <li class="overflow"><label>{{$t('message.c16')}}：</label>{{ item.agentName ? item.agentName :
            item.agentAddresss }}
          </li>
          <li><label>{{$t('message.c17')}}：</label>{{ item.commissionRate }}%</li>
          <li><label>{{$t('message.c25')}}：</label>{{ (item.deposit).toFixed(2)}} NULS</li>
          <li class="cb">
            <label class="fl">{{$t('message.c47')}}：</label>{{(item.totalDeposit).toFixed(2)}}
          </li>
          <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
            <label class="fl cursor-p">{{$t('message.c18')}}:</label>
            <ProgressBar :colorData="item.creditVals < 0 ? '#f64b3e':'#82bd39'"
                         :widthData="item.creditVal"></ProgressBar>
          </li>
        </ul>
      </div>
    </div>
    <el-pagination layout="prev, pager, next" :page-size="16" :total=this.totalAll
                   v-show="totalOK = this.totalAll > 16 ? true:false" class="cb"
                   @current-change="allConsensusSize"></el-pagination>
  </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import ProgressBar from './../../components/ProgressBar.vue'
  import {BigNumber} from 'bignumber.js'

  export default {
    data() {
      return {
        showData: false,
        sortValue: this.$t('message.c46'),
        indexTo: this.$route.query.indexTo,
        sortKey: '',
        sortConsensusList: [
          {sortName: this.$t('message.c46'), sortKey: ''},
          {sortName: this.$t('message.c17'), sortKey: 'commissionRate'},
          {sortName: this.$t('message.c25'), sortKey: 'deposit'},
          {sortName: this.$t('message.c18'), sortKey: 'creditVal'}
        ],
        keyword: '',
        selectKeyword: '',
        creditValuesShow0: false,
        creditValuesShow1: false,
        creditValuesShow2: false,

        allConsensus: [],
        totalAll: 0,
        pageNumber: 1,
      }
    },
    components: {
      Back,
      ProgressBar,
    },
    mounted() {
      let _this = this;
      let params = '';
      if (this.indexTo === '1') {
        params = {'pageSize': '16', 'pageNumber': this.pageNumber};
        this.indexTo = '2';
        sessionStorage.removeItem("keyword");
        sessionStorage.removeItem("sortKey");
        sessionStorage.removeItem("pageNumber")
      } else {
        params = {
          'keyword': sessionStorage.getItem('keyword'),
          'sortType': sessionStorage.getItem('sortKey'),
          'pageSize': '16',
          'pageNumber': sessionStorage.getItem('pageNumber')
        };
      }
      //console.log(params);
      this.getAllConsensus('/consensus/agent/list/', params)
    },
    methods: {
      //获取全部共识列表
      getAllConsensus(url, params) {
        this.$fetch(url, params)
          .then((response) => {
            console.log(params);
            console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].creditVals = response.data.list[i].creditVal;
                response.data.list[i].deposit = parseFloat(leftShift.times(response.data.list[i].deposit).toString());
                response.data.list[i].agentAddresss = (response.data.list[i].agentAddress).substr(0, 6) + '...' + (response.data.list[i].agentAddress).substr(-6);
                response.data.list[i].creditVal = (((((response.data.list[i].creditVal + 1) / 2)) * 100).toFixed()).toString() + '%';
                response.data.list[i].totalDeposit = parseFloat(leftShift.times(response.data.list[i].totalDeposit).toString())
              }
              this.$nextTick(function () {
                //this.paginationShow = true
                this.totalAll = response.data.total;
              });
              this.allConsensus = response.data.list
            } else {
              this.totalAll = 0;
              this.allConsensus = []
            }
          })
      },
      //全部共识分页
      allConsensusSize(events) {
        this.pageNumber = events;
        let params = '';
        if (this.keyword !== '') {
          params = {'keyword': this.keyword, 'pageSize': '16', 'pageNumber': events}
        } else if (this.sortValue !== 'Comprehensive') {
          params = {'sortType': this.sortKey, 'pageSize': '16', 'pageNumber': events}
        } else if (this.keyword !== '' && this.sortValue !== 'Comprehensive') {
          params = {'keyword': this.keyword, 'sortType': this.sortKey, 'pageSize': '16', 'pageNumber': events}
        } else {
          params = {'pageSize': '16', 'pageNumber': events}
        }
        this.getAllConsensus('/consensus/agent/list/', params)
      },
      showDataList() {
        this.showData = !this.showData
      },
      //搜索功能
      searchConsensus() {
        if (this.keyword !== '') {
          const params = {'keyword': this.keyword, 'pageSize': '16', 'pageNumber': '1'};
          this.getAllConsensus('/consensus/agent/list/', params)
        } else {
          this.getAllConsensus('/consensus/agent/list/', {'pageSize': '16', 'pageNumber': '1'})
        }
      },
      //排序共识
      sortConsensus(sortName, sortKey) {
        this.totalAll = 0;
        this.showData = false;
        this.sortValue = sortName;
        this.sortKey = sortKey;
        if (this.keyword !== '') {
          const params = {'keyword': this.keyword, 'sortType': sortKey, 'pageSize': '16', 'pageNumber': '1'};
          this.getAllConsensus('/consensus/agent/list/', params);
        } else {
          const params = {'sortType': sortKey, 'pageSize': '16', 'pageNumber': '1'};
          this.getAllConsensus('/consensus/agent/list/', params);
        }

      },
      //显示隐藏信用值
      toggleShow(e) {
        this.creditValuesShow0 = !this.creditValuesShow0
      },
      //查看节点详情
      toNodePage(index) {
        this.$router.push({
          path: '/consensus/nodePage',
          query: {address: index}
        });
        sessionStorage.setItem("keyword", this.keyword);
        sessionStorage.setItem("sortKey", this.sortKey);
        //sessionStorage.setItem("pageNumber", this.pageNumber)
      }
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .agency-node {
    width: 1024px;
    margin: auto;
    h2 {
      font-size: 16px;
      text-align: center;
      line-height: 20px;
      margin-bottom: 30px;
    }
    .agency-node-top {
      width: 100%;
      margin: auto;
      height: 30px;
      .search-div {
        width: 70%;
        input[type="text"],
        select {
          background-color: #17202e;
          border: 1px solid #658ec7;
          padding: 0 6px;
          color: #FFFFFF;
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
          width: 260px;
          .sort-select-item {
            width: 260px;
          }
        }
      }
    }
    .agency-node-bottom {
      width: 100%;
      margin: auto;
      .div-icon {
        height: 145px;
        margin-top: 5px;
        margin-right: 8px;
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
