<template>
  <div class="contract">
    <div class="account-top">
      <label>{{$t('message.indexAccountAddress')}}：</label>
      <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
    </div>
    <div class="contract-info cb">
      <el-tabs v-model="contractActive" @tab-click="contractHandleClick" align="center">
        <el-tab-pane label="我的合约" name="first" class="first-index">
          <el-table :data="contractData" style="width: 100%">
            <el-table-column label="合约地址" min-width="180" align="center">
              <template slot-scope="scope">
                <span class="waingClass" v-show="scope.row.confirmCount <= 6">
                  {{ scope.row.contractAddress }}({{scope.row.confirmCount}}/6)
                </span>
                <span class="cursor-p text-ds" v-show="scope.row.status > 0 && scope.row.confirmCount >= 7"
                      @click="toContractInfo(scope.row.contractAddress)">{{ scope.row.contractAddress }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="180" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="标签名" width="180" align="center">
              <template slot-scope="scope">
                <div @click="setRemarkName(scope.row.contractAddress,scope.row.remarkName)">
                  <span class="cursor-p text-ds">{{ scope.row.remarkName ? scope.row.remarkName:'' }}</span>
                  <i class="el-icon-edit cursor-p"
                     v-show="scope.row.confirmCount > 6 && scope.row.status > 0 "></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="180" align="center">
              <template slot-scope="scope">
                <span>{{ $t('message.contractStatus'+scope.row.status) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <span class="cursor-p text-ds" @click="toCall(scope.$index, scope.row)"
                      v-show="scope.row.status === 1 && scope.row.confirmCount > 6">去调用</span>
                <span class="cursor-p text-ds" @click="cancelCollection(scope.$index, scope.row)"
                      v-show="!scope.row.create">取消收藏</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="this.contractDataTotal > 20"
            class="cb"
            @current-change="contractListSize"
            :current-page="contractDataNumber"
            :page-size="20"
            layout="prev, pager, next"
            :total="contractDataTotal">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="查找合约" name="second" class="second">

          <el-form :inline="true" :model="queryForm" status-icon :rules="queryRules" ref="queryForm" class="quer-form">
            <el-form-item label="" prop="address">
              <el-input type="text" v-model.trim="queryForm.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitQueryForm('queryForm')">访问</el-button>
            </el-form-item>
          </el-form>

          <div class="query-info" v-show="queryInfoIf">
            <el-form :model="callForm" :rules="callRules" ref="callForm" class="call-contract">
              <div class="address">
                <label>合约地址:</label><span class="cursor-p text-ds"
                                          @click="toContractInfo(callFormAddress)">{{this.callFormAddress}}</span><i></i>
              </div>
              <el-form-item label="请选择一个方法:">
                <el-select v-model="callForm.region" placeholder="请选择一个方法" @change="changeCallOptions">
                  <el-option v-for="item in callFormOptions" :key="item.name" :label="item.name" :value="item">
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
                <el-input v-model.trim="domain.value" @change="getCallGas(contractFormItem)"></el-input>
              </el-form-item>

              <div class="call-senior">
                高级选择
                <el-switch v-model="callSeniorValue" :width="35" :disabled="this.switchDisabled"></el-switch>
              </div>
              <div class="seniorInfo" v-show="callSeniorValue">
                <el-form-item label="Gas Limit" prop="gas">
                  <el-input v-model="callForm.gas" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                  <p class="price-min" v-show="this.callForm.gas < this.callSystemGas">Gas值较小，有可能会导致合约失败</p>
                </el-form-item>
                <el-form-item label="Price" prop="price">
                  <el-input v-model="callForm.price" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="Value" prop="values" v-show="!valuesIf">
                  <el-input v-model="callForm.values" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
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
                <label v-show="this.submitCallFormHight <= 6 && !this.valuesIf">({{this.submitCallFormHight}}/6)</label></p>
              <pre id="out_pre"></pre>
            </div>

          </div>

        </el-tab-pane>

        <el-tab-pane label="部署合约" name="third" class="third">
          <div class="third-radio">
            <el-radio-group v-model="contractRadio" @change="changeRadio">
              <el-radio :label="0">HEX编码部署</el-radio>
              <el-radio :label="1">Jar包部署</el-radio>
            </el-radio-group>
          </div>
          <el-form :model="contractForm" :rules="contractRules" ref="contractForm">
            <el-form-item label="" prop="hex" class="third-hex" v-show="this.contractRadio===0">
              <el-input type="textarea" v-model.trim="contractForm.hex" @change="getNewConstructor"></el-input>
            </el-form-item>
            <el-form-item label="" prop="desc" class="third-jar" v-show="this.contractRadio !==0">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="contractForm.fileUrl" :src="contractForm.fileUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item
              v-for="(domain, index) in contractForm.domains"
              :label="domain.name + '('+domain.type+')'"
              :key="domain.name"
              :prop="'domains.' + index + '.value'"
              :rules="{required: domain.required, message: domain.name+'不能为空', trigger: 'blur'}"
            >
              <el-input v-model.trim="domain.value" @change="newContractGas"></el-input>
            </el-form-item>

            <div class="senior">
              高级选择
              <el-switch v-model="seniorValue" :width="30"></el-switch>
            </div>
            <div class="seniorInfo" v-show="seniorValue">

              <el-form-item label="Gas Limit" prop="gas">
                <el-input v-model="contractForm.gas" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                <p class="price-min" v-show="this.contractForm.gas < this.systemGas">Gas值较小，有可能会导致合约失败</p>
              </el-form-item>
              <el-form-item label="Price" prop="price">
                <el-input v-model="contractForm.price" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-form-item>
              <el-form-item label="Addtion" prop="addtion">
                <el-input v-model="contractForm.addtion"></el-input>
              </el-form-item>
            </div>
            <el-form-item class="add-contrant">
              <div class="add-contrant-test">
                <el-button type="primary" @click="testContractForm('contractForm')"
                           :class=" !this.testIf ? 'isBright' : ''"
                           id="addContrantTest">测试合约
                </el-button>
                <i :class="this.testIf ? 'el-icon-success' : 'el-icon-error'" v-show="this.testIf"></i>
              </div>
              <div class="add-contrant-submit">
                <el-button type="primary" @click="deployContractForm('contractForm')"
                           :class=" this.testIf ? 'isBright' : ''">部署合约
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </div>
    <el-dialog title="设置修改标签名" :visible.sync="setRemarkNameDialog"
               class="setRemarkName-Dialog" @close="setRemarkNameCancel('setRemarkNameForm')">
      <el-form :model="setRemarkNameForm" :rules="setRemarkNameRules" ref="setRemarkNameForm">
        <el-form-item prop="remark">
          <el-input v-model.trim="setRemarkNameForm.remark" :maxlength="15"
                    onkeyup="value=value.replace(/[^[0-9a-zA-Z_]/g,'')">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRemarkNameCancel('setRemarkNameForm')">{{$t('message.cancelButtonText')}}</el-button>
        <el-button type="primary" @click="setRemarkNameSubmit('setRemarkNameForm')">{{$t('message.confirmButtonText')}}
        </el-button>
      </div>
    </el-dialog>

    <Password ref="password" @toSubmit="toSubmit"></Password>
  </div>

</template>

<script>
  import moment from 'moment'
  import {copys, LeftShiftEight, getLocalTime} from '@/api/util.js'
  import AccountAddressBar from '@/components/AccountAddressBar.vue'
  import Password from '@/components/PasswordBar.vue'

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
        //默认账户
        accountAddressValue: localStorage.getItem('newAccountAddress'),
        //tab默认选择的
        contractActive: 'first',
        //合约列表
        contractData: [],
        //合约列表总条数
        contractDataTotal: 0,
        //合约每页显示条数
        contractDataPages: 20,
        //合约列表分页
        contractDataNumber: 1,
        //标签名Dialog
        setRemarkNameDialog: false,
        //我的合约列表定时器
        contractSetInterval: null,
        //设置标签名地址保存
        setRemarkNameAddress: '',
        //设置标签名表单信息
        setRemarkNameForm: {
          remark: '',
        },
        setRemarkNameRules: {
          remark: [
            {required: true, message: '输入标签名', trigger: 'blur'}
          ]
        },
        //查询合约
        queryForm: {
          address: '',
        },
        queryRules: {
          address: [
            {required: true, message: '输入address', trigger: 'blur'}
          ]
        },
        //查询合约后获取的地址
        callFormAddress: '',
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
        //获取系统计算的gas
        callSystemGas: 0,

        //访问结果是否显示
        queryInfoIf: false,
        //方法列表
        callFormOptions: [],
        //调用合约的高级显示
        callSeniorValue: false,
        //高级显示开关是否可用
        switchDisabled: false,
        //调用结果显示
        submitCallFormIf: false,
        resultHash: '',
        //调用结果返回内容
        submitCallFormSuccse: '',
        submitCallFormHight: 0,
        //单选框选择
        contractRadio: 0,
        //高级选项开关
        seniorValue: false,
        //contract form 表单
        contractForm: {
          hex: '',
          fileUrl: '',
          domains: '',
          gas: '',
          price: '',
          addtion: '',
        },
        //调用方法系统计算的gas
        systemCallGas: '',
        //判断是否是否上链
        valuesIf: false,
        //保存选择方法item
        contractFormItem: [],
        //contract form 验证
        contractRules: {
          hex: [
            {required: true, message: '输入HEX', trigger: 'blur'}
          ],
          gas: [
            {validator: validateGas, trigger: 'blur'}
          ],
          price: [
            {validator: validatePrice, trigger: 'blur'}
          ]
        },
        //获取系统计算的gas
        systemGas: 0,
        //测试是否成功
        testIf: false,
        //部署表单记录
        deployForm: [],
      }
    },
    components: {
      AccountAddressBar,
      Password,
    },
    mounted() {
      this.getContractList(this.accountAddressValue);
      this.contractSetInterval = setInterval(() => {
        setTimeout(() => {
          this.getContractList(this.accountAddressValue);
        }, 5000);
        if (this.resultHash !== '') {
          this.getResultInfo(this.resultHash)
        }
      }, 5000)
    },
    destroyed() {
      clearInterval(this.contractSetInterval)
    },
    methods: {
      /**
       * 获取下拉选择地址
       * Get the drop-down selection address
       * @param chenckAddress
       */
      chenckAccountAddress(chenckAddress) {
        this.accountAddressValue = chenckAddress;
        this.getContractList(chenckAddress);
      },

      /**
       * 根据地址获取合约列表
       * @param address
       **/
      getContractList(address) {
        let url = '/contract/wallet/list/' + address + '?pageNumber=' + this.contractDataNumber + '&pageSize=' + this.contractDataPages + '&accountAddress=' + this.accountAddressValue
        //console.log(url);
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.contractData = response.data.list;
              this.contractDataTotal = response.data.total;
              let contractAddresslist = [];
              for (let i in response.data.list) {
                response.data.list[i].createTime = moment(getLocalTime(response.data.list[i].createTime)).format('YYYY-MM-DD HH:mm:ss');
              }
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          });
      },

      /***
       * 合约列表分页
       **/
      contractListSize(e) {
        this.contractDataNumber = e;
        this.getContractList(this.accountAddressValue);
      },

      /**
       * 设置备注
       * Set remark
       * @param address
       * @param remarkName
       */
      setRemarkName(address, remarkName) {
        this.setRemarkNameDialog = true;
        this.setRemarkNameAddress = address;
        this.setRemarkNameForm.remark = remarkName;
      },

      /**
       * 设置备注提交
       * Set remark submit
       * @param formName
       */
      setRemarkNameSubmit(formName) {
        //console.log(formName)
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = '{"accountAddress":"' + this.accountAddressValue
              + '","contractAddress":"' + this.setRemarkNameAddress
              + '","remarkName":"' + this.setRemarkNameForm.remark
              + '"}';
            //console.log(params);
            this.$post("/contract/collection", params)
              .then((response) => {
                //console.log(response);
                if (response.success) {
                  this.getContractList(localStorage.getItem('newAccountAddress'));
                  this.setRemarkNameAddress = '';
                  this.setRemarkNameDialog = false
                } else {
                  this.$message({
                    message: this.$t('message.passWordFailed') + response.data.msg,
                    type: 'warning',
                  })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 取消设置备注
       * @param formName
       */
      setRemarkNameCancel(formName) {
        this.$refs[formName].resetFields();
        this.setRemarkNameAddress = '';
        this.setRemarkNameDialog = false
      },

      /**
       * 去调用
       *  @param index
       *  @param row
       **/
      toCall(index, row) {
        sessionStorage.setItem('CinfoActiveName', 'third');
        this.$router.push({
          name: 'contractInfo',
          query: {address: row.contractAddress},
        })
      },

      /**
       * 取消收藏
       *  @param index
       *  @param row
       **/
      cancelCollection(index, row) {
        this.$confirm(this.$t('message.c172'), '', {
          confirmButtonText: this.$t('message.confirmButtonText'),
          cancelButtonText: this.$t('message.cancelButtonText'),
        }).then(() => {
          let url = '/contract/collection/cancel';
          let params = '{"accountAddress":"' + this.accountAddressValue
            + '","contractAddress":"' + row.contractAddress
            + '"}';
          //console.log(params);
          this.$post(url, params)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                this.getContractList(this.accountAddressValue);
              } else {
                this.$message({
                  message: this.$t('message.passWordFailed') + response.data.msg,
                  type: 'warning',
                })
              }
            })
        }).catch(() => {
          console.log("")
        });
      },

      /**
       * 选择部署方式
       * @param e
       **/
      changeRadio(e) {
        this.contractRadio = e;
      },

      /**
       * tab 切换
       * @param tab
       * @param event
       */
      contractHandleClick(tab, event) {
        this.contractActive = tab.name;
        this.contractForm.domains = '';
        this.resultHash = '';
      },

      /**
       * 查询合约提交
       * @param formName
       **/
      submitQueryForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.$fetch('/contract/info/' + _this.queryForm.address)
              .then((response) => {
                //console.log(response);
                if (response.success) {
                  this.callFormAddress = response.data.address;
                  this.queryInfoIf = true;
                  //this.callFormOptions = response.data.method
                  for (let i in response.data.method) {
                    if (response.data.method[i].name !== '<init>' || !response.data.method) {
                      this.callFormOptions.push(response.data.method[i]);
                    }
                  }
                } else {
                  this.$message({
                    message: this.$t('message.passWordFailed') + response.data.msg,
                    type: 'warning',
                  })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 选择方法
       * @param item
       **/
      changeCallOptions(item) {
        this.contractFormItem = item;
        this.callForm.domains = item.args;
        this.callForm.region = item.name;
        this.valuesIf = item.view;
        this.submitCallFormIf = false;
        this.submitCallFormSuccse = '';

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
          this.callForm.domains = item.args
        } else {
          this.getCallGas(item)
        }
      },

      /**
       * 估算调用智能合约的Gas消耗
       **/
      getCallGas(item) {
        let param = '';
        //判断是否上链方法（true:不上链,false:上链）
        if(!item.view) {
          if (item.args.length > 0) {
            if (this.allParams(item.args).success) {
              param = '{"sender":"' + this.accountAddressValue
                + '","contractAddress":"' + this.callFormAddress
                + '","value":"0","methodName":"' + item.name
                + '","methodDesc":"' + item.desc
                + '","price":"1"'
                + ',"args":[' + this.allParams(item.args).params
                + ']}';
            } else {
              console.log("动态参数必填信息没填写")
            }
          } else {
            param = '{"sender":"' + this.accountAddressValue
              + '","contractAddress":"' + this.callFormAddress
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
                this.systemCallGas = response.data.gasLimit;
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
       * 合约详情跳转
       **/
      toContractInfo(address) {
        sessionStorage.removeItem('CinfoActiveName');
        this.$router.push({
          name: 'contractInfo',
          query: {address: address},
        })
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
              let param = '{"contractAddress":"' + this.callFormAddress
                + '","methodName":"' + this.contractFormItem.name
                + '","methodDesc":"' + this.contractFormItem.desc
                + '","args":[' + this.allParams(this.contractFormItem.args).params
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

      /***
       * 获取构造方法
       *
       **/
      getNewConstructor() {
        let param = '{"contractCode":"' + this.contractForm.hex + '"}';
        //console.log(param);
        this.$post('/contract/constructor', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              if (response.data.args.length > 0) {
                this.contractForm.domains = response.data.args
              } else {
                this.newContractGas();
              }
            } else {
              this.$message({
                message: this.$t('message.passWordFailed') + response.data.msg,
                type: 'warning',
              })
            }
          })
      },

      //交易动态参数是否必填项是否全部有值
      allParams(array) {
        console.log(array);
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
       * 估算创建智能合约的Gas消耗
       **/
      newContractGas() {
        let param = '';
        if (this.contractForm.domains.length > 0) {
          if (this.allParams(this.contractForm.domains).success) {
            param = '{"sender":"' + this.accountAddressValue
              + '","price":1,"contractCode":"' + this.contractForm.hex
              + '","args":[' + this.allParams(this.contractForm.domains).params
              + ']}';
          } else {
            console.log("动态参数必填信息没填写")
          }
        } else {
          param = '{"sender":"' + this.accountAddressValue
            + '","price":1,"contractCode":"' + this.contractForm.hex
            + '"}';
        }
        //参数不为空执行
        //console.log(param);
        if (param) {
          this.$post('/contract/imputedgas/create', param)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                this.systemGas = response.data.gasLimit;
                this.contractForm.gas = response.data.gasLimit;
                this.contractForm.price = 20;
                //this.contractForm.domains = '';
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
       * 测试合约
       * @param formName
       */
      testContractForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = '{"sender":"' + this.accountAddressValue
              + '","gasLimit":' + this.contractForm.gas
              + ',"price":' + this.contractForm.price
              + ',"remark":"' + this.contractForm.addtion
              + '","contractCode":"' + this.contractForm.hex
              + '","args":[' + this.allParams(this.contractForm.domains).params
              + ']}';
            //console.log(param);
            this.$post('/contract/precreate', param)
              .then((response) => {
                //console.log(response);
                if (response.success) {
                  this.testIf = true;
                  this.$message({
                    type: 'success', message: "恭喜您，测试通过", duration: '800'
                  })
                } else {
                  this.$message({
                    message: this.$t('message.passWordFailed') + response.data.msg,
                    type: 'warning',
                  })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 部署合约
       * @param formName
       **/
      deployContractForm(formName) {
        this.newContractGas();
        setTimeout(() => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.deployForm = formName;
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
              console.log('error submit!!');
              return false;
            }
          });
        }, 300);
      },

      /**
       * 输入密码确定交易
       *Enter the password to determine the transaction
       * @param password
       */
      toSubmit(password) {
        let url = '';
        let param = '';
        if (this.contractActive === 'first') {

        } else if (this.contractActive === 'second') {
          url = '/contract/call';
          param = '{"sender":"' + this.accountAddressValue
            + '","gasLimit":' + this.callForm.gas
            + ',"price":' + this.callForm.price
            + ',"password":"' + password
            + '","remark":"' + this.callForm.addtion
            + '","contractAddress":"' + this.callFormAddress
            + '","value":"' + this.callForm.values
            + '","methodName":"' + this.contractFormItem.name
            + '","methodDesc":"' + this.contractFormItem.desc
            + '","args":[' + this.allParams(this.contractFormItem.args).params
            + ']}';
        } else {
          url = '/contract/create';
          param = '{"sender":"' + this.accountAddressValue
            + '","gasLimit":' + this.contractForm.gas
            + ',"price":' + this.contractForm.price
            + ',"password":"' + password
            + '","remark":"' + this.contractForm.addtion
            + '","contractCode":"' + this.contractForm.hex
            + '","args":[' + this.allParams(this.contractForm.domains).params
            + ']}';
        }
        //console.log(url);
        //console.log(param);
        this.$post(url, param)
          .then((response) => {
            //console.log(response);
            //判断那个tab选择
            if (this.contractActive === 'first') {

            } else if (this.contractActive === 'second') {
              if (response.success) {
                this.submitCallFormIf = true;
                this.submitCallFormSuccse = response.data;
                this.resultHash = response.data;
                this.getResultInfo(response.data);
              } else {
                this.$message({
                  message: this.$t('message.passWordFailed') + response.data.msg,
                  type: 'warning',
                })
              }
            } else {
              if (response.success) {
                this.testIf = false;
                this.systemGas = 0;
                this.contractActive = 'first';
                this.getContractList(localStorage.getItem('newAccountAddress'));
                this.$refs[this.deployForm].resetFields();
                this.$message({
                  type: 'success', message: "恭喜您，部署申请完成", duration: '800'
                })
              } else {
                this.$message({
                  message: this.$t('message.passWordFailed') + response.data.msg,
                  type: 'warning',
                })
              }
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

      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }

    },
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .contract {
    width: 1024px;
    margin: auto;
    background-color: #0c1323;
    .account-top {
      margin: 40px 0 30px;
    }
    .contract-info {
      .first-index {
        .el-table {
          .el-table__body-wrapper {
            table {
              tbody {
                tr {
                  td {
                    .cell {
                      .waingClass {
                        color: #CEB448;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .second {
        .quer-form {
          text-align: left;
          .el-form-item {
            .el-form-item__content {
              .el-input {
                input {
                  width: 500px;
                }
              }
              .el-button--primary {
                width: 100px;
              }
            }
          }
          .submit-bt {
            .el-form-item__content {
              text-align: center;
            }
          }
        }
        .query-info {
          width: 1022px;
          min-height: 100px;
          margin: auto;
          border: 1px solid #3a8ee6;
          .call-contract {
            width: 430px;
            .address {
              text-align: left;
              margin: 30px auto 10px;
              span {
                color: #C1C5C9;
              }
            }
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
      .third {
        .third-radio {
          margin: 20px 0;
          text-align: left;
          .el-radio-group {
            .el-radio {
              .el-radio__input {
                .el-radio__inner {

                }
              }
              .is-checked {
                .el-radio__inner {
                  border-color: #82bd39;
                  background: #82bd39;
                }
              }
            }
            .is-checked {
              .el-radio__label {
                color: #82bd39;
              }
            }
          }
        }
        .el-form {
          .third-hex {
            .el-form-item__content {
              .el-textarea {
                .el-textarea__inner {
                  height: 220px;
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
          .third-jar {
            .el-form-item__content {
              .avatar-uploader {
                .el-upload--text {
                  i {
                    padding: 80px;
                    border: 1px solid #24426c;
                    font-size: 30px;
                  }
                }
              }
            }
          }
          .senior {
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
          .el-form-item {
            .el-form-item__label {
              line-height: 0;
            }
            .el-form-item__content {
            }
          }
          .add-contrant {
            .el-form-item__content {
              .el-button {
                margin: auto;
              }
              .add-contrant-test {
                i {
                  display: block;
                  position: relative;
                  top: -20px;
                  right: -145px;
                  line-height: 1px;
                }
                .el-icon-error {
                  color: #ea1818;
                }
                .el-icon-success {
                  color: #5bdd5b;
                }
              }
              .add-contrant-test, .add-contrant-submit {
                .el-button {
                  background: #1c2738;
                }
                .isBright {
                  background: #658ec7;
                }
              }
            }
          }
        }
      }
    }
    .setRemarkName-Dialog {
      .el-dialog {
        width: 500px;
        .el-dialog__header {
          text-align: center;
          .el-dialog__title {
            color: #FFFFFF;
            line-height: 80px;
            margin-left: 0;
          }
        }
        .el-dialog__body {

        }
        .el-dialog__footer {
          .dialog-footer {
            .el-button {
              width: 150px;
            }
          }
        }
      }
    }
  }

</style>
