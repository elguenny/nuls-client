<template>
    <div class="node-page">
        <Back :backTitle="backTitle"></Back>
        <h2>{{this.nodeData.agentName}}</h2>
        <div class="div-icon1 node-page-top">
            <p class="subscript">
                {{this.nodeData.status}}
            </p>
            <ul>
                <li class="li-bg overflow">
                    <label>节点来源：</label>{{this.nodeData.agentAddress}}
                </li>
                <li>
                    <label>佣金比例：</label>{{this.nodeData.commissionRate}}%
                </li>
                <li>
                    <!--<label>保证金：</label>{{this.nodeData.owndeposit.value * 0.00000001}} NULS-->
                    <label>保证金：</label>{{20000}} NULS
                </li>
                <li>
                    <label>参与人数：</label>
                    <ProgressBar colorData="#6a84f7" :widthData="this.nodeData.memberCount"></ProgressBar>
                </li>
                <li>
                    <label>信用值：</label>
                    <ProgressBar colorData="#82bd39" :widthData="this.nodeData.creditRatio"></ProgressBar>
                </li>
                <li>
                    <label>剩余可抵押：</label>
                   <!-- <ProgressBar colorData="#58a5c9" :widthData="this.nodeData.totalDeposit.value"></ProgressBar>-->
                    <ProgressBar colorData="#58a5c9" widthData="5%"></ProgressBar>
                </li>
                <li class="li-info overflow">
                    <label>节点介绍：</label>{{this.nodeData.introduction}}
                </li>
            </ul>
        </div>
        <div class="node-page-bottom">
            <el-form ref="nodeForm" :model="nodeForm" :rules="nodeRules" size="mini" label-position="left">
                <el-form-item label="账户地址:" class="account-address">
                    <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
                </el-form-item>
                <span class="allUsable">当前余额:{{ usable }} NULS</span>
                <el-form-item label="委托保证:" class="number" prop="nodeNo">
                    <el-input v-model="nodeForm.nodeNo"></el-input>
                    <span class="allNo" @click="allUsable(usable)">全部</span>
                </el-form-item>
                <div class="procedure">手续费:<span>0.01 NULS</span></div>
                <el-form-item size="large" class="submit">
                    <el-button type="primary" @click="onSubmit('nodeForm')">确定</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import ProgressBar from '@/components/ProgressBar.vue';
    import AccountAddressBar from '@/components/AccountAddressBar.vue';

    export default {
        data() {
            var checkNodeNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入委托保证金额！'));
                }
                setTimeout(() => {
                    var re = /^\d+(?=\.{0,1}\d+$|$)/;
                    if (!re.exec(value)) {
                        callback(new Error('请输入正确的委托保证金额为数字值！'));
                    } else if (value > this.usable - 0.01) {
                        callback(new Error('委托保证金额不能大于可用余额！'));
                    } else {
                        callback();
                    }
                }, 100);
            };
            return {
                backTitle: "委托共识",
                address: this.$route.params.address,
                agentId:'',
                nodeData: [],
                usable: '',
                nodeForm: {
                    nodeNo: ''
                },
                nodeRules: {
                    nodeNo: [
                        {validator: checkNodeNo, trigger: 'blur'}
                    ],
                }
            }
        },
        components: {
            Back,
            ProgressBar,
            AccountAddressBar,
        },
        mounted() {
            let _this = this;
            this.getConsensusAddress("/consensus/agent/"+this.address);
            this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'));
        },
        methods: {
            //根据address获取共识节点列表信息
            getConsensusAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        console.log(response)
                        if (response.success) {
                            if (response.data.creditRatio != 0) {
                                if (response.data.creditRatio > 0) {
                                    response.data.creditRatio = ((((response.data.creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                } else {
                                    response.data.creditRatio = response.data.creditRatio * 100;
                                }
                            } else {
                                response.data.creditRatio = "50%";
                            }
                            response.data.memberCount = (response.data.memberCount / 1000).toFixed() + '%';
                            response.data.totalDeposit = (response.data.totalDeposit / 50000000000000).toFixed() + '%';
                            this.agentId = response.data.agentId;
                            this.nodeData = response.data;
                        }
                    });
            },
            //获取下拉选择地址
            chenckAccountAddress(chenckAddress) {
                this.getBalanceAddress('/account/balance/' + chenckAddress);
                this.$refs.nodeForm.validateField('nodeNo');
            },
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.usable = response.data.usable * 0.00000001;
                        }
                    });
            },
            //选择全部金额
            allUsable(no) {
                if(no == 0){
                    this.$message({
                        message: '对不起，您选择的账户余额不住！',
                        type: 'success'
                    });
                }else {
                    this.nodeForm.nodeNo = (parseInt(no) - 0.01).toString()
                }
            },
            //提交委托
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$prompt(this.$t('message.passWordTitle'), '', {
                            confirmButtonText: this.$t('message.confirmButtonText'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                            inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = '{"address":"' + localStorage.getItem('newAccountAddress') + '","agentId":"' + this.agentId + '","deposit":"' + this.nodeForm.nodeNo * 100000000 + '","password":"' + value + '"}';
                            this.$post('/consensus/deposit/', param)
                                .then((response) => {
                                    if (response.success) {
                                        this.$message({
                                            message: '恭喜您！申请参与共识成功！',
                                            type: 'success'
                                        });
                                         this.$router.push({
                                             name: '/allPledge'
                                         })
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
            }
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .node-page {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .div-icon {
            height: 118px;
            width: 80%;
            margin: auto;
            border: 1px solid #658ec7;
        }
        ul {
            width: 100%;
            height: 105px;
            margin: auto;
            font-size: 12px;
            background-color: #17202e;
            padding-top: 15px;
            li {
                color: #c1c5c9;
                line-height: 22px;
                width: 45%;
                float: left;
                label {
                    display: block;
                    width: 75px;
                    float: left;
                    padding-left: 25px;
                }
                span {
                }
            }
            .li-info {
                width: 100%;
                text-align: left;
            }
        }
        .node-page-bottom {
            width: 80%;
            height: 190px;
            margin: 20px auto 0px;
            border: 1px solid #658ec7;
            background-color: #17202e;
            .account-address {
                margin-bottom: 8px;
                .el-form-item__label {
                    margin-top: 20px;
                    margin-right: 0px;
                }
            }
            .number {
                .el-form-item__label {
                    margin-top: 15px;
                }
            }
            .el-input__inner {
                width: 415px;
            }
            .el-form-item {
                width: 90%;
                margin: 0px auto 10px;
                .el-form-item__label {
                    color: #C1C5C9;
                }

            }
            .el-input {
                float: left;
                width: 415px;
            }
            .el-button--primary {
                margin-top: 15px;
            }
            .el-form-item__error {
                margin-left: 70px;
            }
        }
        .el-form {
            .allUsable {
                margin-right: 128px;
                position: relative;
            }
        }
        .allNo {
            display: block;
            position: fixed;
            top: 69%;
            right: 25.5%;
        }
    }
</style>