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
      <div class="wallet-list">
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
              <span class="cursor-p text-d" @click="toLocked(accountAddressValue)" v-show="!scope.row.address">{{ scope.row.locked }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('message.operation')" align='center'>
            <template slot-scope="scope">
              <span class="cursor-p text-d" @click="toTransfer(scope.row)">{{$t('message.transfer')}}</span>
              <span class="cursor-p text-d" @click="toDealList(scope.$index, scope.row)">{{$t('message.transactionRecord')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import {copys, LeftShiftEight,Power,Division,getLocalTime} from '@/api/util.js'
  import {getAccountAssets, getAccountTxList} from '@/api/httpData.js'

  export default {
    data() {
      return {
        //默认账户
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        //账户资产
        accountData: [],
        //定时器
        walletSetInterval: null,
      }
    },
    components: {
      AccountAddressBar,
    },
    mounted() {
      this.getAccountAssets(this.accountAddressValue);

      this.walletSetInterval = setInterval(() => {
          this.getAccountAssets(this.accountAddressValue)
      }, 10000)
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
              for (let i in response.data.list) {
                //根据是否有地址判断 代币和非代币
                if(!response.data.list[i].address){
                  response.data.list[i].balance = LeftShiftEight(response.data.list[i].balance).toString();
                  response.data.list[i].locked = LeftShiftEight(response.data.list[i].locked).toString();
                  response.data.list[i].usable = LeftShiftEight(response.data.list[i].usable).toString()
                }else {
                  response.data.list[i].balance =Division( response.data.list[i].balance,Power(response.data.list[i].decimals)) .toString();
                  response.data.list[i].usable = response.data.list[i].balance
                }
              }
              this.accountData = response.data.list
            }
          })
      },

      /**
       * 获取下拉选择地址
       * Get the drop-down selection address
       * @param chenckAddress
       */
      chenckAccountAddress(chenckAddress) {
        this.accountAddressValue = chenckAddress;
        this.getAccountAssets(chenckAddress)
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
      toTransfer(row) {
        //console.log(row);
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          this.$router.push({
            name: 'transfer',
            //params: {address: address},
             query: {address: row.address,balance:row.usable,asset:row.asset,decimals:row.decimals}
          })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      },

      //跳转交易记录
      toDealList(index,row){
        this.$router.push({
          name: 'deallist'
        });
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
    .wallet-tab {
      width: 100%;
      margin: auto;
      .wallet-list{
        margin-top: 20px;
      }
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
  }
</style>
