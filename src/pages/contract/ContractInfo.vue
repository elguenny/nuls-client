<template>
  <div class="contract-info">
    <Back :backTitle="this.$t('message.contract')"></Back>
    <div class="contract-info-top">
      <div class="address">
        <h3>合约地址：{{this.contractAddress}}</h3>
        <p v-show="!this.collectOk && this.contractInfo.status !=='stop'" @click="collect" class="cursor-p">
          {{this.contractInfo.isCollect ? '已收藏':'收藏'}}
          <i class="el-icon-star-on" :class="this.contractInfo.isCollect ? 'collects':'collect'"></i></p>
        <p v-show="this.collectOk && this.contractInfo.status !=='stop'" @click="deleteContract" class="cursor-p">删除 <i
          class="el-icon-delete"></i></p>
        <p v-show="this.contractInfo.status ==='stop'">已删除 </p>
      </div>
      <ul class="info">
        <li><span>Balance:</span>{{this.contractInfo.balance}} NULS</li>
        <li><span>Transactions:</span>{{this.contractInfo.txCount}} Txns</li>
        <li class="overflow">
          <span>Contract Creator:</span>
          <label class="overflow cursor-p text-ds" @click="toNulscan(contractInfo.creater)">{{this.contractInfo.creater}}</label>
          <label class="labels">at txid</label>
          <label class="overflow cursor-p text-ds" @click="toTxid(contractInfo.createTxHash)">{{this.contractInfo.createTxHash}}</label>
        </li>
        <li v-show="this.contractInfo.isNrc20">
          <span>Token Tracker:</span>{{this.contractInfo.nrc20TokenName}}
          <font v-show="this.contractInfo.nrc20TokenSymbol">({{this.contractInfo.nrc20TokenSymbol}})</font></li>
      </ul>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick" class="contract-info-tab">
      <el-tab-pane label="交易记录" name="first">
        <el-table :data="tradeData" style="width: 100%">
          <el-table-column label="交易类型" width="80" align="center">
            <template slot-scope="scope">
              {{$t('message.type'+scope.row.type)}}
            </template>
          </el-table-column>
          <el-table-column prop="txData.data.sender" label="来源" min-width="180" align="center"></el-table-column>
          <el-table-column label="txid" min-width="180" align="center">
            <template slot-scope="scope">
								<span @click="toTxid(scope.row.hash)" class="cursor-p text-ds overflow">
									{{ scope.row.hash}}
								</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时间" width="140" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ $t('message.statusS'+scope.row.status) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next"
                       :page-size="15"
                       :total="totalAll"
                       :current-page="pages"
                       @current-change="allConsensusSize"
                       class="cb" v-show="totalAll>15">
        </el-pagination>

      </el-tab-pane>

      <el-tab-pane label="合约详情" name="second">
        <el-table :data="contractData" style="width: 100%">
          <el-table-column prop="name" label="方法" width="150" align="center"></el-table-column>
          <el-table-column prop="newArgs" label="参数" min-width="200" align="center">
          </el-table-column>
          <el-table-column prop="returnArg" label="返回值类型" width="150" align="center"></el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="调用合约" name="third" :disabled="this.contractInfo.status ==='stop'">

        <div class="query-info">
          <el-form :model="callForm" :rules="callRules" ref="callForm" class="call-contract">
            <el-form-item label="请选择一个方法:" class="lable">
              <el-select v-model="callForm.region" placeholder="请选择一个方法" @change="changeCallOptions">
                <el-option v-for="item in contractData" :key="item.name" :label="item.name" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-for="(domain, index) in callForm.domains"
              :label="domain.name + '('+domain.type+')'"
              :key="domain.name"
              :prop="'domains.' + index + '.value'"
              :rules="{required: true, message: domain.name+'不能为空', trigger: 'blur'}"
            >
              <el-input v-model.trim="domain.value" @change="getCallGas(contractItem)"></el-input>
            </el-form-item>

            <div class="call-senior">
              高级选择
              <el-switch v-model="callSeniorValue" :width="35" :disabled="this.switchDisabled"></el-switch>
            </div>
            <div class="seniorInfo" v-show="callSeniorValue">
              <el-form-item label="Gas Limit" prop="gas">
                <el-input v-model="callForm.gas" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                <p class="price-min" v-show="this.callForm.gas < this.systemGas">Gas值较小，有可能会导致合约失败</p>
              </el-form-item>
              <el-form-item label="Price" prop="price">
                <el-input v-model="callForm.price" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-form-item>
              <el-form-item label="Value" prop="values" v-show="!valuesIf">
                <el-input v-model="callForm.values"></el-input>
              </el-form-item>
              <el-form-item label="Addtion" prop="addtion">
                <el-input v-model="callForm.addtion"></el-input>
              </el-form-item>
            </div>

            <el-form-item class="submit-bt" style="text-align: center">
              <el-button type="primary" @click="submitCallForm('callForm')">调用</el-button>
            </el-form-item>
          </el-form>

          <div class="click-after scroll" v-show="submitCallFormIf">
            <p :class="this.submitCallFormHight <= 6 ? 'waingClass':''">
              <span v-show="this.submitCallFormHight <= 6">{{this.submitCallFormSuccse}}</span>
              <span v-show="this.submitCallFormHight > 6" class="cursor-p text-ds"
                    @click="toTxid(submitCallFormSuccse)">{{this.submitCallFormSuccse}}</span>
              <label v-show="this.submitCallFormHight <= 6 && !this.valuesIf">({{this.submitCallFormHight}}/6)</label>
            </p>
            <pre id="out_pre"></pre>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>

    <Password ref="password" @toSubmit="toSubmit"></Password>
  </div>
