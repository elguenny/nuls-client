<template>
    <div class="transfer">
        <Back :backTitle="backTitle"></Back>
        <div class="transfer-info">
            <h2>转账</h2>
            <el-form ref="form" :model="transferForm" :rules="rulesTransferForm" label-width="100px" label-position="top">
                <div class="out-name">
                    转账资产：NULS(可用余额:{{ usable }} )
                </div>
                <el-form-item label="账户地址:" class="out-address">
                    <el-select v-model="address" placeholder="请选择账户地址" @change="accountAddressChecked">
                        <el-option v-for="item in accountAddress" :key="item.address"
                                   :label="item.address + '('+item.alias+')'" :value="item.address">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转账地址:" class="join-address">
                    <el-input type="text" v-model="transferForm.joinAddress"></el-input>
                    <i @click="toUsersAddressList"></i>
                </el-form-item>
                <el-form-item label="转账金额:">
                    <el-input type="text" v-model="transferForm.joinNo"></el-input>
                </el-form-item>
                <el-form-item label="手续费:0.01NULS" class="service-no">
                </el-form-item>
                <el-form-item label="备注:" class="remark">
                    <el-input type="textarea" v-model="transferForm.remark"></el-input>
                </el-form-item>
                <el-form-item class="transfer-submit">
                    <el-button type="primary" @click="transferSubmit">确认转账</el-button>
                </el-form-item>
            </el-form>

            <el-dialog :visible.sync="dialogTableVisible">
                <el-table :data="userAddressList">
                    <el-table-column property="userAddress" label="账户" min-width="60" align='center'></el-table-column>
                    <el-table-column property="userAlias" label="别名" min-width="20" align='center'></el-table-column>
                    <el-table-column property="userHelp" label="备注" min-width="20" align='center'></el-table-column>
                    <el-table-column label="操作" min-width="20" align='center'>
                        <template slot-scope="scope">
                            <span class="cursor-p text-d" @click="checkedAddress(scope.row.userAddress)">选中</span>
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
            var joinNo = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请输入交易金额！"));
                } else if (value < this.usable) {
                    callback(new Error("交易金额不能大于可用余额"));
                } else {
                    callback();
                }
            };
            return {
                backTitle: '钱包管理',
                address: this.$route.params.address,
                usable:'0',
                accountAddress: [],
                transferForm: {
                    outName: '',
                    outAddress: '',
                    joinAddress: '',
                    joinNo: '',
                    serviceNo: '',
                    remark: ''
                },
                rulesTransferForm:{
                    joinNo: [{
                        validator: joinNo,
                        trigger: 'blur'
                    }]
                },

                userAddressList: [
                    {"userAddress":"2CfnhnNxNorPiug5knrn1txaRpReCGn","userAlias":"linxin","userHelp":"456"},
                    {"userAddress":"2CidJFvJhyruCS9RQLSVMVcYgm845Fh","userAlias":"789","userHelp":"456"},
                    {"userAddress":"2CkFHVWKVogUQRScVzgsu8oEA5Txz8W","userAlias":"96358964","userHelp":"85568"}
                ],
                dialogTableVisible: false,
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
            this.getBalanceAddress('/account/balance/'+this.address)
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
            getBalanceAddress(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.usable = response.data.usable*0.0000000001;
                    });
            },
            //选择账户地址
            accountAddressChecked(value) {
                this.address = value;
                this.getBalanceAddress('/account/balance/'+this.address)
            },
            //确认转账
            transferSubmit() {
                console.log('submit!');
            },
            //选择通讯录
            toUsersAddressList() {
                this.dialogTableVisible=true;
            },
            //选中通讯录地址
            checkedAddress(address){
                this.transferForm.joinAddress =address;
                this.dialogTableVisible=false;
            }
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
            .out-name{
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
    }
</style>