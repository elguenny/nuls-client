<template>
    <div class="new-node">
        <Back :backTitle="backTitle"></Back>
        <h2>自建节点共识</h2>
        <div class="new-node-form">
            <el-form ref="newNodeForm" :model="newNodeForm" :rules="newNodeRules" size="mini" label-position="top">
                <el-form-item label="共识账户：">
                    <el-select v-model="newNodeForm.accountAddressValue" placeholder="请选择账户地址"
                               @change="accountAddressChecked">
                        <el-option v-for="item in accountAddress" :key="item.address"
                                   :label="item.address + item.alias == null ? '('+item.alias+')' : '' "
                                   :value="item.address">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出块地址：" prop="packingAddress">
                    <el-input v-model="newNodeForm.packingAddress"></el-input>
                </el-form-item>
                <el-form-item label="节点名称：" prop="agentName">
                    <el-input v-model="newNodeForm.agentName"></el-input>
                </el-form-item>
                <el-form-item label="保证金：" class="form-left" prop="deposit">
                    <el-input v-model.number="newNodeForm.deposit" :placeholder=this.placeholder></el-input>
                </el-form-item>
                <el-form-item label="代理佣金比例：" class="form-left" prop="commissionRate">
                    <el-input v-model.number="newNodeForm.commissionRate"></el-input>
                </el-form-item>
                <el-form-item label="节点介绍：" class="cb" prop="remark">
                    <el-input v-model="newNodeForm.remark" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="手续费：0.01NULS">

                </el-form-item>
                <el-form-item size="large" class="submit">
                    <el-button type="primary" @click="submitForm('newNodeForm')">立即创建</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import Back from './../../components/BackBar.vue'

    export default {
        data() {
            var checkNodeNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入保证金额！'));
                }
                var re = /^\d+(?=\.{0,1}\d+$|$)/;
                if (!re.exec(value)) {
                    callback(new Error('请输入正确的保证金额为数字值！'));
                }
                if (value > this.usable - 0.01) {
                    callback(new Error('保证金额不能大于可用余额！'));
                } else if (value < 20000) {
                    callback(new Error('保证金额必须大于20000!'));
                } else {
                    callback();
                }
            };
            var checkCommissionRate = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入节点佣金比例！'));
                }
                var re = /^\d+(?=\.{0,1}\d+$|$)/;
                if (!re.exec(value)) {
                    callback(new Error('请输入正确的节点佣金比例数字值！'));
                } else if (0 > value || value > 20) {
                    callback(new Error('节点佣金比例为：0-20'));
                } else {
                    callback();
                }
            };
            return {
                backTitle: this.$t('message.accountManagement'),
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
                        {required: true, message: '出块地址', trigger: 'blur'}
                    ],
                    agentName: [
                        {required: true, message: '请输入节点名称'},
                        {max: 50, message: '请输入节点名称', trigger: 'blur'}
                    ],
                    deposit: [
                        {validator: checkNodeNo, trigger: 'blur'},
                    ],
                    commissionRate: [
                        {validator: checkCommissionRate, trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入节点备注', trigger: 'blur'}
                    ],
                },
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
            this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'));
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
                        if (response.success) {
                            this.usable = response.data.usable * 0.00000001;
                            this.placeholder = "当前余额:" + response.data.usable * 0.00000001;
                        }
                    });
            },
            //选择账户地址
            accountAddressChecked(value) {
                this.getBalanceAddress('/account/balance/' + value);
                setTimeout(() => {
                    if (this.newNodeForm.deposit !== '') {
                        this.$refs.newNodeForm.validateField('deposit');
                    }
                }, 500);
            },
            //提交创建
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$prompt(this.$t('message.passWordTitle'), '', {
                            confirmButtonText: this.$t('message.confirmButtonText'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                            inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = '{"agentAddress":"' + this.newNodeForm.accountAddressValue + '","packingAddress":"' + this.newNodeForm.packingAddress + '","commissionRate":"' + this.newNodeForm.commissionRate + '","deposit":"' + this.newNodeForm.deposit * 100000000 + '","agentName":"' + this.newNodeForm.agentName + '","remark":"' + this.newNodeForm.remark + '","password":"' + value + '"}';
                            this.$post('/consensus/agent ', param)
                                .then((response) => {
                                    console.log( response);
                                    if (response.success) {
                                        this.$message({
                                            type: 'success', message: "恭喜您，创建成功！"
                                        });
                                        this.$router.push({
                                            name: '/consensus',
                                        })
                                    } else {
                                        this.$message({
                                            type: 'warning', message: "对不起，创建失败" + response.msg
                                        });
                                    }
                                })
                        })
                    }
                    else {
                        return false;
                    }
                });
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
            }
            .el-form-item--mini {
                margin-bottom: 10px;
            }

        }
    }
</style>