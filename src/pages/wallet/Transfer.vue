<template>
  <div class="transfer">
    <Back :backTitle="this.$t('message.walletManagement')"></Back>
    <div class="transfer-info">
      <h2>{{this.$route.query.asset}} {{$t('message.transfer')}}</h2>

      <el-form :model="transferForm" :rules="transferRules" ref="transferForm">
        <el-form-item :label="$t('message.sourceAddress')+'：'" class="out-address">
          <AccountAddressBar @chenckAccountAddress="chenckAccountAddress" v-show="outAddressIf"></AccountAddressBar>
          <div class="contract-address" v-show="seniorIf && !outAddressIf">{{this.selectAddress}}</div>
          <i class="copy_icon copyBtn cursor-p" @click="accountCopy"></i>
        </el-form-item>
        <el-form-item :label="$t('message.destinationAddress')+'：'" prop="joinAddress">
          <el-input type="text" v-model.trim="transferForm.joinAddress" ref="joinAddress"
                    @change="ifContractAddres"></el-input>
          <i class="cursor-p icons" @click="toUsersAddressList"></i>
        </el-form-item>
        <el-form-item :label="$t('message.transferAmount')+'：'" prop="joinNo">
          <span class="allUsable">{{$t('message.currentBalance')}}: {{usable}} {{this.$route.query.asset}}</span>
          <el-input type="text" v-model="transferForm.joinNo" :maxlength="17" @change="countFee"></el-input>
        </el-form-item>

        <div class="contract-t" v-show="seniorIf">
          <div class="call-senior">
            {{$t('message.c203')}}
            <el-switch v-model="callSeniorValue" :width="35"></el-switch>
          </div>
          <div class="seniorInfo" v-show="this.callSeniorValue">
            <el-form-item label="Gas Limit" prop="gas">
              <el-input v-model="transferForm.gas" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              <p class="price-min" v-show="this.transferForm.gas < this.systemGas && this.transferForm.gas > 1">
                {{$t('message.c206')}}</p>
            </el-form-item>
            <el-form-item label="Price" prop="price">
              <el-input v-model="transferForm.price" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
          </div>
        </div>

        <el-form-item :label="$t('message.remarks')+'：'">
          <el-input type="textarea" v-model.trim="transferForm.remark"
                    :maxlength="30" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c28')+': '+this.fee+' NULS'" v-show="outAddressIf">
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
  import {BigNumber} from 'bignumber.js'
  import {htmlEncodeByRegExp, LeftShiftEight, RightShiftEight, Power, Division,copys} from '@/api/util'
  import {numbers} from '@/api/validate'


  export default {
    data() {
      let selectAddress = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.addressNull')))
        } else {
          callback()
        }
      };
      let checkJoinAddress = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.transferNull')))
        } else if (value.length < 20 || value.length > 35) {
          callback(new Error(this.$t('message.c168')))
        } else if (value === this.selectAddress) {
          callback(new Error(this.$t('message.addressOrTransfer')))
        } else {
          callback()
        }
      };
      let checkJoinNo = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.transferNO')))
          //转出金额等于可以余额时减去手续费
        }else if(!numbers(value)){
          callback(new Error(this.$t('message.c136')))
        }else if (value < this.fee) {
          callback(new Error(this.$t('message.transferNO3')))
        }else {
          setTimeout( () =>{
            if(RightShiftEight(this.transferForm.joinNo).toString() === RightShiftEight(this.usable).toString()) {
              this.transferForm.joinNo = LeftShiftEight(parseInt(RightShiftEight(this.usable).toString()) - parseInt(RightShiftEight(this.fee).toString()));
            }else if (parseInt(RightShiftEight(value).toString()) > this.maxAmount && !this.seniorIf) {
              callback(new Error(this.$t('message.c202') + LeftShiftEight(this.maxAmount).toString()))
            }else {
              callback()
            }
          },100);
        }
      };
      let validateGas = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c204')));
        } else if (value < 1 || value > 10000000) {
          callback(new Error(this.$t('message.c204')));
        } else {
          callback();
        }
      };
      let validatePrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c205')));
        } else if (value < 1) {
          callback(new Error(this.$t('message.c205')));
        } else {
          callback();
        }
      };

      return {
        //默认选中的账户转出地址
        selectAddress: localStorage.getItem('newAccountAddress'),
        submitId: 'transferSubmit',
        //余额
        usable: this.$route.query.balance,
        //手续费
        fee: 0.00,
        //最大转账金额
        maxAmount: 0,
        //form 表单数据
        transferForm: {
          address: this.selectAddress,
          joinAddress: '',
          joinNo: '',
          gas: '',
          price: '',
          remark: ''
        },

        //form 表单验证信息
        transferRules: {
          selectAddress: [
            {validator: selectAddress, trigger: 'blur'}
          ],
          joinAddress: [
            {validator: checkJoinAddress, trigger: 'blur'}
          ],
          joinNo: [
            {validator: checkJoinNo, trigger: 'blur'}
          ],
          gas: [
            {validator: validateGas, trigger: 'blur'}
          ],
          price: [
            {validator: validatePrice, trigger: 'blur'}
          ]
        },

        //转出地址是否可选择
        outAddressIf: true,
        //代币转账显示内容
        seniorIf: false,
        //代币精度系数
        decimalsNo: 0,
        //获取系统计算的gas
        systemGas: 0,
        //高级选项开关
        callSeniorValue: false,

        userAddressList: [],
        dialogTableVisible: false,
      }
    },
    components: {
      Back,
      AccountAddressBar,
      Password,
    },
    created() {
      //获取10的N次方
      this.decimalsNo = Power(this.$route.query.decimals);
      if (this.$route.query.address) {
        this.seniorIf = true;
        this.outAddressIf = false;
      }
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
              this.usable = LeftShiftEight(response.data.usable.value).toString()
            }
          })
      },

      /**
       * 获取下拉选择地址
       *Get the drop-down selection address
       * @param chenckAddress
       */
      chenckAccountAddress(chenckAddress) {
        this.selectAddress = chenckAddress;
        localStorage.setItem('newAccountAddress', this.selectAddress);
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
        copys(this.selectAddress);
        this.$message({
          message: this.$t('message.c129'), type: 'success', duration: '800'
        })
      },

      /**
       * 选择通讯录
       * Select the address book
       */
      toUsersAddressList() {
        let _this = this;
        this.dialogTableVisible = true;
        if ("indexedDB" in window) {
          const dbInfo = {
            dbName: "usersDB",
            dbVersion: 1,
            dbInstance: {}
          };
          let openRequest = window.indexedDB.open(dbInfo.dbName, dbInfo.dbVersion);
          openRequest.onupgradeneeded = function (e) {
            let db = e.target.result;
            let storeNames = db.objectStoreNames;
            if (!storeNames.contains('addressList')) {
              db.createObjectStore('addressList', {
                keyPath: "userAddress",
                autoIncrement: false
              })
            }
          };
          openRequest.onsuccess = function (e) {
            let dbData = [];
            let db = event.target.result;
            let tx = db.transaction(["addressList"], 'readonly');
            let store = tx.objectStore('addressList');
            // 打开游标，遍历customers中所有数据
            store.openCursor().onsuccess = function (event) {
              let cursor = event.target.result;
              if (cursor) {
                dbData.push(cursor.value);
                cursor.continue()
              }

              setTimeout(() => {
                _this.userAddressList = dbData
              }, 50)

            }
          };
          openRequest.onerror = function (e) {
            console.log("数据库打开失败...");
            console.dir(e);
          }
        } else {
          console.log("对不起，您的浏览器不支持indexedDB，建议您使用google浏览器");
        }
      },

      /**
       * 选中通讯录地址
       *Address the address of the address book
       * @param address
       */
      checkedAddress(address) {
        this.transferForm.joinAddress = address;
        this.$refs.transferForm.validateField('joinAddress');
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
       * 验证是否为合约地址
       *
       **/
      ifContractAddres() {
        this.$fetch('/contract/' + this.transferForm.joinAddress)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              //是合约地址
              if (response.data) {
                this.transferForm.gas = '';
                this.transferForm.price = '';
                this.seniorIf = true;
              } else {
                this.transferForm.gas = '1';
                this.transferForm.price = '1';
              }
            }
          });
      },

      /**
       *计算手续费
       *Calculation fee
       **/
      countFee() {
        let _this = this;
        //代币转账 不做余额计算
        if (this.seniorIf) {
          if (this.transferForm.joinAddress !== '' && this.transferForm.joinNo > 0) {
            //金额精度系数计算
            let decimalsValue = new BigNumber(this.transferForm.joinNo);
            let param = '';

            if (this.seniorIf && this.outAddressIf) {
              param = '{"sender":"' + this.selectAddress
                + '","contractAddress":"' + this.transferForm.joinAddress
                + '","value":"' + decimalsValue.times(this.decimalsNo).toString()
                + '","methodName":"_payable","methodDesc":"() return void","price":1'
                + '}';

              //计算手续费
              setTimeout( ()=>{
                let params = '{"address":"' + this.selectAddress
                  + '","toAddress":"' + this.transferForm.joinAddress
                  + '","gasLimit":"' + this.transferForm.gas
                  + '","price":"' + this.transferForm.price
                  + '","amount":"' + RightShiftEight(this.transferForm.joinNo).toString()
                  + '","remark":"' + htmlEncodeByRegExp(this.transferForm.remark)
                  + '"}';
                //console.log(params);
                this.$post('/contract/transfer/fee',params)
                  .then((response) => {
                    //console.log(response);
                    if (response.success) {
                      this.fee = LeftShiftEight(response.data.fee).toString();
                      this.maxAmount = response.data.maxAmount
                    }
                  });
              },500);
            } else {
              param = '{"sender":"' + this.selectAddress
                + '","contractAddress":"' + this.$route.query.address
                + '","value":0,"methodName":"transfer","methodDesc":"","price":1'
                + ',"args":["' + this.transferForm.joinAddress + '","' + decimalsValue.times(this.decimalsNo).toString()
                + '"]}';
            }
            let params = '{"sender":"' + localStorage.getItem('newAccountAddress') + '"}';
            //console.log(param);
            this.$post('/contract/imputedgas/call', param)
              .then((response) => {
                //console.log(response);
                //估算gas成功后估算price
                if (response.success) {
                  this.systemGas = response.data.gasLimit;
                  this.transferForm.gas = response.data.gasLimit;
                  //console.log(params);
                  _this.$post('/contract/imputedprice', params)
                    .then((response) => {
                      //console.log(response);
                      if (response.success) {
                        this.transferForm.price = response.data;
                      } else {
                        console.log("估算price失败")
                      }
                    })
                } else {
                  console.log("估算gas失败")
                }
              })
          }
        }else {
          if (this.transferForm.joinAddress !== '' && this.transferForm.joinNo > 0) {
            let params = "address=" + this.selectAddress
              + "&toAddress=" + this.transferForm.joinAddress
              + "&amount=" + RightShiftEight(this.transferForm.joinNo).toString()
              + "&remark=" + htmlEncodeByRegExp(this.transferForm.remark);
            //console.log(params);
            this.$fetch('/accountledger/transfer/fee?' + params)
              .then((response) => {
                //console.log(response);
                if (response.success) {
                  this.fee = LeftShiftEight(response.data.fee).toString();
                  this.maxAmount = response.data.maxAmount
                }
              });
          }
        }
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
                console.log("")
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
        let url = '';
        let params = '';
        //判断是否代币转账
        if (this.seniorIf) {
          let decimalsValue = new BigNumber(this.transferForm.joinNo);
          if(this.$route.query.address){
            url = '/contract/call';
            params = '{"sender":"' + this.selectAddress
              + '","gasLimit":' + this.transferForm.gas
              + ',"price":' + this.transferForm.price
              + ',"password":"' + password
              + '","remark":"' + htmlEncodeByRegExp(this.transferForm.remark)
              + '","contractAddress":"' + this.$route.query.address
              + '","value":0,"methodName":"transfer","methodDesc":"","args":["'
              + this.transferForm.joinAddress + '","' + decimalsValue.times(this.decimalsNo)
              + '"]}';
          }else {
            url = '/contract/transfer';
            params = '{"address":"' + this.selectAddress
              + '","toAddress":"' + this.transferForm.joinAddress
              + '","gasLimit":' + this.transferForm.gas
              + ',"price":' + this.transferForm.price
              + ',"password":"' + password
              + '","remark":"' + htmlEncodeByRegExp(this.transferForm.remark)
              + '"}';
          }
        } else {
          url = '/accountledger/transfer';
          params = '{"address":"' + this.selectAddress
            + '","toAddress":"' + this.transferForm.joinAddress
            + '","amount":' + rightShift.times(this.transferForm.joinNo)
            + ',"password":"' + password
            + '","remark":"' + htmlEncodeByRegExp(this.transferForm.remark) + '"}';
        }
        //console.log(url);
        //console.log(params);
        this.$post(url, params)
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
              this.getBalanceAddress('/accountledger/balance/' + this.transferForm.address);
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
            .contract-address {
              border: 1px solid #24426c;
              line-height: 26px;
              padding: 0 0 0 5px;
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
            .price-min {
              color: #ffd966;
              line-height: 15px;
              text-align: left;
            }
          }
        }
        .out-address {
          .el-form-item__label {
            line-height: 30px;
            float: none;
          }
        }
        .contract-t {
          .call-senior {
            height: 45px;
            text-align: left;
            font-size: 14px;
            .el-switch {
              .el-switch__core {
                background: #222D3E;
                height: 16px;
                &:after {
                  width: 12px;
                  height: 12px;
                }
              }
            }
          }
        }
        .transfer-submit {
          text-align: center;
        }
      }
    }
  }
</style>
