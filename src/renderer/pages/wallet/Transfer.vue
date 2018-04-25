<template>
    <div class="transfer">
        <Back :backTitle="this.$t('message.walletManagement')"></Back>
        <div class="transfer-info">
            <h2>{{$t('message.transfer')}}</h2>
            <el-form :model="transferForm" :rules="rules" ref="transferForm">
                <el-form-item :label="$t('message.sourceAddress')+'：'" class="out-address">
                    <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
                </el-form-item>
                <el-form-item :label="$t('message.destinationAddress')+'：'" class="join-address" prop="joinAddress">
                    <el-input type="text" v-model.trim="transferForm.joinAddress"></el-input>
                    <i class="cursor-p" @click="toUsersAddressList"></i>
                </el-form-item>
                <el-form-item :label="$t('message.transferAmount')+'：'" class="join-nos" prop="joinNo">
                    <span class="allUsable">{{$t('message.currentBalance')}}: {{usable}} NULS</span>
                    <el-input type="text" v-model.number="transferForm.joinNo" :maxlength="17"></el-input>
                    <span class="allNo" @click="allUsable(usable)">{{$t('message.all')}}</span>
                </el-form-item>
                <el-form-item :label="$t('message.miningFee')" class="service-no">
                </el-form-item>
                <el-form-item :label="$t('message.remarks')+'：'" class="remark">
                    <el-input type="textarea" v-model.trim="transferForm.remark" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item class="transfer-submit">
                    <el-button type="primary" @click="transferSubmit('transferForm')" id="transferSubmit">
                        {{$t('message.c114')}}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogTableVisible" class="transfer-dialog">
                <el-table :data="userAddressList" @row-dblclick="dbcheckedAddress">
                    <el-table-column property="userAddress" :label="$t('message.tabName')" width="280"
                                     align='center'></el-table-column>
                    <el-table-column property="userAlias" :label="$t('message.tabAlias')" width="70"
                                     align='center'></el-table-column>
                    <el-table-column property="userHelp" :label="$t('message.remarks')" width="110"
                                     align='center'></el-table-column>
                    <el-table-column :label="$t('message.operation')" width="100" align='center'>
                        <template slot-scope="scope">
                            <span class="cursor-p text-d" @click="checkedAddress(scope.row.userAddress)">{{$t('message.select')}}</span>
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
  import * as config from '@/config.js'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      let selectAddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('message.addressNull')))
        } else {
          if (this.transferForm.checkPass !== '') {
            this.$refs.transferForm.validateField('joinNo')
          }
          callback()
        }
      }
      let checkJoinAddress = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.transferNull')))
        }
        setTimeout(() => {
          //console.log(this.address !== undefined);
          if (this.address !== undefined) {
            if (value === this.address) {
              callback(new Error(this.$t('message.addressOrTransfer')))
            } else {
              callback()
            }
          } else {
            this.address = localStorage.getItem('newAccountAddress')
            if (value === this.address) {
              callback(new Error(this.$t('message.addressOrTransfer')))
            } else {
              callback()
            }
          }
        }, 500)
      }
      let checkJoinNo = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.transferNO')))
        }
        setTimeout(() => {
          //console.log(value);
          let re = /(^\+?|^\d?)\d*\.?\d+$/
          let res = /^\d{1,8}(\.\d{1,8})?$/
          if (!re.exec(value)) {
            callback(new Error(this.$t('message.transferNO1')))
          } else if (value > this.usable - 0.01) {
            callback(new Error(this.$t('message.transferNO2')))
          } else if (value < 0.01) {
            callback(new Error(this.$t('message.transferNO3')))
          } else if (!res.exec(value)) {
            callback(new Error(this.$t('message.c136')))
          } else {
            callback()
          }

        }, 100)

      }
      return {
        submitId: 'transferSubmit',
        usable: 0,
        accountAddress: [],
        remnant: 0,
        transferForm: {
          address: localStorage.getItem('newAccountAddress'),
          outName: '',
          joinAddress: '',
          joinNo: '',
          serviceNo: '',
          remark: ''
        },
        rules: {
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
    mounted () {
      let _this = this
      this.openDB()
      this.getBalanceAddress('/account/balance/' + this.transferForm.address)
    },
    methods: {
      /**
       *根据账户地址获取账户余额
       * Get the balance of the account according to the account address
       * @param url
       */
      getBalanceAddress (url) {
        this.$fetch(url)
          .then((response) => {
            console.log(response)
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              this.usable = parseFloat(leftShift.times(response.data.usable).toString())
            }
          })
      },

      /**
       * 获取下拉选择地址
       *Get the drop-down selection address

       * @param chenckAddress
       */
      chenckAccountAddress (chenckAddress) {
        this.address = chenckAddress
        localStorage.setItem('newAccountAddress', this.address)
        this.getBalanceAddress('/account/balance/' + chenckAddress)
        this.$refs.transferForm.validateField('joinAddress')
        this.$refs.transferForm.validateField('joinNo')
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
          });
        } else {
          this.transferForm.joinNo = config.FloatSub(balance, 0.01)
        }
      },

      /**
       * 创建usersDB
       * New usersDB
       */
      openDB () {
        let request = indexedDB.open('usersDB', 1)
        request.onupgradeneeded = function (e) {
          let db = e.target.result
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
      toUsersAddressList () {
        this.dialogTableVisible = true
        let request = indexedDB.open('usersDB', 1)
        let dbData = []
        request.onsuccess = function (event) {
          let db = event.target.result
          let tx = db.transaction('addressList', 'readonly')
          let store = tx.objectStore('addressList')
          // 打开游标，遍历customers中所有数据
          store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result
            if (cursor) {
              dbData.push(cursor.value)
              cursor.continue()
            }
          }
        }
        this.userAddressList = dbData
      },

      /**
       * 选中通讯录地址
       *Address the address of the address book
       * @param address
       */
      checkedAddress (address) {
        this.transferForm.joinAddress = address
        this.dialogTableVisible = false
      },

      /**
       * 双击选择通讯录地址
       *Double click the address book address
       * @param row
       * @param event
       */
      dbcheckedAddress (row, event) {
        this.transferForm.joinAddress = row.userAddress
        this.dialogTableVisible = false
      },

      /**
       * 确认转账
       * Confirmation of transfer
       * @param fromName
       */
      transferSubmit (fromName) {
        this.$refs[fromName].validate((valid) => {
          if (valid) {
            this.$refs.password.showPassword(true)
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
      toSubmit (password) {
        let rightShift = new BigNumber(100000000)
        let param = '{"address":"' + this.address
          + '","toAddress":"' + this.transferForm.joinAddress
          + '","amount":"' + rightShift.times(this.transferForm.joinNo)
          + '","password":"' + password
          + '","remark":"' + this.transferForm.remark + '"}'
        this.$post('/wallet/transfer/', param)
          .then((response) => {
            if (response.success) {
              this.$message({
                message: this.$t('message.passWordSuccess'),
                type: 'success'
              })
              this.transferForm.joinAddress = ''
              this.transferForm.joinNo = ''
              this.transferForm.remark = ''
              this.getBalanceAddress('/account/balance/' + this.transferForm.address)
              sessionStorage.setItem('walletActiveName', 'second')
              this.$router.push({
                name: '/wallet',
              })
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.msg,
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
        width: 100%;
        margin: auto;
        .transfer-info {
            width: 70%;
            margin: auto;
            .joinNo {
                .el-input__inner {
                    background-color: #17202e;
                    border: 1px solid #24426c;
                }
            }
            .out-name {
                font-size: 14px;
                color: #606266;
            }
            .out-name,
            .service-no {
                label {
                    float: left;
                    padding-right: 0.5rem;
                }
            }
            .out-address {
                .address-select {
                    width: 553px;
                    right: 0;
                    margin-left: 0;
                    .sub-select-item {
                        width: 553px;
                    }
                }
            }
            .join-address {
                i {
                    width: 25px;
                    height: 25px;
                    background-size: @bg-size;
                    background: @bg-image -54px -74px;
                    position: relative;
                    z-index: 8;
                    float: right;
                    margin-top: -27px;
                    margin-right: 0;
                }
            }
            .remark {
                .el-textarea__inner {
                    background-color: #17202e;
                    padding: 0 2px;
                    color: #FFFFFF;
                }
            }
            h2 {
                text-align: center;
                padding: 20px 0 20px;
            }
            .transfer-submit {
                text-align: center;
                button {
                    width: 30%;
                }
            }
            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                    height: 70px;
                    .el-form-item__label {
                        line-height: 0;
                        height: 20px;
                    }
                    .el-form-item__content {
                        line-height: 0;
                        .el-input {
                            input {
                                font-size: 12px;
                            }
                        }
                        .el-input__inner {
                            color: #FFFFFF;
                        }
                        .el-form-item__error {
                            padding-top: 0px;
                        }
                    }
                }
                .service-no {
                    height: 30px;
                    margin-top: -3px;
                }
                .transfer-submit {
                    .el-form-item__content {
                        margin-top: 20px;
                    }

                }
            }
            .transfer-dialog {
                .el-dialog__body {
                    .el-table {
                        max-height: 332px;
                        overflow-y: auto;
                        overflow-x: hidden;
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
                            background-image: -webkit-gradient(linear, 40% 0%, 75% 84%, from(#222d3f), to(#82bd39), color-stop(.6, #222d3f))
                        }
                        .el-table__body-wrapper {
                            overflow-x: hidden;
                        }
                    }
                }
            }
            .el-dialog__wrapper {
                .el-dialog {
                    width: 70%;
                }
            }
            .password-dialog {
                .el-dialog {
                    width: 50%;
                }
            }
        }
    }
</style>