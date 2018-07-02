<template>
  <div class="new-node">
    <Back :backTitle="this.$t('message.consensusManagement')"></Back>
    <h2>{{$t('message.c21')}}</h2>
    <div class="new-node-form">
      <el-form ref="newNodeForm" :model="newNodeForm" :rules="newNodeRules" size="mini" label-position="top">
        <el-form-item :label="$t('message.c22')+':'" class="a-new">
          <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
          <i class="copy_icon copyBtn cursor-p" :data-clipboard-text="copyValue"
             @click="accountCopy" :title="$t('message.c143')"></i>
        </el-form-item>
        <el-form-item :label="$t('message.c23')+':'" prop="packingAddress">
          <el-input v-model.trim="newNodeForm.packingAddress" :maxlength="35" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c25')+'（NULS）:'" prop="deposit">
          <span class="allUsable">{{$t('message.currentBalance')}}: {{usable}} NULS</span>
          <el-input v-model="newNodeForm.deposit":maxlength="17" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c26')+'（%）:'" prop="commissionRate">
          <el-input v-model="newNodeForm.commissionRate" :maxlength="5" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c28')+': '+this.fee+' NULS'">
        </el-form-item>
        <el-form-item size="large" class="submit">
          <el-button type="primary" @click="submitForm('newNodeForm')" id="newNode">
            {{$t('message.confirmButtonText')}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
  </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import * as config from '@/config.js'
  import {BigNumber} from 'bignumber.js'
  import copy from 'copy-to-clipboard'

  export default {
    data() {
      let checkpackingAddress = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c38')))
        } else {
          let re = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
          if (!re.exec(value)) {
            callback(new Error(this.$t('message.c168')))
          } else if (value === localStorage.getItem('newAccountAddress')) {
            callback(new Error(this.$t('message.c169')))
          } else {
            callback()
          }
        }
      };
      let checkNodeNo = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c31')))
        }
        setTimeout(() => {
          let re = /(^\+?|^\d?)\d*\.?\d+$/;
          let res = /^\d{1,8}(\.\d{1,8})?$/;
          if (!re.exec(value) || !res.exec(value)) {
            callback(new Error(this.$t('message.c136')))
          } else {
            let rightShift = new BigNumber(100000000);
            if (parseInt(rightShift.times(value).toString()) > parseInt(rightShift.times(this.usable).toString())) {
              callback(new Error(this.$t('message.c543')))
            } else if (parseInt(rightShift.times(value).toString()) < 20000*100000000 || parseInt(rightShift.times(value).toString()) > 200000*100000000) {
              callback(new Error(this.$t('message.c541')))
            } else {
              callback()
            }
          }
        }, 100)
      };
      let checkCommissionRate = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c37')))
        }
        let re = /^\d+(?=\.{0,1}\d+$|$)/;
        let res = /^\d{1,3}(\.\d{1,2})?$/;
        if (!re.exec(value) || !res.exec(value)) {
          callback(new Error(this.$t('message.c36')))
        } else if (10 > value || value > 100) {
          callback(new Error(this.$t('message.c37')))
        } else {
          callback()
        }
      };
      return {
        submitId: 'newNode',
        accountAddress: [],
        copyValue: localStorage.getItem('newAccountAddress'),
        usable: '0',
        fee: 0.00,
        placeholder: '',
        newNodeForm: {
          accountAddressValue: localStorage.getItem('newAccountAddress'),
          packingAddress: '',
          deposit: '',
          commissionRate: '',
        },
        newNodeRules: {
          packingAddress: [
            {validator: checkpackingAddress, trigger: 'blur'},
          ],
          deposit: [
            {validator: checkNodeNo, trigger: 'blur'},
          ],
          commissionRate: [
            {validator: checkCommissionRate, trigger: 'blur'}
          ]
        },
      }
    },
    components: {
      Back,
      AccountAddressBar,
      Password,
    },
    mounted() {
      let _this = this;
      this.getBalanceAddress('/accountledger/balance/' + localStorage.getItem('newAccountAddress'))
    },
    methods: {
      //获取下拉选择地址
      chenckAccountAddress(chenckAddress) {
        this.newNodeForm.accountAddressValue = chenckAddress;
        this.copyValue = chenckAddress;
        this.getBalanceAddress('/accountledger/balance/' + chenckAddress);
        this.countFee();
        setTimeout(() => {
          if (this.newNodeForm.deposit !== '') {
            this.$refs.newNodeForm.validateField('deposit')
          }
        }, 500)
      },

      /**
       * 复制功能
       * copy
       */
      accountCopy() {

        if(this.copyValue !== ''){
          copy(this.copyValue);
          this.$message({
            message: this.$t('message.c129'), type: 'success', duration: '800'
          })
        }else {
          this.$message({
            message: this.$t('message.c199'), duration: '800'
          })
        }
      },
      //根据账户地址获取账户余额
      getBalanceAddress(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.usable = (response.data.usable.value * 0.00000001).toFixed(8);
              this.placeholder = this.$t('message.currentBalance') + ' ' + (response.data.usable.value * 0.00000001).toFixed(8)
            }
          })
      },

      /**
       *计算手续费
       *Calculation fee
       **/
      countFee() {
        if (this.newNodeForm.packingAddress !== '' && this.newNodeForm.commissionRate !== '' && this.newNodeForm.deposit > 0) {
          let rightShift = new BigNumber(100000000);
          let params = "agentAddress=" + this.newNodeForm.accountAddressValue
            + "&packingAddress=" + this.newNodeForm.packingAddress
            + "&rewardAddress=" + this.newNodeForm.accountAddressValue
            + "&commissionRate=" + this.newNodeForm.commissionRate
            + "&deposit=" + rightShift.times(this.newNodeForm.deposit);
          //console.log("params=" + params);
          this.$fetch('/consensus/agent/fee?'+ params)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                let leftShift = new BigNumber(0.00000001);
                this.fee = leftShift.times(response.data.value);
              }
            });
        }

      },
      //提交创建
      submitForm(formName) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
          && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (localStorage.getItem('encrypted') === 'true') {
                this.$refs.password.showPassword(true)
              } else {
                this.$confirm(this.$t('message.c166'), '', {
                  confirmButtonText: this.$t('message.confirmButtonText'),
                  cancelButtonText: this.$t('message.cancelButtonText'),
                }).then(() => {
                  this.toSubmit('')
                }).catch(() => {
                })
              }
            }
            else {
              return false
            }
          })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      },
      //
      toSubmit(password) {
        let rightShift = new BigNumber(100000000);
        let param = '{"agentAddress":"' + this.newNodeForm.accountAddressValue
          + '","packingAddress":"' + this.newNodeForm.packingAddress
          + '","commissionRate":"' + this.newNodeForm.commissionRate
          + '","deposit":"' + parseFloat(rightShift.times(this.newNodeForm.deposit).toString())
          + '","password":"' + password + '"}';
        //console.log(param);
        this.$post('/consensus/agent ', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              });
              this.$router.push({
                name: '/consensus',
                params: {'activeName': 'first'},
              })
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.data.msg,
              })
            }
          })
      },
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .new-node {
    width: 1024px;
    margin: auto;
    h2 {
      font-size: 16px;
      text-align: center;
      line-height: 20px;
      margin-bottom: 5px;
    }
    .new-node-form {
      width: 60%;
      margin: auto;
      .address-select {
        width: 535px;
        right: 0;
        margin-left: 0;
        .sub-select-list {
          .sub-select-item {
            width: 535px;
          }
        }

      }
      .copy_icon {
        position: absolute;
        top: 3px;
        right: 40px;
        width: 30px;
        height: 20px;
        display: block;
        float: left;
        background-size: @bg-size;
        background: @bg-image -198px -46px;
      }
      .form-left {
        width: 50%;
        float: left;
        .el-input__inner {
          width: 159px;
        }
      }
      .el-input__inner {
        width: 535px;
        color: #FFFFFF;
      }
      .el-input--suffix {
        .el-input__inner {
          width: 403px;
        }
      }
      .el-textarea__inner {
        width: 403px;
        color: #FFFFFF;
        padding: 5px 2px;
      }
      .el-input--suffix {
        width: 100%;
      }
      .el-input__suffix {
        margin-top: 0;
      }
      .el-select .el-input .el-select__caret {
        font-size: 14px;
      }
      .el-form-item--mini .el-form-item__content,
      .el-form-item--mini .el-form-item__label {
        line-height: 0;
        color: #FFFFFF;
      }
      .el-form-item.is-required .el-form-item__label:before {
        font-size: 0;
      }
      .el-form-item--mini {
        margin-bottom: 24px;
      }
      .a-new {
        label {
          margin-left: 4px;
        }
      }
      input::-webkit-input-placeholder {
        color: #8a929b;
        font-size: 12px;
        text-align: right;
      }
    }
    .allUsable {
      margin-top: -15px;
      margin-right: 80px;
    }
  }
</style>
