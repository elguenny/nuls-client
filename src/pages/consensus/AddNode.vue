<template>
  <div class="add-node">
    <Back :backTitle="this.$t('message.consensusManagement')"></Back>
    <h2>{{this.agentAddressInfo.agentId}}</h2>
    <div class="div-icon1 node-page-top">
      <p class="subscript" :class="this.agentAddressInfo.status === 0  ? 'stay' : ''">
        {{ $t('message.status'+this.agentAddressInfo.status) }}
      </p>
      <ul>
        <li class="li-bg overflow">
          <label>{{$t('message.c16')}}：</label>{{this.agentAddressInfo.agentName ? this.agentAddressInfo.agentName : this.agentAddressInfo.agentAddresss}}
          <span v-show="toCheckOk" @click="toCheck" class="cursor-p text-d">{{$t('message.c5_1')}}</span>
        </li>
        <li>
          <label>{{$t('message.c17')}}：</label>{{this.agentAddressInfo.commissionRate}}%
        </li>
        <li>
          <label>{{$t('message.c25')}}：</label>{{this.agentAddressInfo.deposit}}
          NULS
        </li>
        <li>
          <label>{{$t('message.c19')}}：</label>{{this.agentAddressInfo.memberCount}}
        </li>
        <li>
          <label>{{$t('message.c18')}}：</label>
          <ProgressBar :colorData="this.agentAddressInfo.creditVals < 0 ? '#f64b3e':'#82bd39'"
                       :widthData="this.agentAddressInfo.creditVal"></ProgressBar>
          <span>&nbsp;{{this.agentAddressInfo.creditRatios}}</span>
        </li>
        <li>
          <label>{{$t('message.c47')}}：</label>
          <ProgressBar colorData="#58a5c9"
                       :widthData="this.agentAddressInfo.totalDeposit"></ProgressBar>
          <span>&nbsp;{{this.agentAddressInfo.totalDeposits}}</span>
        </li>
       <!-- <li class="li-info overflow">
          <label>{{$t('message.c27')}}：</label>{{this.agentAddressInfo.introduction}}
        </li>-->
      </ul>
    </div>
    <div class="add-node-bottom">
      <el-form ref="addNodeForm" :model="addNodeForm" :rules="addNodeRules" size="mini" label-position="left"
               @submit.native.prevent>
        <el-form-item :label="$t('message.c51')+':'" class="pledge-money" prop="nodeNo">
          <span class="allUsable">{{$t('message.currentBalance')}}: {{this.usable }} NULS</span>
          <el-input ref="input" v-model="addNodeForm.nodeNo":maxlength="17" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c28')+'：'+this.fee+' NULS'" class="procedure">
        </el-form-item>
        <el-form-item size="large" class="submit">
          <el-button type="primary" @click="onSubmit('addNodeForm')" id="addNode">
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
  import ProgressBar from './../../components/ProgressBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import {LeftShiftEight} from '@/api/util.js'
  import {BigNumber} from 'bignumber.js'

  export default {
    data() {
      let checkNodeNo = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c52')))
        }
        setTimeout(() => {

          let rightShift = new BigNumber(100000000);
          let leftShift = new BigNumber(0.00000001);
          if (rightShift.times(this.addNodeForm.nodeNo).toString() === rightShift.times(this.usable).toString()) {
            this.addNodeForm.nodeNo = leftShift.times(rightShift.times(this.usable) - rightShift.times(this.fee)).toString();
            value = this.addNodeForm.nodeNo;
          }

          let re = /^\d+(?=\.{0,1}\d+$|$)/;
          let res = /^\d{1,8}(\.\d{1,8})?$/;
          if (!re.exec(value) || !res.exec(value)) {
            callback(new Error(this.$t('message.c53')))
          } else {
            let values = new BigNumber(value);
            let nu = new BigNumber(this.usable);
            if (value < 2000) {
              callback(new Error(this.$t('message.c54')))
            } else if (values.comparedTo(nu.minus(this.fee)) === 1) {
              callback(new Error(this.$t('message.c542')))
            } else {
              callback()
            }
          }
        }, 300)
      };
      return {
        submitId: 'addNode',
        agentAddress: this.$route.query.agentAddress,
        agentId: this.$route.query.agentId,
        agentAddressInfo: [],
        addNodeForm: {
          nodeNo: ''
        },
        addNodeRules: {
          nodeNo: [
            {validator: checkNodeNo, trigger: 'blur'}
          ],
        },
        usable: 0,
        fee: 0,
        toCheckOk: false,
      }
    },
    components: {
      Back,
      ProgressBar,
      Password,
    },
    created() {
      this.getAgentAddressInfo('/consensus/agent/' + this.agentId);
      this.getBalanceAddress('/accountledger/balance/' + localStorage.getItem('newAccountAddress'))
    },
    mounted() {
      this.$refs['input'].focus()
    },
    methods: {
      //根据agentAddress获取共识节点信息
      getAgentAddressInfo(url) {
        //console.log(url)
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.toCheckOk = response.data.agentAddress === localStorage.getItem("newAccountAddress");
              response.data.deposit = parseFloat(leftShift.times(response.data.deposit).toString());
              response.data.creditVals = response.data.creditVal;
              response.data.creditVal = (((((response.data.creditVal + 1) / 2)) * 100).toFixed()).toString() + '%';
              response.data.agentAddresss = (response.data.agentAddress).substr(0, 9) + '...' + (response.data.agentAddress).substr(-9);
              response.data.totalDeposits = (response.data.totalDeposit * 0.00000001).toFixed(0) + '/500000';
              if (response.data.totalDeposit > 50000000000000) {
                response.data.totalDeposit = '100%'
              } else {
                response.data.totalDeposit = (response.data.totalDeposit / 500000000000).toString() + '%'
              }
              this.agentAddressInfo = response.data;
              this.agentId = response.data.txHash
            }
          })
      },
      //根据账户地址获取账户余额
      getBalanceAddress(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              this.usable=parseFloat(LeftShiftEight(response.data.usable.value).toString());
            }
          })
      },
      //查看节点
      toCheck() {
        this.$router.push({
          name: '/nodeInfo',
          params: {txHash: this.agentAddressInfo.agentHash},
        })
      },
      /**
       *计算手续费
       *Calculation fee
       **/
      countFee() {
        if (this.addNodeForm.nodeNo > 0) {
          let rightShift = new BigNumber(100000000);
          let params = "address=" + localStorage.getItem('newAccountAddress')
            + "&agentHash=" + this.agentId
            + "&deposit=" + rightShift.times(this.addNodeForm.nodeNo);
          //console.log("params=" + params);
          this.$fetch('/consensus/deposit/fee?'+ params)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                let leftShift = new BigNumber(0.00000001);
                this.fee = leftShift.times(response.data.value);
              }
            });
        }
      },
      //提交追加
      onSubmit(formName) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
          && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (localStorage.getItem('encrypted') === 'true') {
                this.$refs.password.showPassword(true)
              } else {
                this.$confirm(this.$t('message.c165'), '', {
                  confirmButtonText: this.$t('message.confirmButtonText'),
                  cancelButtonText: this.$t('message.cancelButtonText')
                }).then(() => {
                  this.toSubmit('')
                }).catch(() => {
                })
              }
            } else {
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
        let param = '{"address":"' + localStorage.getItem('newAccountAddress')
          + '","agentHash":"' + this.agentId
          + '","deposit":"' + parseFloat(rightShift.times(this.addNodeForm.nodeNo).toString())
          + '","password":"' + password + '"}';
        //console.log(param);
        this.$post('/consensus/deposit/', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                message: this.$t('message.passWordSuccess'),
                type: 'success'
              });
              this.$router.push({
                name: '/myNode',
                query: {'agentAddress': this.agentAddress, 'agentHash': this.agentId}
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

  .add-node {
    width: 1024px;
    margin: auto;
    h2 {
      font-size: 16px;
      text-align: center;
      line-height: 20px;
      margin-bottom: 28px;
      font-weight: bold;
    }
    .div-icon {
      height: 118px;
      width: 80%;
      margin: auto;
      border: 1px solid #658ec7;
    }
    ul {
      width: 100%;
      height: 105px;
      margin: auto;
      font-size: 14px;
      background-color: #17202e;
      padding-top: 15px;
      li {
        color: #c1c5c9;
        line-height: 22px;
        width: 45%;
        float: left;
        label {
          display: block;
          width: 145px;
          float: left;
          text-align: right;
        }
        span {
        }
      }
      .li-info {
        width: 100%;
        text-align: left;
      }
    }
    .add-node-bottom {
      width: 90%;
      height: 185px;
      margin: 20px auto 0;
      border: 1px solid #658ec7;
      background-color: #17202e;
      .el-input__inner {
        width: 415px;
        color: #FFFFFF;
      }
      .el-form-item {
        width: 90%;
        margin: auto;
        .el-form-item__content {
          margin-bottom: 15px;
          .allUsable {
            margin-right: 345px;
            position: relative;
            margin-top: -28px;
          }
        }
        .el-form-item__label {
          color: #C1C5C9;
          font-size: 12px;
          min-width: 70px;
          text-align: right;
          padding: 0 10px 0 0;
        }
        .el-form-item__error {
          margin-left: 70px;
        }
      }
      .procedure{
        .el-form-item__label{
          text-align: left;
          margin-left: 23px;
        }
      }
      .pledge-money {
        margin-top: 40px;
      }
      .el-input {
        float: left;
        width: 415px;
      }
      .el-button--primary {
        margin-top: 0;
      }

    }
  }
</style>
