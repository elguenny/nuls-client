<template>
  <div class="users">
    <Back :backTitle="this.$t('message.walletManagement')" :backUrl="backUrl"></Back>
    <div class="freeze-list-tabs">
      <h2>{{$t('message.userInfoTitle')}}</h2>
      <el-button type="primary" icon="el-icon-plus" @click="toNewAccount" class="newAccount"></el-button>
      <el-table :data="userData">
        <el-table-column prop="address" :label="$t('message.tabName')" width="350" align='center'>
        </el-table-column>
        <el-table-column :label="$t('message.tabAlias')" width="100" class="user-aliasing">
          <template slot-scope="scope">
            <span>{{ scope.row.alias != null  ? scope.row.alias : '-' }}</span>
            <i class="el-icon-edit cursor-p"
               v-show="scope.row.alias != null  ? false : true"
               @click="editAliasing(scope.row.address,scope.row.encrypted)"></i>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.tabAlias1')" width="220" class="user-aliasing">
          <template slot-scope="scope">
            <span class="cursor-p text-d" @click="setRemark(scope.row.address,scope.row.remark)">{{ scope.row.remark != null  ? scope.row.remark : '' }}</span>
            <i class="el-icon-edit cursor-p"
               v-show="scope.row.remark != null  ? false : true"
               @click="setRemark(scope.row.address,scope.row.remark)"></i>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.operation')" min-width="150" align='center'>
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="outUser(scope.row.address,scope.row.encrypted)">
              {{$t('message.tabRemove')}}
            </el-button>
            <el-button size="mini" type="text" @click="backupUser(scope.row.address,scope.row.encrypted)">
              {{$t('message.tabBackups')}}
            </el-button>
            <el-button size="mini" type="text" @click="toPassword(scope.row.address,scope.row.encrypted)">
              {{scope.row.encrypted ? $t('message.c160'):$t('message.c161')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :page-size="20" :total=this.totalAll class="cb"
                     v-show="totalAllOk = this.totalAll>20 ? true:false"
                     @current-change="userListSize"></el-pagination>
      <Password ref="password" @toSubmit="toSubmit"></Password>
    </div>
    <el-dialog :title="$t('message.setManagement')+$t('message.tabAlias1')" :visible.sync="setRemarkDialog"
               class="setRemark_Dialog" @close="setRemarkCancel('setRemarkForm')">
      <el-form :model="setRemarkForm" :rules="setRemarkRules" ref="setRemarkForm">
        <el-form-item prop="remark">
          <el-input v-model.trim="setRemarkForm.remark" :maxlength="15"
                    onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
                    onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
                    oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRemarkCancel('setRemarkForm')">{{$t('message.cancelButtonText')}}</el-button>
        <el-button type="primary" @click="setRemarkSubmit('setRemarkForm')">{{$t('message.confirmButtonText')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'

  export default {
    data() {
      return {
        outOrBackup: 0,
        backUrl: '/wallet',
        setAsAddress: this.$route.params.address,
        userData: [],
        totalAll: 0,
        //定时刷新列表
        userInfoSetInterval: null,
        setRemarkForm: {
          remark: ''
        },
        setRemarkRules: {
          remark: [
            {min: 0, max: 21, message: '超出长度', trigger: 'blur'}
          ]
        },
        setRemarkAddress: '',
        setRemarkDialog: false,
      }
    },
    components: {
      Back,
      Password,
    },
    mounted() {
      let _this = this;
      this.getUserList('/account', {'pageSize': 20, 'pageNumber': 1});
      this.userInfoSetInterval = setInterval(() => {
        this.getUserList('/account', {'pageSize': 20, 'pageNumber': 1});
      }, 10000)
    },
    //离开当前页面后执行
    destroyed() {
      clearInterval(this.userInfoSetInterval)
    },
    methods: {
      back() {
        this.$router.push({
          name: '/wallete',
        })
      },

      //获取所有账户列表
      getAllUserList(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$store.commit('setAddressList', response.data.list);
            }
          })
      },

      //获取账户列表
      getUserList(url, params) {
        this.$fetch(url, params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              if (response.data.list.length > 0) {
                let set = new Set();
                for (let i = 0; i < response.data.list.length; i++) {
                  set.add(response.data.list[i].address);
                }
                if (!set.has(localStorage.getItem('newAccountAddress'))) {
                  localStorage.setItem('newAccountAddress', response.data.list[0].address);
                  localStorage.setItem('addressAlias', response.data.list[0].alias ? response.data.list[0].alias : '');
                  localStorage.setItem('addressRemark', response.data.list[0].remark ? response.data.list[0].alias : '');
                  localStorage.setItem('encrypted', response.data.list[0].encrypted)
                }
              } else {
                localStorage.setItem('newAccountAddress', '');
                localStorage.setItem('addressAlias', '');
                localStorage.setItem('addressRemark', '');
                localStorage.setItem('encrypted', '')
              }
              this.totalAll = response.data.total;
              this.getAllUserList('/account');
              this.userData = response.data.list
            }
          })
      },

      //分页功能
      userListSize(events) {
        this.getUserList('/account', {'pageSize': 20, 'pageNumber': events})
      },

      //点击根据地址移除账户事件
      outUser(address, encrypted) {
        this.setAsAddress = address;
        this.outOrBackup = 1;
        if (encrypted) {
          this.$refs.password.showPassword(true)
        } else {
          this.$confirm(this.$t('message.c162'), '', {
            confirmButtonText: this.$t('message.confirmButtonText'),
            cancelButtonText: this.$t('message.cancelButtonText')
          }).then(() => {
            let params = '{"password":""}';
            this.outUserAddress('/account/remove/' + address, params)
          }).catch(() => {
            console.log("err")
          })
        }

      },

      //移除账户
      outUserAddress(url, params) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
          this.$post(url, params)
            .then((response) => {
              //console.log("params="+params)
              if (response.success) {
                this.$message({
                  type: 'success', message: this.$t('message.passWordSuccess')
                });
                this.getUserList('/account', {'pageSize': 20, 'pageNumber': 1})
              } else {
                this.$message({
                  type: 'warning', message: this.$t('message.passWordFailed') + response.data.msg
                })
              }
            })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      },

      //备份账户
      backupUser(address, encrypted) {
        this.setAsAddress = address;
        this.outOrBackup = 2;
        if (encrypted) {
          this.$refs.password.showPassword(true)
        } else {
          this.$confirm(this.$t('message.c163'), '', {
            confirmButtonText: this.$t('message.confirmButtonText'),
            cancelButtonText: this.$t('message.cancelButtonText')
          }).then(() => {
            this.$router.push({
              name: '/newAccount',
              params: {newOk: false, address: this.setAsAddress},
            })
          }).catch(() => {

          })
        }
      },

      //修改or设置密码
      toPassword(address, encrypted) {
        if (encrypted) {
          this.$router.push({
            name: '/editorPassword',
            params: {address: address, backInfo: this.$t('message.accountManagement')},
          })
        } else {
          this.$router.push({
            name: '/setPassword',
            params: {address: address, backInfo: this.$t('message.accountManagement')},
          })
        }

      },

      //输入密码提交
      toSubmit(password) {
        if (this.outOrBackup === 1) {
          let params = '{"password":"' + password + '"}';
          this.outUserAddress('/account/remove/' + this.setAsAddress, params)
        } else {
          localStorage.setItem('userPass', password);
          let params = '{"password":"' + password + '"}';
          this.queryPassword('/account/password/validation/' + this.setAsAddress, params)
        }
      },

      //查询密码是否正确
      queryPassword(url, params) {
        this.$post(url, params)
          .then((response) => {
            //console.log(response);
            if (response.data.value) {
              this.$router.push({
                name: '/newAccount',
                params: {newOk: false, address: this.setAsAddress},
              })
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.c198')
              })
            }
          })
      },

      //修改别名
      editAliasing(Address, encrypted) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
          && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          this.$router.push({
            name: '/editAliasing',
            params: {address: Address, encrypted: encrypted},
          })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      },

      /**
       * 设置备注
       * Set remark
       * @param address
       */
      setRemark(address, remark) {
        //console.log(address)
        this.setRemarkAddress = address;
        this.setRemarkForm.remark = remark;
        this.setRemarkDialog = true
      },

      /**
       * 设置备注提交
       * Set remark submit
       * @param formName
       */
      setRemarkSubmit(formName) {
        //console.log(formName)
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {"remark": _this.setRemarkForm.remark};
            _this.$post("/account/remark/" + _this.setRemarkAddress, params)
              .then((response) => {
                //console.log(response);
                if (response.success) {
                  if (_this.setRemarkAddress === localStorage.getItem('newAccountAddress')) {
                    localStorage.setItem('addressRemark', _this.setRemarkForm.remark)
                  }
                  _this.getUserList('/account', {'pageSize': 20, 'pageNumber': 1});
                  _this.setRemarkAddress = '';
                  _this.setRemarkDialog = false
                } else {
                  _this.$message({
                    type: 'warning', message: this.$t('message.passWordFailed')
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
      setRemarkCancel(formName) {
        this.$refs[formName].resetFields();
        this.setRemarkAddress = '';
        this.setRemarkDialog = false
      },

      //新增账户
      toNewAccount() {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
          && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          localStorage.setItem('toUserInfo', '0');
          this.$router.push({
            name: '/firstInfo',
          })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      },

    }
  }
</script>
<style lang="less">
  @import url("../../assets/css/style.less");

  .users {
    width: 1024px;
    margin: auto;
    .freeze-list-tabs {
      width: 100%;
      margin: auto;
      .newAccount {
        width: 30px;
        /* line-height: 20px;*/
        height: 30px;
        background-color: #0b1422;
        float: right;
        border: 1px solid #0b1422;
        margin-bottom: 10px;
        margin-right: 40px;
      }
      h2 {
        text-align: center;
        line-height: 3rem;
        font-weight: bold;
      }
    }
    .el-table th {
      background-color: #17202e;
    }
    .el-table tr {
      background-color: #0c1323;
    }
    .el-pagination {
      margin-top: 1rem;
      text-align: center;
    }
    .setRemark_Dialog {
      .el-dialog {
        width: 500px;
        .el-dialog__header {
          .el-dialog__title {
            color: #FFFFFF;
            text-align: center;
            line-height: 80px;
            margin-left: 45%;
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
