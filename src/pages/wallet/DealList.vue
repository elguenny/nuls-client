<template>
  <div class="deal-list">
    <Back :backTitle="this.$t('message.walletManagement')"></Back>
    <div class="search">

    </div>
    <div class="deal-list-info cl">
      <el-table :data="dealList" @filter-change="changeType">
        <el-table-column
          prop="txType"
          :label="$t('message.transactionType')"
          width="120"
          align="center"
          column-key="type"
          :filters="[{text: this.$t('message.type1'), value: '1'},
                         {text: this.$t('message.type2'), value: '2'},
                         /*{text: this.$t('message.type3'), value: '3'},
                         {text: this.$t('message.type4'), value: '4'},
                         {text: this.$t('message.type5'), value: '5'},*/
                         {text: this.$t('message.type3'), value: '3'},
                         {text: this.$t('message.type4'), value: '4'},
                         {text: this.$t('message.type5'), value: '5'},
                         {text: this.$t('message.type6'), value: '6'},
                          /* {text: this.$t('message.type7'), value: '7'},
                          {text: this.$t('message.type8'), value: '8'},*/
                          {text: this.$t('message.type9'), value: '9'},
                          ]"
          :filter-multiple=false>
          <template slot-scope="scope">
            {{$t('message.type'+scope.row.txType)}}
          </template>
        </el-table-column>
        <el-table-column label="txid" min-width="195" align='center'>
          <template slot-scope="scope">
								<span @click="toTxid(scope.row.txHash)" class="cursor-p text-d overflow">
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
        types: sessionStorage.getItem('walletTypes') || '',
        //定时器
        walletSetInterval: null,
      }
    },
    components: {
      Back,
    },
    mounted() {
      this.getAccountTxList(this.accountAddressValue, {
        'type': this.types,
        'pageSize': 20,
        'pageNumber': this.pages
      });
      /**
       * 查询交易列表
       * 5second query trade list
       */
      this.walletSetInterval = setInterval(() => {
        if (this.types !== '') {
          this.getAccountTxList(this.accountAddressValue, {
            'type': this.types,
            'pageSize': 20,
            'pageNumber': this.pages
          })
        } else {
          this.getAccountTxList(this.accountAddressValue, {
            'pageSize': 20,
            'pageNumber': this.pages
          })
        }
      }, 10000)
    },
    destroyed() {
      clearInterval(this.walletSetInterval)
    },
    methods: {

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
        if (this.types !== '') {
          this.getAccountTxList(this.accountAddressValue, {
            'type': this.types,
            'pageSize': 20,
            'pageNumber': this.pages
          })
        } else {
          this.getAccountTxList(this.accountAddressValue, {
            'pageSize': 20,
            'pageNumber': this.pages
          })
        }

      },

      /**
       * 选择交易类型查询
       * Select transaction type query
       * @param typeValue
       */
      changeType(typeValue) {
        //console.log(typeValue.type[0]);
        let liValue = 0;
        if (typeValue.type[0]) {
          switch (parseInt(typeValue.type[0])) {
            case 9:
              liValue = '7';
              break;
            default:
              liValue = typeValue.type[0]
          }
        }
        let list2 = document.getElementsByClassName('el-table-filter__list')[0];//用class获取元素
        let li = list2.getElementsByTagName('li');
        for (let i = 0; i < li.length; i++) {
          li[i].className = 'el-table-filter__list-item'
        }
        li[liValue].className = 'el-table-filter__list-item is-active';

        this.types = typeValue.type[0] === undefined ? '' : typeValue.type[0];
        this.getAccountTxList(this.accountAddressValue, {
          'type': this.types,
          'pageSize': 20,
          'pageNumber': 1
        })
      },

      /**
       * toTxid跳转
       * toTxid
       * @param txId
       */
      toTxid(txId) {
        sessionStorage.setItem('walletActiveName', 'second');
        this.$router.push({
          name: 'dealInfo',
          query: {hash: txId},
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
    .search {
      width: 100%;
      margin: 10px auto;
      height: 35px;
      border:1px solid #81bc3b;
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
