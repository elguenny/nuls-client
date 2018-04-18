<template>
    <div class="users">
        <Back :backTitle="this.$t('message.walletManagement')" :backUrl="backUrl"></Back>
        <div class="freeze-list-tabs">
            <h2>{{$t('message.userInfoTitle')}}</h2>
            <el-button type="primary" icon="el-icon-plus" @click="toNewAccount" class="newAccount"></el-button>
            <el-table :data="userData">
                <el-table-column prop="address" :label="$t('message.tabName')" min-width="438" align='center'>
                </el-table-column>
                <!--<el-table-column :label="$t('message.tabAlias')" width="100" class="user-aliasing">
                    <template slot-scope="scope">
                        <span>{{ scope.row.alias != null  ? scope.row.alias : "-" }}</span>
                        <i class="el-icon-edit cursor-p"
                           v-show="scope.row.alias != null  ? false : true"
                           @click="editAliasing(scope.row.address,scope.row.alias)"></i>
                    </template>
                </el-table-column>-->
                <el-table-column :label="$t('message.operation')" width="150" align='center'>
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="outUser(scope.row.address)">
                            {{$t('message.tabRemove')}}
                        </el-button>
                        <el-button size="mini" type="text" @click="backupUser(scope.row.address)">
                            {{$t('message.tabBackups')}}
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
    import Back from '@/components/BackBar.vue';
    import Password from '@/components/PasswordBar.vue';
    export default {
        data() {
            return {
                outOrBackup: 0,
                backUrl: '/wallet',
                setAsAddress: '',
                userData: [],
                totalAll:0,
            }
        },
        components: {
            Back,
            Password,
        },
        mounted() {
            let _this = this;
            this.getUserList("/account/list",{"pageSize": 8, "pageNumber": 1});
        },
        methods: {
            back() {
                this.$router.push({
                    name: '/wallete',
                })
            },
            //获取账户列表
            getUserList(url,params) {
                this.$fetch(url,params)
                    .then((response) => {
                        if (response.success) {
                            console.log(response);
                            this.totalAll = response.data.total;
                            if (response.data.list.length === 0) {
                                localStorage.setItem('fastUser','0');
                                localStorage.setItem("userPass", "");
                                localStorage.setItem("newAccountAddress", "");
                                localStorage.setItem("toUserInfo", "0");
                            }else {
                                localStorage.setItem('fastUser','1');
                                localStorage.setItem("newAccountAddress",response.data.list[0].address);
                            }
                            this.$store.commit("setAddressList",response.data.list);
                            this.userData = response.data.list;
                        }
                    });
            },
            userListSize(events){
                this.getUserList("/account/list",{"pageSize": 8, "pageNumber": events});
            },
            //点击根据地址移除账户事件
            outUser(address) {
                this.setAsAddress = address;
                this.outOrBackup = 1;
                this.$refs.password.showPassword(true);
            },
            //移除账户
            outUserAddress(url,params){
                this.$post(url, params)
                    .then((response) => {
                        if (response.success) {
                            this.$message({
                                type: 'success', message: this.$t('message.passWordSuccess')
                            });
                            this.getUserList("/account/list");
                        } else {
                            this.$message({
                                type: 'success', message: this.$t('message.passWordFailed') + response.msg
                            });
                        }
                    })
            },
            //备份账户
            backupUser(address) {
                this.setAsAddress = address;
                this.outOrBackup = 2;
                this.$refs.password.showPassword(true);

            },
            //输入密码提交
            toSubmit(password) {
                //判断密码是否正确
                if (localStorage.getItem("userPass") !== '') {
                    if (password !== localStorage.getItem("userPass")) {
                        this.$message({
                            type: 'success', message: this.$t('message.passWordCuo')
                        });
                    } else {
                        if(this.outOrBackup === 1){
                            let params = '{"address":"' + this.setAsAddress + '","password":"' + password + '"}';
                            this.outUserAddress('/wallet/remove/', params)
                        }else {
                            this.$router.push({
                                name: '/newAccount',
                                params: {newOk: false, address: this.setAsAddress},
                            })
                        }
                    }
                } else {
                    console.log("判断老用户导入")
                }
            },
            //修改别名
            editAliasing(Address) {
                this.$router.push({
                    name: '/editAliasing',
                    params: {address: Address},
                })
            },
            //新增账户
            toNewAccount() {
                localStorage.setItem('toUserInfo',"0");
                this.$router.push({
                    path: '/firstInto/firstInfo'
                })
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