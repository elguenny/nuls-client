<template>
    <div class="users">
        <Back :backTitle="backTitle"></Back>
        <div class="freeze-list-tabs">
            <h2>{{$t('message.userInfoTitle')}}</h2>
            <el-button type="primary" icon="el-icon-plus" @click="toNewAccount" class="newAccount"></el-button>
            <el-table :data="userData">
                <el-table-column prop="address" :label="$t('message.tabName')" min-width="50" align='center'>
                </el-table-column>
                <el-table-column :label="$t('message.tabAlias')" min-width="25" class="user-aliasing">
                    <template slot-scope="scope">
                        <span>{{ scope.row.alias != null  ? scope.row.alias : "-" }}</span>
                        <i class="el-icon-edit cursor-p"
                           v-show="scope.row.alias != undefined  ? false : true"
                           @click="editAliasing(scope.row.address,scope.row.alias)" ></i>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.operation')" min-width="25" align='center'>
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="outUser(scope.row.address)">{{$t('message.tabRemove')}}</el-button>
                        <el-button size="mini" type="text" @click="backupUser(scope.row.address)">{{$t('message.tabBackups')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>-->
        </div>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: this.$t('message.walletManagement'),
                setAsAddress: localStorage.getItem('newAccountAddress'),
                userData: [],
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getUserList("/account/list");
        },
        methods: {
            //获取账户列表
            getUserList(url) {
                this.$fetch(url)
                    .then((response) => {
                        console.log(response);
                        this.userData = response.data;
                    });
            },
            //根据账户地址移除账户
            outUser(address) {
                this.$prompt(this.$t('message.passWordTitle'), '', {
                    confirmButtonText: this.$t('message.confirmButtonText'),
                    cancelButtonText: this.$t('message.cancelButtonText'),
                    inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                    inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                    inputType: 'password'
                }).then(({value}) => {
                    if (value === localStorage.getItem('userPass')) {
                        var param = '{"address":"' + address + '","password":"' + value + '"}';
                        this.$post('/wallet/remove/', param)
                            .then((response) => {
                                if(response.success){
                                    this.$message({
                                        type: 'success', message: this.$t('message.passWordSuccess')
                                    });
                                    this.getUserList("/account/list");
                                }else {
                                    this.$message({
                                        type: 'success', message: this.$t('message.passWordFailed') + response.msg
                                    });
                                }
                            })
                    } else {
                        this.$message({
                            type: 'success', message: this.$t('message.passWordWasincorrect')
                        });
                    }
                })
            },
            //备份账户地址跳转
            backupUser(address) {
                this.$router.push({
                    name: '/newAccount',
                    params: {newOk: false, address: address},
                })
            },
            //修改别名
            editAliasing(accountAddress, accountAlias) {
                this.$message({
                    type: 'info', message: "我们的工程师正专注研发，更多出色功能敬请期待！"
                });
                /*this.$router.push({
                    name: '/editAliasing',
                    params: {address: accountAddress, alias: accountAlias},
                })*/
            },
            //新增账户
            toNewAccount() {
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
                margin-right:50px ;
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