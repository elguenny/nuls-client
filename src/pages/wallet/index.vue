<template>
  <div class="wallet">
    <div class="search">
      <div class="account-top">
        <label>{{$t('message.indexAccountAddress')}}：</label>
        <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
      </div>
      <div class="wallet-i">
        <i class="copy_icon copyBtn cursor-p" :data-clipboard-text="this.accountAddressValue"
           @click="accountCopy" :title="$t('message.c143')"></i>
        <i class="zhanghu_icon fr cursor-p" @click="accountChoice" :title="$t('message.accountManagement')"></i>
      </div>
    </div>
    <div class="wallet-tab cl">
      <el-tabs v-model="activeName" @tab-click="handleClick" @dblclick="tab-clicks">
        <el-tab-pane :label="$t('message.indexAccountHome')" name="first">
          <el-table :data="accountData">
            <el-table-column :label="$t('message.indexProperty')" width="100" align='center'>
              <template slot-scope="scope">
                <span>{{ scope.row.asset }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('message.indexSum')" width="180" align='center'>
              <template slot-scope="scope">
                <span>{{ scope.row.balance }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('message.indexUsable')" width="280" align='center'>
              <template slot-scope="scope">
                <span>{{ scope.row.usable }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('message.indexLock')" width="280" align='center'>
              <template slot-scope="scope">
                <span class="cursor-p text-d" @click="toLocked(accountAddressValue)">{{ scope.row.locked }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('message.operation')" align='center'>
              <template slot-scope="scope">
                <span class="cursor-p text-d" @click="toTransfer(accountAddressValue)">{{$t('message.transfer')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('message.transactionRecord')" name="second">
          <el-table :data="dealList" @filter-change="changeType" v-loading="loading">
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
          <el-pagination layout="prev, pager, next" :page-size="20" :total=this.totalAll class="cb"
                         v-show="totalAllOk = this.totalAll>20 ?true:false"
                         @current-change="txIdConsensusSize"></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import CodeBar from '@/components/CodeBar.vue'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import {copys,LeftShiftEight,getLocalTime} from '@/api/util.js'
  import {getAccountAssets,getAccountTxList} from '@/api/httpData.js'

  export default {
    data() {
      return {
        //交易记录列表加载loading
        loading: true,
        //默认账户
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        //账户资产
        accountData: [],
        //交易信息
        dealList: [],
        //tab名称
        activeName: sessionStorage.getItem('walletActiveName'),
        //总页数
        totalAll: 0,
        //当前页
        pages: 1 ,
        //类型
        types: '',
        //定时器
        walletSetInterval: null,
      }
    },
    components: {
      CodeBar,
      AccountAddressBar,
    },
    mounted() {
      this.getAccountAssets(this.accountAddressValue);

      /**
       * 切换交易记录tab
       *Switching transaction record tab
       */
      if (this.activeName === 'second') {
        this.getAccountTxList(this.accountAddressValue, {
          'pageSize': 20,
          'pageNumber': 1
        })
      }

      /**
       * 查询交易列表
       * 5second query trade list
       */
      this.walletSetInterval = setInterval(() => {
        if (this.activeName === 'first') {
          this.getAccountAssets(this.accountAddressValue)
        } else {
          if (this.types !== '') {
            this.getAccountTxList(this.accountAddressValue, {
              'type': this.types,
              'pageSize': 20,
              'pageNumber': this.pages
            })
          } else {
            this.getAccountTxList( this.accountAddressValue, {
              'pageSize': 20,
              'pageNumber': this.pages
            })
          }
        }
      }, 5000)
    },
    destroyed() {
      clearInterval(this.walletSetInterval)
    },
    methods: {
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
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].balance = LeftShiftEight(response.data.list[i].balance).toString();
                response.data.list[i].locked = LeftShiftEight(response.data.list[i].locked).toString();
                response.data.list[i].usable = LeftShiftEight(response.data.list[i].usable).toString()
              }
              this.accountData = response.data.list
            }
          })
      },

      /**
       * 根据用户地址获取用户交易列表
       *Obtaining a user's trade list based on the user address
       * @param address params
       */
      getAccountTxList(address, params) {
        getAccountTxList(address, params)
          .then((response) => {
            //console.log(response);
            if(response.success){
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].time = moment(getLocalTime(response.data.list[i].time)).format('YYYY-MM-DD HH:mm:ss')
              }
              this.totalAll = response.data.total;
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
       * 获取下拉选择地址
       * Get the drop-down selection address
       * @param chenckAddress
       */
      chenckAccountAddress(chenckAddress) {
        //console.log(chenckAddress)
        this.accountAddressValue = chenckAddress;
        if (this.activeName === 'first') {
          this.getAccountAssets(chenckAddress)
        } else {
          this.totalAll = 0;
          this.types = '';
          this.getAccountTxList(chenckAddress, {'pageSize': 20, 'pageNumber': 1})
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

        this.types = typeValue.type[0];
        this.getAccountTxList(this.accountAddressValue, {
          'type': typeValue.type[0],
          'pageSize': 20,
          'pageNumber': 1
        })
      },

      /**
       * tab切换
       * tab
       * @param tab
       * @param event
       */
      handleClick(tab, event) {
        if (tab.name !== 'first') {
          this.activeName = 'second';
          let params = {
            'pageSize': 20,
            'pageNumber': 1
          };
          this.getAccountTxList( this.accountAddressValue, params)
        } else {
          sessionStorage.setItem('walletActiveName', tab.name);
          this.types='';
          this.pages = 1;
          this.walletHide = true;
          this.getAccountAssets(this.accountAddressValue)
        }
      },

      /**
       * 复制功能
       * copy
       */
      accountCopy() {
        copys(this.accountAddressValue);
        this.$message({
          message: this.$t('message.c129'), type: 'success', duration: '800'
        });
      },

      /**
       * 账户管理跳转
       *Account management jump
       */
      accountChoice() {
        this.$router.push({
          name: '/userInfo'
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

      /**
       * 跳转转账
       * To transfer
       * @param address
       */
      toTransfer(address) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          this.$router.push({
            name: '/transfer',
            params: {address: address},
          })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      },
    },
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .wallet {
    width: 1024px;
    margin: 68px auto 0;
    background-color: #0c1323;
    .account-top {
      margin: 0;
      float: left;
      width: 495px;
      .address-select {
        .sub-selected-value {
          .sub-select-list {
            .sub-select-item {
              width: 410px;
            }
          }
        }
      }
      .el-input__suffix {
        right: -15px;
      }
    }
    .search {
      width: 100%;
      margin: auto;
      height: 35px;
      .search-account {
        width: 523px;
        .lable-title {
          font-size: 14px;
          margin-left: 17px;
        }
        .el-input__suffix {
          margin-top: 0;
        }
        .el-input__inner {
          border: 1px solid #658ec7;
        }
        .el-select .el-input .el-select__caret {
          font-size: 1rem;
        }
      }
      .wallet-i {
        height: 30px;
        width: 180px;
        float: left;
        i {
          width: 30px;
          height: 20px;
          display: block;
          float: left;
          background-size: @bg-size;
          background: @bg-image
        }
        .copy_icon {
          background-position: -198px -46px;
        }
        .qr_icon {
          background-position: -235px -44px;
        }
        .zhanghu_icon {
          background-position: -265px -46px;
          margin-left: 20px;
        }
      }
    }
    .wallet-hide {
      top: 19px;
      position: relative;
      z-index: 800;
      .icon {
        width: 30px;
        height: 20px;
        display: block;
        float: right;
        margin-right: 5%;
        background-size: @bg-size;
        background: @bg-image;
        border-bottom: 1px solid #17202e;
      }
      .icon-eye {
        background-position: -159px -46px;
      }
      .icon-eye-blocked {
        background-position: -226px -77px;
      }
      .el-icon-view {
        font-size: 1rem;
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
    .wallet-tab {
      width: 100%;
      margin: auto;
      .el-tabs__item {
        color: #FFFFFF;
        &:hover {
          color: #409EFF;
        }
      }
      .el-tabs__item.is-active {
        color: #FFFFFF;
      }
      .el-tabs__nav-wrap::after {
        background: rgba(87, 107, 139, 0.1);
      }
    }
    .el-select {
      width: 400px;
    }

  }

  .el-table-filter {
    border: 1px solid #17202e;
    background-color: #17202e;
    max-height: 310px;
    overflow-y: auto;
    ul {
      min-width: 80px;
      li {
        font-size: 12px;
        text-align: center;
        &.el-table-filter__list-item {
          line-height: 32px;
          &.is-active {
            background-color: #658ec7;
          }
        }
        &:hover {
          background-color: #222d3f;
        }
      }
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: #0c1323;
      border-radius: 10px;
    }

    &::-webkit-scrollbar {
      width: 3px;
      background-color: #0c1323;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-image: -webkit-gradient(linear, 40% 0%, 75% 84%, from(#FFFFFF), to(#FFFFFF), color-stop(.6, #FFFFFF))
    }
  }

  .el-select-dropdown__list {
    width: 413px;
  }

  .el-popper[x-placement^=bottom] .popper__arrow {
    display: none;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(87, 107, 139, 0.2);
    .cell {
      input {
        background: rgba(87, 107, 139, 0);
      }
    }
  }
</style>
