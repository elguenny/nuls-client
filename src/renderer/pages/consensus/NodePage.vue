<template>
    <div class="node-page">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{this.nodeData.agentName}}</h2>
        <div class="div-icon1 node-page-top" v-loading="loading">
            <p class="subscript" :class="this.nodeData.status === 0  ? 'stay' : ''">
                {{ $t('message.status'+this.nodeData.status) }}
            </p>
            <ul>
                <li class="li-bg overflow">
                    <label>{{$t('message.c16')}}：</label>{{this.nodeData.agentAddresss}}
                    <span v-show="toCheckOk" @click="toCheck()" class="cursor-p text-d">{{$t('message.c5_1')}}</span>
                </li>
                <li>
                    <label>{{$t('message.c17')}}：</label>{{this.nodeData.commissionRate}}%
                </li>
                <li>
                    <label>{{$t('message.c25')}}：</label>{{this.nodeData.deposit}} NULS
                </li>
                <li>
                    <label>{{$t('message.c19')}}：</label>{{this.nodeData.memberCount}}
                </li>
                <li>
                    <label>{{$t('message.c18')}}：</label>
                    <ProgressBar :colorData="this.nodeData.creditVals < 0 ? '#f64b3e':'#82bd39'"
                                 :widthData="this.nodeData.creditVal"></ProgressBar>
                    <span>&nbsp;{{this.nodeData.creditVals}}</span>
                </li>
                <li>
                    <label>{{$t('message.c64')}}：</label>
                    <ProgressBar colorData="#58a5c9" :widthData="this.nodeData.totalDeposit"></ProgressBar>
                    <span>&nbsp;{{this.nodeData.totalDeposits}}</span>
                </li>
                <li class="li-info overflow">
                    <label>{{$t('message.c27')}}：</label>{{this.nodeData.introduction}}
                </li>
            </ul>
        </div>
        <div class="node-page-bottom">
            <el-form ref="nodeForm" :model="nodeForm" :rules="nodeRules" size="mini" label-position="left"
                     @submit.native.prevent>
                <el-form-item :label="$t('message.newAccountAddress')" class="account-address">
                    <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
                </el-form-item>
                <span class="allUsable">{{$t('message.currentBalance')}}: {{this.usable }} NULS</span>
                <el-form-item :label="$t('message.c25')" class="number" prop="nodeNo">
                    <el-input ref="input" v-model="nodeForm.nodeNo" :maxlength="17"></el-input>
                    <span class="allNo" @click="allUsable(usable)">{{$t('message.all')}}</span>
                </el-form-item>
                <div class="procedure"><label>{{$t('message.c28')}}</label><span>0.01 NULS</span></div>
                <el-form-item size="large" class="submit">
                    <el-button type="primary" @click="onSubmit('nodeForm')" id="nodePage" :disabled=this.btOk>
                        {{$t('message.confirmButtonText')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import ProgressBar from '@/components/ProgressBar.vue'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import * as config from '@/config.js'
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
          let values = new BigNumber(value)
          let nu = new BigNumber(this.usable)
          if (!re.exec(value) || !res.exec(value)) {
            callback(new Error(this.$t('message.c53')))
          } else if (value < 2000) {
            callback(new Error(this.$t('message.c54')))
          } else if (values.comparedTo(nu.minus(0.01)) === 1) {
            callback(new Error(this.$t('message.c542')))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        loading: true,
        btOk: this.$store.getters.getNetWorkInfo.localBestHeight !== this.$store.getters.getNetWorkInfo.netBestHeight,
        submitId: 'nodePage',
        address: this.$route.params.address,
        agentId: '',
        nodeData: [],
        usable: 0,
        nodeForm: {
          nodeNo: '',
        },
        nodeRules: {
          nodeNo: [
            {validator: checkNodeNo, trigger: 'blur'}
          ],
        },
        toCheckOk: false,
      }
    },
    components: {
      Back,
      ProgressBar,
      AccountAddressBar,
      Password,
    },
    created () {
      this.getConsensusAddress('/consensus/agent/' + this.address)
      this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'))
    },
    mounted () {
      this.$refs['input'].focus()
      this.$refs['input'].value = ''
      sessionStorage.setItem('passwordOk', '0')
    },
    methods: {
      //根据address获取共识节点列表信息
      getConsensusAddress (url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              //console.log(response);
              let leftShift = new BigNumber(0.00000001)
              this.toCheckOk = response.data.agentAddress === localStorage.getItem('newAccountAddress')
              response.data.deposit = parseFloat(leftShift.times(response.data.deposit).toString())
              response.data.creditVals = response.data.creditVal
              response.data.creditVal = (((((response.data.creditVal + 1) / 2)) * 100).toFixed()).toString() + '%'
              response.data.agentAddresss = (response.data.agentAddress).substr(0, 10) + '...' + (response.data.agentAddress).substr(-10)
              response.data.totalDeposits = (response.data.totalDeposit * 0.00000001).toFixed(0) + '/500000'
              if (response.data.totalDeposit > 50000000000000) {
                response.data.totalDeposit = '100%'
              } else {
                response.data.totalDeposit = (response.data.totalDeposit / 500000000000).toString() + '%'
              }
              //response.data.totalDeposit = ((response.data.totalDeposit*0.00000001) / 5000).toFixed(2) + '%';
              this.agentId = response.data.txHash
              this.nodeData = response.data
              this.loading = false
            }
          })
      },
      //获取下拉选择地址
      chenckAccountAddress (chenckAddress) {
        //console.log(chenckAddress);
        this.getBalanceAddress('/account/balance/' + chenckAddress)
        this.$refs.nodeForm.validateField('nodeNo')
      },
      //根据账户地址获取账户余额
      getBalanceAddress (url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              this.usable = parseFloat(leftShift.times(response.data.usable).toString())
            }
          })
      },
      //选择全部金额
      allUsable (balance) {
        if (balance === 0) {
          this.$message({
            message: this.$t('message.creditLow'),
            type: 'warning '
          })
        } else {
          //console.log(balance)
          this.nodeForm.nodeNo = config.FloatSub(balance, 0.01)
          this.$refs.nodeForm.validateField('nodeNo')
        }
      },
      //查看节点
      toCheck () {
        this.$router.push({
          name: '/nodeInfo',
          params:{"txHash":this.agentId}
        })
      },
      //提交委托
      onSubmit (formName) {
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
      toSubmit (password) {
        let rightShift = new BigNumber(100000000)
        let param = '{"address":"' + localStorage.getItem('newAccountAddress')
          + '","agentHash":"' + this.agentId
          + '","deposit":"' + parseFloat(rightShift.times(this.nodeForm.nodeNo).toString())
          + '","password":"' + password + '"}'
        console.log(param)
        this.$post('/consensus/deposit/', param)
          .then((response) => {
            console.log(response)
            if (response.success) {
              this.$message({
                message: this.$t('message.passWordSuccess'),
                type: 'success'
              })
              this.$router.push({
                name: '/consensus',
                params: {'activeName': 'first'}
              })
              /*this.$router.push({
                  name: '/myNode',
                  params:{"agentAddress":this.nodeData.agentAddress}
              })*/
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

    .node-page {
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
        .node-page-bottom {
            width: 80%;
            height: 190px;
            margin: 20px auto 0;
            border: 1px solid #658ec7;
            background-color: #17202e;
            .account-address {
                margin-bottom: 8px;
                .el-form-item__label {
                    margin-top: 20px;
                    margin-right: 0;
                    text-align: right;
                    width: 67px;
                }
                .address-select {
                    right: 90px;
                    top: 20px;
                    margin-left: 90px;
                    .sub-select-list {
                        max-height: 170px;
                        overflow-y: auto;
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
                }
            }
            .number {
                .el-form-item__label {
                    margin-top: 15px;
                    width: 68px;
                    text-align: right;
                }
            }
            .el-input__inner {
                width: 415px;
                color: #FFFFFF;
            }
            .el-form-item {
                width: 90%;
                margin: 0 auto 10px;
                .el-form-item__label {
                    color: #C1C5C9;
                }

            }
            .el-input {
                float: left;
                width: 415px;
            }
            .el-button--primary {
                margin-top: 15px;
                margin-right: 60px;
            }
            .el-form-item__error {
                margin-left: 70px;
            }
        }
        .el-form {
            .allUsable {
                margin-right: 128px;
                position: relative;
            }
            .allNo {
                display: block;
                position: fixed;
                top: 65.3%;
                right: 25.8%;
            }
        }

    }
</style>