</template>

<script>
  import moment from 'moment'
  import Back from './../../components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import {copys, LeftShiftEight, getLocalTime} from '@/api/util.js'

  export default {
    data() {
      let validateGas = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入数值Gas：1-10000000'));
        } else if (value < 1 || value > 10000000) {
          callback(new Error('请输入数值Gas：1-10000000'));
        } else {
          callback();
        }
      };
      let validatePrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入数值Price'));
        } else {
          callback();
        }
      };
      return {
        //tab选中项
        activeName: sessionStorage.getItem('CinfoActiveName') || 'first',
        //输入密码选择URL及参数(delete:删除合约，call:合约方法调用)
        passChange: "delete",
        //默认账户地址
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        //合约地址
        contractAddress: this.$route.query.address,
        //合约信息
        contractInfo: [],
        //判断是否已收藏
        collectOk: false,
        //交易记录列表
        tradeData: [],
        //分页
        pages: 1,
        //总条数
        totalAll: 0,
        //合约方法列表
        contractData: [],
        //选中方法保存
        contractItem: [],
        //获取系统计算的gas
        systemGas: 0,
        //调用合约
        callForm: {
          region: '',
          domains: [],
          gas: '',
          price: '',
          values: '',
          addtion: '',
        },
        callRules: {
          gas: [
            {validator: validateGas, trigger: 'blur'}
          ],
          price: [
            {validator: validatePrice, trigger: 'blur'}
          ]
        },

        //方法列表
        callFormOptions: [],
        //调用合约的高级显示
        callSeniorValue: false,
        //高级显示开关是否可用
        switchDisabled: false,
        //判断是否是否上链
        valuesIf: false,
        //调用结果显示
        submitCallFormIf: false,
        //调用方法完成后返回的hash
        resultHash: '',
        //调用结果返回内容
        submitCallFormSuccse: '',
        submitCallFormHight: 0,
        //定义定时器
        contractInfoSetInterval: null,
      }
    },
    components: {
      Back,
      Password,
    },
    mounted() {
      this.getContractInfo(this.contractAddress);
      this.getContractTradeList(this.contractAddress);

      this.contractInfoSetInterval = setInterval(() => {
        setTimeout(() => {
          this.getContractTradeList(this.contractAddress);
        }, 5000);
        if (this.resultHash !== '') {
          this.getResultInfo(this.resultHash)
        }
      }, 5000)
    },

    destroyed() {
      clearInterval(this.contractInfoSetInterval)
    },
    methods: {

      /**
       * tab切换
       * @param tab
       **/
      handleClick(tab) {
        this.activeName = tab.name;
        this.resultHash = '';
      },

      /**
       * 根据合约地址获取合约详情
       * @param address
       **/
      getContractInfo(address) {
        this.$fetch('/contract/info/' + address + '?accountAddress=' + this.accountAddressValue)
          .then((response) => {
            console.log(response);
            if (response.success) {
              this.contractInfo = response.data;
              //双层选好获取合约详情的方法参数
              for (let i in response.data.method) {
                if (response.data.method[i].name !== '<init>' || !response.data.method) {
                  this.contractData.push(response.data.method[i]);
                }
                //获取合约详情的方法参数
                for (let k in response.data.method[i].args) {
                  if (response.data.method[i].newArgs) {
                    response.data.method[i].newArgs = response.data.method[i].newArgs + response.data.method[i].args[k].name + '_' + response.data.method[i].args[k].type + ',';
                  } else {
                    response.data.method[i].newArgs = response.data.method[i].args[k].name + '_' + response.data.method[i].args[k].type + ',';
                  }
                }
              }
              //判断是否自己创建的合约
              this.collectOk = this.accountAddressValue === response.data.creater;

              //判断是否显示Token Tracker
              //response.data.nrc20TokenNames = response.data.nrc20TokenName + response.data.nrc20TokenSymbol ? '(' + response.data.nrc20TokenSymbol + ')' : '';
              response.data.balance = LeftShiftEight(response.data.balance).toString();
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          });
      },

      /**
       * 收藏合约
       * Set remark submit
       * @param formName
       */
      collect() {
        let url = '';
        let params = '';
        if (this.contractInfo.isCollect) {
          url = '/contract/collection/cancel';
          params = '{"accountAddress":"' + this.accountAddressValue
            + '","contractAddress":"' + this.contractAddress
            + '"}';
        } else {
          url = '/contract/collection';
          params = '{"accountAddress":"' + this.accountAddressValue
            + '","contractAddress":"' + this.contractAddress
            + '","remarkName":""}';
        }
        //console.log(url);
        //console.log(params);
        this.$post(url, params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.contractInfo.isCollect = !this.contractInfo.isCollect;
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          })
      },

      /***
       * 删除合约
       **/
      deleteContract() {
        this.passChange = 'delete';
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
      },

      /**
       * 根据合约地址查询账户的合约交易列表
       * @param address
       **/
      getContractTradeList(address) {
        let url = '/contract/tx/list/' + address + '?pageNumber=' + this.pages + '&pageSize=15&accountAddress=' + localStorage.getItem('newAccountAddress');
        //console.log(url);
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.totalAll = response.data.total;
              for (let i in response.data.list) {
                response.data.list[i].time = moment(getLocalTime(response.data.list[i].time)).format('YYYY-MM-DD HH:mm:ss')
              }
              this.tradeData = response.data.list;
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          });
      },

      /**
       * 分页
       * */
      allConsensusSize(e) {
        this.pages = e;
        this.getContractTradeList(this.contractAddress);
      },

      /**
       * 浏览器跳转
       * @param address
       **/
      toNulscan(address) {
        window.open('https://nulscan.io/accountInfo?address=' + address, '_blank')
      },

      /**
       * toTxid跳转
       * @param txId
       */
      toTxid(txId) {
        this.$router.push({
          name: 'dealInfo',
          query: {hash: txId},
        })
      },

      /**
       * 选择方法
       * @param item
       **/
      changeCallOptions(item) {
        this.contractItem = item;

        this.callForm.domains = item.args;
        this.callForm.region = item.name;
        this.valuesIf = item.view;
        this.submitCallFormIf = false;
        this.submitCallFormSuccse = '';
        //选择方法去掉以前的hash
        this.resultHash = '';

        //是否上链，true:不上链,false:上链
        if (!item.view) {
          this.switchDisabled = false;
        } else {
          //禁止滑块打开
          this.switchDisabled = true;
          //关闭滑块
          this.callSeniorValue = false;
          //给高级参数设置最小参数
          this.systemCallGas = 1;
          this.callForm.gas = 1;
          this.callForm.price = 1;
          this.callForm.values = 0;
        }

        if (item.args.length > 0) {
          this.callForm.domains = item.args;
        } else {
          this.getCallGas(item)
        }

      },

      //交易动态参数是否必填项是否全部有值
      allParams(array) {
        let arg = {success: true, params: ''};
        for (let i of array) {
          if (i.value) {
            arg.params += '"' + i.value + '",';
          }
          if (i.request) {
            arg.success(i.value !== '');
          }
        }
        if (arg.params.length > 0) {
          arg.params = arg.params.substr(0, arg.params.length - 1);
        }
        return arg
      },

      /**
       * 估算调用智能合约的Gas消耗
       **/
      getCallGas(item) {
        let param = '';
        //判断是否上链方法（true:不上链,false:上链）
        if(!item.view){
          if (this.callForm.domains.length > 0 ) {
            if (this.allParams(this.callForm.domains).success) {
              param = '{"sender":"' + this.accountAddressValue
                + '","contractAddress":"' + this.contractAddress
                + '","value":"0","methodName":"' + item.name
                + '","methodDesc":"' + item.desc
                + '","price":"1"'
                + ',"args":[' + this.allParams(this.callForm.domains).params
                + ']}';
            } else {
              console.log("动态参数必填信息没填写")
            }
          } else {
            param = '{"sender":"' + this.accountAddressValue
              + '","contractAddress":"' + this.contractAddress
              + '","value":"0","methodName":"' + item.name
              + '","methodDesc":"' + item.desc
              + '","price":"1"}';
          }
        }
        //参数不为空执行
        if (param) {
          //console.log(param);
          this.$post('/contract/imputedgas/call', param)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                this.systemGas = response.data.gasLimit;
                this.callForm.gas = response.data.gasLimit;
                this.callForm.price = 20;
                this.callForm.values = 0;
              } else {
                this.$message({
                  message: this.$t('message.passWordFailed') + response.data.msg,
                  type: 'warning',
                })
              }
            })
        }
      },

      /**
       * 调用合约
       * @param formName
       */
      submitCallForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //判断是否上链方法
            if (!this.valuesIf) {
              this.passChange = 'call';
              //判断当前账户是否有密码
              if (localStorage.getItem('encrypted') === "true") {
                this.$refs.password.showPassword(true)
              } else {
                //没密码弹框
                this.$confirm(this.$t('message.c172'), '', {
                  confirmButtonText: this.$t('message.confirmButtonText'),
                  cancelButtonText: this.$t('message.cancelButtonText'),
                }).then(() => {
                  this.toSubmit('')
                }).catch(() => {
                  console.log("")
                })
              }
              //不上链直接调用
            } else {
              let param = '{"contractAddress":"' + this.contractAddress
                + '","methodName":"' + this.contractItem.name
                + '","methodDesc":"' + this.contractItem.desc
                + '","args":[' + this.allParams(this.callForm.domains).params
                + ']}';
              this.$post('/contract/view', param)
                .then((response) => {
                  //console.log(response);
                  if (response.success) {
                    this.submitCallFormIf = true;
                    document.getElementById('out_pre').innerText = '';
                    document.getElementById('out_pre').innerText = response.data.toString();
                  } else {
                    this.$message({
                      message: this.$t('message.passWordFailed') + response.data.msg,
                      type: 'warning',
                    })
                  }
                })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 输入密码确定交易
       *Enter the password to determine the transaction
       * @param password
       */
      toSubmit(password) {
        let url = '';
        let param = '';
        if (this.passChange === 'call') {
          url = '/contract/call';
          param = '{"sender":"' + this.accountAddressValue
            + '","gasLimit":' + this.callForm.gas
            + ',"price":' + this.callForm.price
            + ',"password":"' + password
            + '","remark":"' + this.callForm.addtion
            + '","contractAddress":"' + this.contractAddress
            + '","value":"' + this.callForm.values
            + '","methodName":"' + this.contractItem.name
            + '","methodDesc":"' + this.contractItem.desc
            + '","args":[' + this.allParams(this.callForm.domains).params
            + ']}';
        } else {
          url = '/contract/delete';
          param = '{"sender":"' + this.accountAddressValue
            + '","contractAddress":"' + this.contractAddress
            + '","password":"' + password
            + '","remark":""}';
        }
        //console.log(url);
        //console.log(param);
        this.$post(url, param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              if (this.passChange === 'call') {
                //console.log(this.valuesIf);
                this.submitCallFormSuccse='';
                this.submitCallFormIf = true;
                this.submitCallFormSuccse = response.data;
                this.resultHash = response.data;
                this.getResultInfo(response.data);
              } else {
                this.$router.push({
                  name: 'contract'
                })
              }
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          })
      },

      //获取上链方法调用后返回数据具体内容
      getResultInfo(hash) {
        this.$fetch('/contract/result/' + hash)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              document.getElementById('out_pre').innerText = '';
              if (response.data.flag) {
                this.submitCallFormHight = response.data.confirmCount;
                if (response.data.confirmCount > 6) {
                  document.getElementById('out_pre').innerText = '';
                  document.getElementById('out_pre').innerText = JSON.stringify(response.data.data, null, 2);
                  this.resultHash = '';
                } else {
                  this.submitCallFormSuccse = this.resultHash;
                }
              } else {
                this.submitCallFormSuccse = this.resultHash;
              }
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          })
      }
    },
    watch: {}
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .contract-info {
    width: 1024px;
    margin: auto;
    .contract-info-top {
      .address {
        width: auto;
        height: 70px;
        line-height: 70px;
        h3 {
          width: 70%;
          float: left;
        }
        p {
          width: 30%;
          float: right;
          text-align: right;
          .collects {
            color: #82bd39;
          }
          .collect {
            color: #8a929b;
          }
        }
      }
      ul {
        border: 1px solid #3a8ee6;
        height: 60px;
        padding: 10px 0;
        li {
          width: 65%;
          margin-left: 5%;
          line-height: 30px;
          float: left;
          &:nth-child(2n) {
            width: 25%;
          }
          span {
            width: 130px;
            display: block;
            float: left;
          }
          label {
            width: 220px;
            display: block;
            float: left;
            line-height: 16px;
            padding-top: 7px;
          }
          .labels {
            width: 50px;
          }
        }

      }
    }
    .contract-info-tab {
      margin-top: 20px;
      .query-info {
        width: 1022px;
        min-height: 100px;
        margin: auto;
        border: 1px solid #3a8ee6;
        .call-contract {
          width: 430px;
          margin: auto;
          .el-form-item {
            text-align: left;
            margin-bottom: 20px;
            .el-form-item__label {
              color: #FFFFFF;
              padding: 0;
              line-height: 10px;
            }
            .el-form-item__content {
              .el-select {
                width: 430px;
                .el-input--suffix {
                  .el-input__suffix {
                    .el-input__suffix-inner {
                      .el-select__caret {
                        line-height: 20px;
                      }
                    }
                  }
                }
              }
            }
          }
          .lable {
            .el-form-item__label {
              color: #FFFFFF;
              padding: 20px 0 0;
              line-height: 30px;
            }
          }
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
          .seniorInfo {
            .el-form-item {
              .el-form-item__content {
                .price-min {
                  color: #ffd966;
                  line-height: 15px;
                  text-align: left;
                }
              }
            }
          }
        }
        .click-after {
          width: 430px;
          max-height: 100px;
          background-color: #1c2738;
          text-align: left;
          margin: 0 auto 20px;
          overflow: auto;
          word-wrap: break-word;
          font-size: 14px;
          padding: 10px;
          &::-webkit-scrollbar { /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 6px;
          }
          &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 20px rgba(138, 146, 155, 0.2);
            background: rgba(0, 0, 0, 0.2);
          }
          &::-webkit-scrollbar-track { /*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 30px rgba(138, 146, 155, 0.2);
            border-radius: 0;
            background: rgba(0, 0, 0, 0.1);
          }
          p {
            span {

            }
          }
          .waingClass {
            color: #CEB448;
          }
        }
      }
    }
  }

</style>
