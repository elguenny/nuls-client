<template>
    <div class="transfer">
        <Back :backTitle="backTitle"></Back>
        <div class="transfer-info">
            <h2>转账</h2>
            <el-form :model="transferForm" :rules="rules" ref="transferForm">
                <el-form-item label="账户地址:" class="out-address">
                    <el-select v-model="address" placeholder="请选择账户地址" @change="accountAddressChecked">
                        <el-option v-for="item in accountAddress" :key="item.address"
                                   :label="item.address + item.alias == null ? '('+item.alias+')' : '' "
                                   :value="item.address">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转账地址:" class="join-address" prop="joinAddress">
                    <el-input type="text" v-model="transferForm.joinAddress"></el-input>
                    <i @click="toUsersAddressList"></i>
                </el-form-item>
                <el-form-item label="转账金额:" prop="joinNo" class="join-nos">
                    <span class="allUsable">当前余额:{{ usable }} NULS</span>
                    <el-input type="text" v-model.number="transferForm.joinNo" class="joinNo"></el-input>
                    <span class="allNo" @click="allUsable(usable)">全部</span>
                </el-form-item>
                <el-form-item label="手续费:0.01NULS" class="service-no">
                </el-form-item>
                <el-form-item label="备注:" class="remark">
                    <el-input type="textarea" v-model="transferForm.remark"></el-input>
                </el-form-item>
                <el-form-item class="transfer-submit">
                    <el-button type="primary" @click="transferSubmit('transferForm')">确认转账</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogTableVisible">
                <el-table :data="userAddressList" @row-dblclick="dbcheckedAddress">
                    <el-table-column property="userAddress" label="账户" min-width="60" align='center'></el-table-column>
                    <el-table-column property="userAlias" label="别名" min-width="20" align='center'></el-table-column>
                    <el-table-column property="userHelp" label="备注" min-width="20" align='center'></el-table-column>
                    <el-table-column label="操作" min-width="20" align='center'>
                        <template slot-scope="scope">
                            <span class="cursor-p text-d" @click="checkedAddress(scope.row.userAddress)">选择</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            var checkJoinAddress = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入转账地址！'));
                }
                setTimeout(() => {
                    if (value === this.address) {
                        callback(new Error('转账地址不能是账户地址！'));
                    } else {
                        callback();
                    }
                }, 500);
            };
            var checkJoinNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入转账金额！'));
                }
                setTimeout(() => {
                    var re = /^\d+(?=\.{0,1}\d+$|$)/;
                    if (!re.exec(value)){
                        callback(new Error('请输入正确的转账金额为数字值！'));
                    } else if (value > this.usable-0.01) {
                        callback(new Error('转账金额不能大于可用余额！'));
                    } else {
                        callback();
                    }

                }, 100);

            };
            return {
                backTitle: '钱包管理',
                address: this.$route.params.address,
                usable: '0',
                accountAddress: [],
                transferForm: {
                    outName: '',
                    joinAddress: '',
                    joinNo: '',
                    serviceNo: '',
                    remark: ''
                },
                rules: {
                    joinAddress: [
                        {validator: checkJoinAddress, trigger: 'blur'}
                    ],
                    joinNo: [
                        {validator: checkJoinNo, trigger: 'blur'}
                    ]
                },
                userAddressList: [],
                dialogTableVisible: false,
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
            this.getBalanceAddress('/account/balance/' + this.address);
        },
        methods: {
            //获取账户地址列表
            getaccountAddress(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.accountAddress = response.data;
                    });
            },
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if(response.success){
                            this.usable = response.data.usable * 0.0000000001;
                        }
                    });
            },
            //选择账户地址
            accountAddressChecked(value) {
                this.address = value;
                this.getBalanceAddress('/account/balance/' + this.address)
            },
            //选择全部金额
            allUsable(no) {
                this.transferForm.joinNo = (parseInt(no)-0.01).toString();
            },
            //选择通讯录
            toUsersAddressList() {
                this.dialogTableVisible = true;
                var request = indexedDB.open('usersDB', 1);
                var dbData = [];
                request.onsuccess = function (event) {
                    var db = event.target.result;
                    var tx = db.transaction('addressList', 'readonly');
                    var store = tx.objectStore('addressList');
                    // 打开游标，遍历customers中所有数据
                    store.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            dbData.push(cursor.value);
                            cursor.continue();
                        }
                    }
                }
                this.userAddressList = dbData;
            },
            //选中通讯录地址
            checkedAddress(address) {
                this.transferForm.joinAddress = address;
                this.dialogTableVisible = false;
            },
            //双击选择通讯录地址
            dbcheckedAddress(row, event) {
                this.transferForm.joinAddress = row.userAddress;
                this.dialogTableVisible = false;
            },
            //确认转账
            transferSubmit(fromName) {
                this.$refs[fromName].validate((valid) => {
                    if (valid) {
                        this.$prompt(this.$t('message.passWordTitle'), '', {
                            confirmButtonText: this.$t('message.confirmButtonText'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                            inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = '{"address":"' + this.address + '","toAddress":"' + this.transferForm.joinAddress + '","amount":"' + this.transferForm.joinNo * 1000000 + '","password":"' + value + '","remark":"' + this.transferForm.remark + '"}';
                            this.$post('/wallet/transfer/', param)
                                .then((response) => {
                                    if (response.success) {
                                        this.$message({
                                            message: '恭喜您！转账成功！',
                                            type: 'success'
                                        });
                                        this.transferForm.joinAddress = '';
                                        this.transferForm.joinNo = '';
                                        this.transferForm.remark = ''
                                    } else {
                                        this.$message({
                                            message: '对不起！' + response.msg,
                                            type: 'warning',
                                        });
                                    }
                                })
                        })
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    #top-bg() {
        display: block;
        width: 2rem;
        height: 2rem;
        background-repeat: no-repeat;
        background-image: url(../../assets/images/top-icon.png);
        background-size: 200px;
    }

    .transfer {
        width: 100%;
        margin: auto;
        .transfer-info {
            width: 70%;
            margin: auto;
            .joinNo {
                .el-input__inner {
                    background-color: #17202e;
                    border: 1px solid #24426c;
                }
            }
            .out-name {
                font-size: 14px;
                color: #606266;
            }
            .out-name,
            .service-no {
                label {
                    float: left;
                    padding-right: 0.5rem;
                }
            }
            .out-address {
                .el-select {
                    width: 100%;
                }
            }
            .join-address {
                i {
                    #top-bg;
                    position: relative;
                    z-index: 1025;
                    float: right;
                    margin-top: -36px;
                    margin-right: 0px;
                    background-position: -3px -70px;
                }
            }
            .remark {
                .el-textarea__inner {
                    background-color: #17202e;
                }
            }
            .transfer-submit {
                text-align: center;
                button {
                    width: 30%;
                }
            }
            h2 {
                text-align: center;
                line-height: 3rem;
            }
            input[type="text"],
            input[type="password"],
            select {
                background: #17202e;
            }
        }

        .el-form-item {
            margin-bottom: 0px;
        }
        .join-address, .join-nos {
            margin-bottom: 15px;
        }
        .el-form-item__label {
            line-height: 25px;
            padding: 0px;
        }
        .el-input__suffix {
            margin-top: 0px;
        }
        .el-select .el-input .el-select__caret {
            font-size: 14px;
        }
        .el-form-item__content {
            line-height: 30px;
        }
        .el-select-dropdown {
            background-color: #17202e;
        }
        .el-select-dropdown__item.hover,
        .el-select-dropdown__item:hover {
            background-color: #17202e;
        }
        .transfer-submit {
            margin-top: 30px;
        }
        .el-dialog {
            width: 70%;
            .el-dialog__header {
                padding: 0px;
            }
            .el-dialog__body {
                padding: 0px;
            }
        }
        input[type="text"], input[type="password"], select {
            border: 1px solid #24426c;
        }
    }
</style>