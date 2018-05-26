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
            <el-pagination layout="prev, pager, next" :page-size="8" :total=this.totalAll class="cb"
                           v-show="totalAllOk = this.totalAll>8 ?true:false"
                           @current-change="userListSize"></el-pagination>
            <Password ref="password" @toSubmit="toSubmit"></Password>

        </div>
    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'

  export default {
    data () {
      return {
        outOrBackup: 0,
        backUrl: '/wallet',
        setAsAddress: '',
        userData: [],
        totalAll: 0,
      }
    },
    components: {
      Back,
      Password,
    },
    mounted () {
      let _this = this
      this.getUserList('/account', {'pageSize': 8, 'pageNumber': 1})
    },
    methods: {
      back () {
        this.$router.push({
          name: '/wallete',
        })
      },
      //获取所有账户列表
      getAllUserList (url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              this.$store.commit('setAddressList', response.data.list)
            }
          })
      },
      //获取账户列表
      getUserList (url, params) {
        this.$fetch(url, params)
          .then((response) => {
            if (response.success) {
              console.log(response)
              this.totalAll = response.data.total
              if (response.data.list.length === 0) {
                localStorage.setItem('fastUser', '0')
                localStorage.setItem('userPass', '')
                localStorage.setItem('newAccountAddress', '')
                localStorage.setItem('toUserInfo', '0')
              } else {
                localStorage.setItem('fastUser', '1')
                localStorage.setItem('newAccountAddress', response.data.list[0].address)
                localStorage.setItem('encrypted', response.data.list[0].encrypted)
              }
              this.getAllUserList('/account')
              this.userData = response.data.list
            }
          })
      },
      userListSize (events) {
        this.getUserList('/account', {'pageSize': 8, 'pageNumber': events})
      },
      //点击根据地址移除账户事件
      outUser (address, encrypted) {
        if (encrypted) {
          this.setAsAddress = address
          this.outOrBackup = 1
          this.$refs.password.showPassword(true)
        } else {
          this.$confirm(this.$t('message.c162'), '', {
            confirmButtonText: this.$t('message.confirmButtonText'),
            cancelButtonText: this.$t('message.cancelButtonText')
          }).then(() => {
            let params = '{"password":""}'
            this.outUserAddress('/account/remove/' + address, params)
          }).catch(() => {

          })
        }

      },
      //移除账户
      outUserAddress (url, params) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
        ) {
          this.$post(url, params)
            .then((response) => {
              //console.log("params="+params)
              if (response.success) {
                this.$message({
                  type: 'success', message: this.$t('message.passWordSuccess')
                })
                this.getUserList('/account', {'pageSize': 8, 'pageNumber': 1})
              } else {
                this.$message({
                  type: 'warning', message: this.$t('message.passWordFailed') + response.msg
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
      backupUser (address, encrypted) {
        this.setAsAddress = address
        this.outOrBackup = 2
        if (encrypted) {
          this.$refs.password.showPassword(true)
        } else {
          this.$confirm(this.$t('message.c163'), '', {
            confirmButtonText: this.$t('message.confirmButtonText'),
            cancelButtonText: this.$t('message.cancelButtonText')
          }).then(() => {
            localStorage.setItem('userPass', '')
            this.$router.push({
              name: '/newAccount',
              params: {newOk: false, address: this.setAsAddress},
            })
          }).catch(() => {

          })
        }
      },
      //修改or设置密码
      toPassword (address, encrypted) {
        if(encrypted){
          this.$router.push({
            name: '/editorPassword',
            params: {address: address,backInfo:this.$t('message.accountManagement')},
          })
        }else{
          this.$router.push({
            name: '/setPassword',
            params: {address:address,backInfo:this.$t('message.accountManagement')},
          })
        }

      },
      //输入密码提交
      toSubmit (password) {
        if (this.outOrBackup === 1) {
          //console.log(this.outOrBackup);
          let params = '{"password":"' + password + '"}'
          this.outUserAddress('/account/remove/' + this.setAsAddress, params)
        } else {
          //console.log("outOrBackup="+this.outOrBackup);
          localStorage.setItem('userPass', password)
          this.$router.push({
            name: '/newAccount',
            params: {newOk: false, address: this.setAsAddress},
          })
        }

      },
      //修改别名
      editAliasing (Address, encrypted) {
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
      //新增账户
      toNewAccount () {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight
          && sessionStorage.getItem('setNodeNumberOk') === 'true') {
          localStorage.setItem('toUserInfo', '0')
          this.$router.push({
            path: '/firstInto/firstInfo'
          })
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }
      }
    }
  }
</script>
<style lang="less">
    @import url("../../assets/css/style.less");

    .users {
        width: 100%;
        margin: auto;
        .freeze-list-tabs {
            width: 86%;
            margin: auto;
            .newAccount {
                width: 30px;
                line-height: 20px;
                height: 20px;
                background-color: #0b1422;
                float: right;
                border: 1px solid #0b1422;
                margin-bottom: 10px;
                margin-right: 40px;
            }
            h2 {
                text-align: center;
                line-height: 3rem;
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
    }
</style>