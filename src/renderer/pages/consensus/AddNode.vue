<template>
    <div class="add-node">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{this.agentAddressInfo.agentName}}</h2>
        <div class="div-icon1 node-page-top">
            <p class="subscript">
                {{ $t('message.status'+this.agentAddressInfo.status) }}
            </p>
            <ul>
                <li class="li-bg overflow">
                    <label>{{$t('message.c16')}}：</label>{{this.agentAddressInfo.agentAddresss}}
                </li>
                <li>
                    <label>{{$t('message.c17')}}：</label>{{this.agentAddressInfo.commissionRate}}%
                </li>
                <li>
                    <label>{{$t('message.c25')}}：</label>{{this.agentAddressInfo.owndeposit}}
                    NULS
                </li>
                <li>
                    <label>{{$t('message.c19')}}：</label>{{this.agentAddressInfo.memberCount}}
                </li>
                <li>
                    <label>{{$t('message.c18')}}：</label>
                    <ProgressBar :colorData="this.agentAddressInfo.creditRatios < 0 ? '#f64b3e':'#82bd39'"
                                 :widthData="this.agentAddressInfo.creditRatio"></ProgressBar>
                    <span>&nbsp;{{this.agentAddressInfo.creditRatios}}</span>
                </li>
                <li>
                    <label>{{$t('message.c47')}}：</label>
                    <ProgressBar colorData="#58a5c9"
                                 :widthData="this.agentAddressInfo.totalDeposit"></ProgressBar>
                    <span>&nbsp;{{this.agentAddressInfo.totalDeposits}}</span>
                </li>
                <li class="li-info overflow">
                    <label>{{$t('message.c27')}}：</label>{{this.agentAddressInfo.introduction}}
                </li>
            </ul>
        </div>
        <div class="add-node-bottom">
            <el-form ref="addNodeForm" :model="addNodeForm" :rules="addNodeRules" size="mini" label-position="left" @submit.native.prevent>
                <el-form-item :label="$t('message.c51')+':'" class="pledge-money" prop="nodeNo">
                    <el-input ref="input" v-model="addNodeForm.nodeNo" :placeholder=this.placeholder
                              :maxlength="17"></el-input>
                </el-form-item>
                <div class="procedure"><label>{{$t('message.c28')}}:</label><span>0.01 NULS</span></div>
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
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      let checkNodeNo = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('message.c52')))
        }
        setTimeout(() => {
          let re = /^\d+(?=\.{0,1}\d+$|$)/
          let res = /^\d{1,8}(\.\d{1,8})?$/
          if (!re.exec(value) || !res.exec(value)) {
            callback(new Error(this.$t('message.c53')))
          } else if (value < 2000) {
            callback(new Error(this.$t('message.c54')))
          }else if (value > this.usable - 0.01) {
            callback(new Error(this.$t('message.c542')))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        submitId: 'addNode',
        agentAddress: this.$route.params.agentAddress,
        agentId: this.$route.params.agentId,
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
        placeholder: '',

      }
    },
    components: {
      Back,
      ProgressBar,
      Password,
    },
    created () {
      this.getAgentAddressInfo('/consensus/agent/' + this.agentAddress)
      this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'))
    },
    mounted () {
      this.$refs['input'].focus()
    },
    methods: {
      //根据agentAddress获取共识节点信息
      getAgentAddressInfo (url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              response.data.owndeposit = parseFloat(leftShift.times(response.data.owndeposit).toString())
              response.data.creditRatios = response.data.creditRatio
              if (response.data.creditRatio !== 0) {
                if (response.data.creditRatio > 0) {
                  response.data.creditRatio = ((((response.data.creditRatio + 1) / 2)) * 100).toFixed(2) + '%'
                } else {
                  response.data.creditRatio = Math.abs(response.data.creditRatio) * 100 + '%'
                }
              } else {
                response.data.creditRatio = '50%'
              }
              response.data.agentAddresss = (response.data.agentAddress).substr(0, 10) + '...' + (response.data.agentAddress).substr(-10)
              response.data.totalDeposits = (response.data.totalDeposit * 0.00000001).toFixed(0) + '/500000'
              if (response.data.totalDeposit > 50000000000000) {
                response.data.totalDeposit = '100%'
              } else {
                response.data.totalDeposit = (response.data.totalDeposit / 500000000000).toString() + '%'
              }
              this.agentAddressInfo = response.data
            }
          })
      },
      //根据账户地址获取账户余额
      getBalanceAddress (url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.placeholder = '（' + this.$t('message.currentBalance') + parseFloat(leftShift.times(response.data.usable).toString()) + 'NULS）'
              this.usable = parseFloat(leftShift.times(response.data.usable).toString())
            }
          })
      },
      //提交追加
      onSubmit (formName) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
          && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$refs.password.showPassword(true)
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
      toSubmit (password) {
        let rightShift = new BigNumber(100000000);
        let param = '{"address":"' + localStorage.getItem('newAccountAddress')
          + '","agentId":"' + this.agentId
          + '","deposit":"' + parseFloat(rightShift.times(this.addNodeForm.nodeNo).toString())
          + '","password":"' + password + '"}'
        //console.log(param);
        this.$post('/consensus/deposit/', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                message: this.$t('message.passWordSuccess'),
                type: 'success'
              })
              this.$router.push({
                name: '/myNode',
                params: {'agentAddress': this.agentAddress},
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

    .add-node {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
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
            font-size: 12px;
            background-color: #17202e;
            padding-top: 15px;
            li {
                color: #c1c5c9;
                line-height: 22px;
                width: 45%;
                float: left;
                label {
                    display: block;
                    width: 75px;
                    float: left;
                    padding-left: 25px;
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
            width: 80%;
            height: 145px;
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
            .pledge-money {
                margin-top: 20px;
            }
            .el-input {
                float: left;
                width: 415px;
            }
            .el-button--primary {
                margin-top: 15px;
            }

        }
    }
</style>