<template>
  <div class="transfer">
    <Back :backTitle="this.$t('message.walletManagement')"></Back>
    <div class="transfer-info">
      <h2>NULS {{$t('message.transfer')}}</h2>

      <el-form :model="transferForm" :rules="transferRules" ref="transferForm">
        <el-form-item :label="$t('message.sourceAddress')+'：'" class="out-address">
          <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
          <i class="copy_icon copyBtn cursor-p" :data-clipboard-text="accountAddressValue"
             @click="accountCopy" :title="$t('message.c143')"></i>
        </el-form-item>
        <el-form-item :label="$t('message.destinationAddress')+'：'" prop="joinAddress">
          <el-input type="text" v-model.trim="transferForm.joinAddress" ref="joinAddress" @change="countFee"></el-input>
          <i class="cursor-p icons" @click="toUsersAddressList"></i>
        </el-form-item>
        <el-form-item :label="$t('message.transferAmount')+'：'" prop="joinNo">
          <span class="allUsable">{{$t('message.currentBalance')}}: {{usable}} NULS</span>
          <el-input type="text" v-model="transferForm.joinNo" :maxlength="17" @change="countFee"></el-input>
          <!-- <span class="allNo" @click="allUsable(usable)">{{$t('message.all')}}</span>-->
        </el-form-item>
        <el-form-item :label="$t('message.remarks')+'：'">
          <el-input type="textarea" v-model.trim="transferForm.remark"
                    :maxlength="30" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c28')+': '+this.fee+' NULS'">
        </el-form-item>
        <el-form-item class="transfer-submit">
          <el-button type="primary" @click="transferSubmit('transferForm')" id="transferSubmit">
            {{$t('message.c114')}}
          </el-button>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="dialogTableVisible" class="transfer-dialog">
        <el-table :data="userAddressList" @row-dblclick="dbcheckedAddress">
          <el-table-column property="userAddress" :label="$t('message.tabName')" min-width="280"
                           align='center'></el-table-column>
          <el-table-column property="userAlias" :label="$t('message.tabAlias')" width="70"
                           align='center'></el-table-column>
          <el-table-column property="userHelp" :label="$t('message.remarks')" width="110"
                           align='center'></el-table-column>
          <el-table-column :label="$t('message.operation')" width="100" align='center'>
            <template slot-scope="scope">
              <span class="cursor-p text-d"
                    @click="checkedAddress(scope.row.userAddress)">{{$t('message.select')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
    </div>
  </div>
</template>
<script>
  import Back from '@/components/BackBar.vue'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import copy from 'copy-to-clipboard'
  import * as config from '@/config.js'
  import {BigNumber} from 'bignumber.js'

  export default {
    data() {
      let selectAddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('message.addressNull')))
        } else {
          if (this.transferForm.checkPass !== '') {
            this.$refs.transferForm.validateField('joinNo')
          }
          callback()
        }
      };
      let checkJoinAddress = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.transferNull')))
        } else {
          this.address = localStorage.getItem('newAccountAddress');
          let re = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
          if (!re.exec(value)) {
            callback(new Error(this.$t('message.c168')))
          } else if (value === this.address) {
            callback(new Error(this.$t('message.addressOrTransfer')))
          } else {
            callback()
          }
        }
      };
      let checkJoinNo = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.transferNO')))
        }else {
          setTimeout(() => {
            let rightShift = new BigNumber(100000000);
            let leftShift = new BigNumber(0.00000001);
            if (rightShift.times(this.transferForm.joinNo).toString() === rightShift.times(this.usable).toString()) {
              this.transferForm.joinNo = leftShift.times(rightShift.times(this.usable) - rightShift.times(this.fee));
              value = this.transferForm.joinNo;
            }
            let re = /(^\+?|^\d?)\d*\.?\d+$/;
            let res = /^\d{1,8}(\.\d{1,8})?$/;
            if (!re.exec(value)) {
              callback(new Error(this.$t('message.transferNO1')))
            } else {
              let values = new BigNumber(value);
              let nu = new BigNumber(this.usable);
              if (values.comparedTo(nu.minus(this.fee)) === 1) {
                callback(new Error(this.$t('message.transferNO2')))
              } else if (value < this.fee) {
                callback(new Error(this.$t('message.transferNO3')))
              } else if (!res.exec(value)) {
                callback(new Error(this.$t('message.c136')))
              } else {
                callback()
              }
            }
          }, 100)

        }
      };
      return {
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        submitId: 'transferSubmit',
        usable: 0,
        fee: 0.00,
        accountAddress: [],
        remnant: 0,
        address: localStorage.getItem('newAccountAddress'),
        transferForm: {
          address: localStorage.getItem('newAccountAddress'),
          outName: '',
          joinAddress: '',
          joinNo: '',
          serviceNo: '',
          remark: ''
        },
        transferRules: {
          selectAddress: [
            {validator: selectAddress, trigger: 'blur'}
          ],
          joinAddress: [
            {validator: checkJoinAddress, trigger: 'blur'}
          ],
          joinNo: [
            {validator: checkJoinNo, trigger: 'blur'}
          ]
        },
        userAddressList: [],
        dialogTableVisible: false,
      }
    },
    components: {
      Back,
      AccountAddressBar,
      Password,
    },
    mounted() {
      let _this = this;
      //this.openDB();
      if (this.address === '') {
        this.address = localStorage.getItem('newAccountAddress')
      }
      this.getBalanceAddress('/accountledger/balance/' + this.address)
    },
    methods: {
      /**
       *根据账户地址获取账户余额
       * Get the balance of the account according to the account address
       * @param url
       */
      getBalanceAddress(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.usable = parseFloat(leftShift.times(response.data.usable.value).toString())
            }
          })
      },

      /**
       * 获取下拉选择地址
       *Get the drop-down selection address
       * @param chenckAddress
       */
      chenckAccountAddress(chenckAddress) {
        this.address = chenckAddress;
        this.accountAddressValue = chenckAddress;
        localStorage.setItem('newAccountAddress', this.address);
        this.getBalanceAddress('/accountledger/balance/' + chenckAddress);
        this.$refs.transferForm.validateField('joinAddress');
        this.$refs.transferForm.validateField('joinNo');
        this.countFee();
      },

      /**
       * 复制功能
       * copy
       */
      accountCopy() {
        //javaUtil.copy(this.accountAddressValue);
        copy(this.accountAddressValue);
        this.$message({
          message: this.$t('message.c129'), type: 'success', duration: '800'
        })
      },

      /**
       * 选择全部金额
       * Choose the total amount
       * @param balance
       */
      allUsable(balance) {
        if (balance === 0) {
          this.$message({
            message: this.$t('message.creditLow'),
            type: 'warning '
          })
        } else {
          this.countFee(balance);
          setTimeout(() => {
            this.transferForm.joinNo = config.FloatSub(balance, 0.01);
            this.$refs.transferForm.validateField('joinAddress');
            this.$refs.transferForm.validateField('joinNo')
          }, 500);
        }
      },

      /**
       * 创建usersDB
       * New usersDB
       */
      openDB() {
        let request = indexedDB.open('usersDB', 1);
        request.onupgradeneeded = function (e) {
          let db = e.target.result;
          // 如果不存在Users对象仓库则创建
          if (!db.objectStoreNames.contains('usersDB')) {
            let store = db.createObjectStore('addressList', {keyPath: 'userAddress', autoIncrement: false})
          }
        }
      },

      /**
       * 选择通讯录
       * Select the address book
       */
      toUsersAddressList() {
        /*this.$message({
          type: 'info', message: this.$t('message.c65'), duration: '800'
        })*/
        this.dialogTableVisible = true;
        let request = indexedDB.open('usersDB', 1);
        let dbData = [];
        request.onsuccess = function (event) {
          let db = event.target.result;
          let tx = db.transaction('addressList', 'readonly');
          let store = tx.objectStore('addressList');
          // 打开游标，遍历customers中所有数据
          store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
              dbData.push(cursor.value);
              cursor.continue()
            }
          }
        };
        this.userAddressList = dbData
      },

      /**
       * 选中通讯录地址
       *Address the address of the address book
       * @param address
       */
      checkedAddress(address) {
        this.transferForm.joinAddress = address;
        this.dialogTableVisible = false
      },

      /**
       * 双击选择通讯录地址
       *Double click the address book address
       * @param row
       * @param event
       */
      dbcheckedAddress(row, event) {
        this.transferForm.joinAddress = row.userAddress;
        this.dialogTableVisible = false
      },

      /**
       *计算手续费
       *Calculation fee
       **/
      countFee() {
        if (this.transferForm.joinAddress !== '' && this.transferForm.joinNo > 0) {
          let rightShift = new BigNumber(100000000);
          let params = "address=" + this.address
            + "&toAddress=" + this.transferForm.joinAddress
            + "&amount=" + rightShift.times(this.transferForm.joinNo)
            + "&remark=" + this.stripscript(this.transferForm.remark.replace(/\n\r/g, ""));
          //console.log(params);
          this.$fetch('/accountledger/transfer/fee?' + params)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                let leftShift = new BigNumber(0.00000001);
                this.fee = leftShift.times(response.data.value);
              }
            });
        }
      },

      /**
       * 字符转换
       **/
      stripscript(str) {
        let s = "";
        if (str.length === 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
      },


      /**
       * 确认转账
       * Confirmation of transfer
       * @param fromName
       */
      transferSubmit(fromName) {
        this.$refs[fromName].validate((valid) => {
          if (valid) {
            if (localStorage.getItem('encrypted') === "true") {
              this.$refs.password.showPassword(true)
            } else {
              this.$confirm(this.$t('message.c172'), '', {
                confirmButtonText: this.$t('message.confirmButtonText'),
                cancelButtonText: this.$t('message.cancelButtonText'),
              }).then(() => {
                this.toSubmit('')
              }).catch(() => {

              })
            }
          } else {
            return false
          }
        })
      },

      /**
       * 输入密码确定交易
       *Enter the password to determine the transaction
       * @param password
       */
      toSubmit(password) {
        let rightShift = new BigNumber(100000000);
        let param = '{"address":"' + this.address
          + '","toAddress":"' + this.transferForm.joinAddress
          + '","amount":' + rightShift.times(this.transferForm.joinNo)
          + ',"password":"' + password
          + '","remark":"' + this.transferForm.remark.replace(/\n/g, "") + '"}';
        //console.log(param);
        this.$post('/accountledger/transfer', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                message: this.$t('message.passWordSuccess'),
                type: 'success'
              });
              this.transferForm.joinAddress = '';
              this.transferForm.joinNo = '';
              this.transferForm.remark = '';
              this.getBalanceAddress('/account/balance/' + this.transferForm.address);
              sessionStorage.setItem('walletActiveName', 'second');
              this.$router.push({
                name: '/wallet',
              })
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          })
      },
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .transfer {
    width: 1024px;
    margin: auto;
    .transfer-info {
      width: 90%;
      margin: auto;
      h2 {
        text-align: center;
        line-height: 30px;
        height: 50px;
      }
      .el-form {
        width: 60%;
        margin: auto;
        .el-form-item {
          margin-bottom: 24px;
          .el-form-item__label {
            color: #ffffff;
            padding: 0 5px 0 0;
            line-height: 20px;
          }
          .el-form-item__content {
            .address-select {
              width: 550px;
              .sub-selected-value {
                .sub-select-list {
                  margin-left: -3px;
                  .sub-select-item {
                    width: 547px;
                  }
                }
              }
            }
            .copy_icon {
              position: absolute;
              top: 2px;
              right: -33px;
              width: 30px;
              height: 20px;
              display: block;
              float: left;
              background-size: @bg-size;
              background: @bg-image -198px -46px;
            }
            .icons {
              width: 25px;
              height: 25px;
              background-size: @bg-size;
              background: @bg-image -54px -74px;
              position: relative;
              z-index: 8;
              float: right;
              margin-top: -35px;
              margin-right: 0;
            }
            .el-form-item__error {
              top: 85%;
            }
            .allUsable {
              line-height: 20px;
            }
            .allNo {
              margin-top: -40px;
            }
            .el-button--primary {
              margin-top: 30px;
            }
            .el-input {
              .el-input__inner {
                color: #ffffff;
                padding: 0 5px;
              }
            }
            .el-textarea {
              .el-textarea__inner {
                color: #ffffff;
                padding: 5px;
                border-radius: 1px;
              }
            }
          }
        }
        .out-address {
          .el-form-item__label {
            line-height: 30px;
            float: none;
          }
        }
        .transfer-submit {
          text-align: center;
        }
      }
    }
  }
</style>
