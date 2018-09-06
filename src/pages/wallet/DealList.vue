<template>
  <div class="deal-list">
    <Back :backTitle="this.$t('message.walletManagement')"></Back>

    <div class="account-top">
      <label>{{$t('message.indexAccountAddress')}}：</label>
      <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
    </div>
    <h3>{{$t('message.transactionRecord')}}</h3>
    <div class="search">
     <!-- 资产类型-->
      <el-select v-model="dealRegion" :popper-append-to-body="false" :placeholder="$t('message.c207')" class="deal-region" @change="changeDeal">
        <el-option :label="$t('message.c208')" value="0"></el-option>
        <el-option v-for="item in dealOptions" :label="item.asset" :value="item.address" :key="item.address">
        </el-option>
      </el-select>
      <!--交易类型-->
      <el-select v-model="typeRegion" :popper-append-to-body="false" v-show="this.nulsIf"  :placeholder="$t('message.transactionType')" class="type-region" @change="changeType">
        <el-option :label="$t('message.c209')" value="0"></el-option>
        <el-option v-for="item in typeOptions" :label="$t('message.type'+item.label)" :value="item.value" :key="item.value">
        </el-option>
      </el-select>

      <!--<el-select v-model="incomeRegion" :popper-append-to-body="false" placeholder="收支类型" class="income-region">
        <el-option label="进账" value="shanghai"></el-option>
        <el-option label="出账" value="beijing"></el-option>
      </el-select>

      <el-date-picker v-model="deallTime" type="daterange" align="right"
                      range-separator="至" start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="deallOptions">
      </el-date-picker>-->

    </div>
    <div class="deal-list-info cl">
      <el-table :data="dealList" @filter-change="changeType">
        <el-table-column prop="symbol" :label="$t('message.c207')" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.symbol === null ? "NULS" : scope.row.symbol}}
          </template>
        </el-table-column>
        <el-table-column prop="txType" :label="$t('message.transactionType')" width="120" align="center">
          <template slot-scope="scope">
            {{$t('message.type'+scope.row.txType)}}
          </template>
        </el-table-column>
        <el-table-column label="txid" min-width="195" align='center'>
          <template slot-scope="scope">
								<span @click="toTxid(scope.row.txHash,scope.row.txType)"
                      class="cursor-p text-d overflow"
                      v-show="scope.row.status !==0">
									{{ scope.row.txHash}}
								</span>
            <span class="overflow" v-show="scope.row.symbol !== null && scope.row.status ===0">
									{{ scope.row.txHash}}
								</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.time')" width="145" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.time}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.assetChange')" width="138" align='center'>
          <template slot-scope="scope">
            <span :class="scope.row.info > 0 ? 'add':'minus'">{{ scope.row.info }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.state')" width="85" align='center'>
          <template slot-scope="scope">
            <span>{{ $t('message.statusS'+scope.row.status) }}</span>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        v-show="this.totalAll > 20"
        class="cb"
        @current-change="txIdConsensusSize"
        :current-page="pages"
        :page-size="20"
        layout="prev, pager, next"
        :total="totalAll">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Back from '@/components/BackBar.vue'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import {copys, LeftShiftEight, getLocalTime} from '@/api/util.js'
  import {getAccountAssets, getAccountTxList} from '@/api/httpData.js'

  export default {
    data() {
      return {
        //默认账户
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        //交易信息
        dealList: [],
        //总页数
        totalAll: parseInt(sessionStorage.getItem('walletTotalAll')) || 100,
        //当前页
        pages: parseInt(sessionStorage.getItem('walletPages')) || 1,
        //类型
        //资产类型 this.$route.query.address
        dealRegion: this.$route.query.address ===null ? 'NULS': this.$route.query.address,
        dealOptions: [],
        nulsIf:this.$route.query.address ===null ? true:false,
        //交易类型
        typeRegion: '',
        typeOptions:[
          { value:'1',label:'1' },
          { value:'2',label:'2' },
          { value:'3',label:'3' },
          { value:'4',label:'4' },
          { value:'5',label:'5' },
          { value:'6',label:'6' },
          { value:'7',label:'7' },
          { value:'8',label:'8' },
          { value:'9',label:'9' },
          { value:'100',label:'100' },
          { value:'101',label:'101' },
          { value:'102',label:'102' },
          { value:'103',label:'103' },
        ],

        //收支类型
        incomeRegion: '',
        //时间time
        deallOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        deallTime: '',
        //定时器
        walletSetInterval: null,
      }
    },
    components: {
      Back,
      AccountAddressBar,
    },
    mounted() {
      this.getAccountAssets(this.accountAddressValue);

      this.getAccountTxList(this.accountAddressValue, '?assetType='+this.dealRegion+'&type='+this.typeRegion+'&pageNumber='+this.pages+'&pageSize=20');
      /**
       * 查询交易列表
       * 5second query trade list
       */
      this.walletSetInterval = setInterval(() => {
        this.getAccountTxList(this.accountAddressValue, '?assetType='+this.dealRegion+'&type='+this.typeRegion+'&pageNumber='+this.pages+'&pageSize=20')
      }, 10000)
    },
    destroyed() {
      clearInterval(this.walletSetInterval)
    },
    methods: {
      /**
       * 获取下拉选择地址
       * Get the drop-down selection address
       * @param chenckAddress
       */
      chenckAccountAddress(chenckAddress) {
        this.getAccountAssets(chenckAddress);
        this.getAccountTxList(chenckAddress, '?assetType='+this.dealRegion+'&type='+this.typeRegion+'&pageNumber='+this.pages+'&pageSize=20');
      },

      /**
       * 根据账户地址获取资产列表
       *Obtaining a list of assets based on the account address
       * @param url
       */
      getAccountAssets(address) {
        getAccountAssets(address)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              for (let i in response.data.list) {
                if(!response.data.list[i].address){
                  response.data.list[i].address = "NULS";
                }
              }
              this.dealOptions = response.data.list;
            }
          })
      },

      /**
       * 根据用户地址获取用户交易列表
       *Obtaining a user's trade list based on the user address
       * @param address params
       */
      getAccountTxList(address, params) {
        //console.log(params);
        getAccountTxList(address, params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].time = moment(getLocalTime(response.data.list[i].time)).format('YYYY-MM-DD HH:mm:ss')
              }
              this.totalAll = parseInt(response.data.total);
              this.dealList = response.data.list;
              this.loading = false;
            }
          })
      },

      /**
       * 交易列表分页
       * Transaction list paging
       * @param events
       */
      txIdConsensusSize(events) {
        this.pages = events;
        this.getAccountTxList(this.accountAddressValue, '?assetType='+this.dealRegion+'&type='+this.typeRegion+'&pageNumber='+this.pages+'&pageSize=20')
      },

      /**
       * 选择资产类型查询
       * @param dealValue
       **/
      changeDeal(dealValue){
        //console.log(dealValue)
        this.pages = 1;
        let dealvalue = '';
        this.typeRegion = '';
        if(dealValue === 'NULS'){
          dealvalue = 'NULS';
          this.nulsIf = true;
        }else if(dealValue === '0'){
          dealValue = '';
          this.dealRegion ='';
          this.nulsIf = false;
        }else {
          this.nulsIf = false;
          dealvalue = dealValue;
        }
        clearInterval(this.walletSetInterval);
        this.getAccountTxList(this.accountAddressValue, '?assetType='+dealvalue+'&type='+this.typeRegion+'&pageNumber='+this.pages+'&pageSize=20');
      },

      /**
       * 选择交易类型查询
       * Select transaction type query
       * @param typeValue
       */
      changeType(typeValue) {
        //console.log(typeValue)
        clearInterval(this.walletSetInterval);
        this.getAccountTxList(this.accountAddressValue, '?assetType='+this.dealRegion+'&type='+this.typeRegion+'&pageNumber='+this.pages+'&pageSize=20');
      },

      /**
       * toTxid跳转
       * toTxid
       * @param txId
       */
      toTxid(hash, type) {
        sessionStorage.setItem('walletActiveName', 'second');
        this.$router.push({
          name: 'dealInfo',
          query: {hash: hash, type: type},
        })
      },

      /**
       * 跳转冻结列表
       * To locked list
       * @param address
       */
      toLocked(address) {
        this.$router.push({
          name: '/freezeList',
          params: {address: address},
        })
      },
    },

    beforeRouteLeave(to, from, next) {
      if (to.name === 'dealInfo') {
        sessionStorage.setItem('walletTotalAll', this.totalAll.toString());
        sessionStorage.setItem('walletPages', this.pages);
        sessionStorage.setItem('walletTypes', this.types);
      } else {
        sessionStorage.removeItem('walletTotalAll');
        sessionStorage.removeItem('walletPages');
        sessionStorage.removeItem('walletTypes')
      }
      next();
    },
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .deal-list {
    width: 1024px;
    margin: 20px auto 0;
    background-color: #0c1323;
    h3{
      font-size: 14px;
    }
    .account-top {
      margin: 30px 0;

    }
    .search {
      width: 100%;
      margin: 10px auto;
      height: 35px;
      .deal-region, .type-region, .income-region {
        width: 150px;
        .el-input--suffix {
          .el-input__suffix {
            height: 25px;
          }
        }
        .el-select-dropdown {
          width: 150px;
        }
      }
      .el-date-editor {
        background-color: #0b1422;
        border: 1px solid #24426c;
        float: right;
        .el-range__icon, .el-range__close-icon {
          line-height: 18px;
        }
        .el-range-separator {
          line-height: 18px;
          color: #FFFFFF;
        }
        .el-range-input {
          background-color: #0b1422;
          color: #FFFFFF;
        }
      }
    }
    .cell {
      input {
        border: none;
        width: 100%;
        background-color: #17202e;
        text-align: center;
      }
      span {
        font-size: 12px;
      }
    }
    .el-select {
      width: 400px;
    }
  }
</style>
