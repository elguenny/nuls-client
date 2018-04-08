<template>
    <div class="new-node">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{$t("message.c21")}}</h2>
        <div class="new-node-form">
            <el-form ref="newNodeForm" :model="newNodeForm" :rules="newNodeRules" size="mini" label-position="top">
                <el-form-item :label="$t('message.c22')+':'">
                    <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
                </el-form-item>
                <el-form-item :label="$t('message.c23')+':'" prop="packingAddress">
                    <el-input v-model.trim="newNodeForm.packingAddress"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.c24')+':'" prop="agentName">
                    <el-input v-model.trim="newNodeForm.agentName" :maxlength="25"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.c25')+'（NULS）:'" class="form-left" prop="deposit">
                    <el-input v-model.number="newNodeForm.deposit" :placeholder=this.placeholder :maxlength="17"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.c26')+'（%）:'" class="form-left" prop="commissionRate">
                    <el-input v-model.number="newNodeForm.commissionRate" :maxlength="17"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.c27')+':'" class="cb" prop="remark">
                    <el-input v-model.trim="newNodeForm.remark" type="textarea" :rows="2" :maxlength="80"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.miningFee')">

                </el-form-item>
                <el-form-item size="large" class="submit">
                    <el-button type="primary" @click="submitForm('newNodeForm')">{{$t("message.confirmButtonText")}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <Password ref="password" @toSubmit="toSubmit"></Password>
    </div>
</template>

<script>
    import Back from './../../components/BackBar.vue'
    import AccountAddressBar from '@/components/AccountAddressBar.vue';
    import Password from '@/components/PasswordBar.vue';
    export default {
        data() {
            var checkNodeNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('message.c31')));
                }
                var re = /^\d+(?=\.{0,1}\d+$|$)/;
                if (!re.exec(value)) {
                    callback(new Error(this.$t('message.c32')));
                }
                if (value > this.usable - 0.01) {
                    callback(new Error(this.$t('message.c33')));
                } else if (value < 20000) {
                    callback(new Error(this.$t('message.c34')));
                } else {
                    callback();
                }
            };
            var checkCommissionRate = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('message.c35')));
                }
                var re = /^\d+(?=\.{0,1}\d+$|$)/;
                if (!re.exec(value)) {
                    callback(new Error(this.$t('message.c36')));
                } else if (0 > value || value > 20) {
                    callback(new Error(this.$t('message.c37')));
                } else {
                    callback();
                }
            };
            return {
                accountAddress: [],
                usable: "0",
                placeholder: "",
                newNodeForm: {
                    accountAddressValue: localStorage.getItem('newAccountAddress'),
                    packingAddress: '',
                    agentName: '',
                    deposit: '',
                    commissionRate: '',
                    remark: '',
                },
                newNodeRules: {
                    packingAddress: [
                        {required: true, message:this.$t('message.c38'), trigger: 'blur'}
                    ],
                    agentName: [
                        {required: true, message: this.$t('message.c39')},
                        {max: 50, message: this.$t('message.c41'), trigger: 'blur'}
                    ],
                    deposit: [
                        {validator: checkNodeNo, trigger: 'blur'},
                    ],
                    commissionRate: [
                        {validator: checkCommissionRate, trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: this.$t('message.c40'), trigger: 'blur'}
                    ],
                },
            }
        },
        components: {
            Back,
            AccountAddressBar,
            Password,
        },
        mounted() {
            let _this = this;
            this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'));
        },
        methods: {
            //获取下拉选择地址
            chenckAccountAddress(chenckAddress) {
                //this.accountAddressValue = chenckAddress;
                this.getBalanceAddress('/account/balance/' + chenckAddress);
                setTimeout(() => {
                    if (this.newNodeForm.deposit !== '') {
                        this.$refs.newNodeForm.validateField('deposit');
                    }
                }, 500);
            },
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.usable = response.data.usable * 0.00000001;
                            this.placeholder = this.$t('message.currentBalance') +" "+ response.data.usable * 0.00000001;
                        }
                    });
            },

            //提交创建
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs.password.showPassword(true);
                    }
                    else {
                        return false;
                    }
                });
            },
            //
            toSubmit(password) {
                var param = '{"agentAddress":"' + this.newNodeForm.accountAddressValue + '","packingAddress":"' + this.newNodeForm.packingAddress + '","commissionRate":"' + this.newNodeForm.commissionRate + '","deposit":"' + this.newNodeForm.deposit * 100000000 + '","agentName":"' + this.newNodeForm.agentName + '","remark":"' + this.newNodeForm.remark + '","password":"' + password + '"}';
                this.$post('/consensus/agent ', param)
                    .then((response) => {
                        console.log(response);
                        if (response.success) {
                            this.$message({
                                type: 'success', message: this.$t('message.passWordSuccess')
                            });
                            this.$router.push({
                                name: '/consensus',
                                params:{"activeName":"first"},
                            })
                        } else {
                            this.$message({
                                type: 'warning', message: this.$t('message.passWordFailed') + response.msg
                            });
                        }
                    })
            },

        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");
    .new-node {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 5px;
        }
        .new-node-form {
            width: 60%;
            margin: auto;
            .account-address {
                margin: 0px;
                height: auto;
                width: auto;
            }
            .form-left {
                width: 50%;
                float: left;
                .el-input__inner {
                    width: 170px;
                }
            }
            .el-input__inner {
                width: 410px;
            }
            .el-input--suffix{
                .el-input__inner {
                    width: 410px;
                }
            }
            .el-textarea__inner {
                width: 410px;
            }
            .el-input--suffix {
                width: 100%;
            }
            .el-input__suffix {
                margin-top: 0px;
            }
            .el-select .el-input .el-select__caret {
                font-size: 14px;
            }
            .el-form-item--mini .el-form-item__content,
            .el-form-item--mini .el-form-item__label {
                line-height: 6px;
                color: white;
            }
            .el-form-item.is-required .el-form-item__label:before{
                font-size: 0px;
            }
            .el-form-item--mini {
                margin-bottom: 10px;
            }

        }
    }
</style>