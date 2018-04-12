<template>
    <div class="node-page">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{this.nodeData.agentName}}</h2>
        <div class="div-icon1 node-page-top">
            <p class="subscript" :class="this.nodeData.statuss === 1  ? 'stay' : ''">
                {{this.nodeData.status}}
            </p>
            <ul>
                <li class="li-bg overflow">
                    <label>{{$t('message.c16')}}：</label>{{this.nodeData.agentAddress}}
                </li>
                <li>
                    <label>{{$t('message.c17')}}：</label>{{this.nodeData.commissionRate}}%
                </li>
                <li>
                    <label>{{$t('message.c25')}}：</label>{{(this.nodeData.owndeposit*0.00000001).toFixed(8)}} NULS
                </li>
                <li>
                    <label>{{$t('message.c19')}}：</label>
                    <ProgressBar colorData="#6a84f7" :widthData="this.nodeData.memberCount"></ProgressBar>
                    <span>{{this.nodeData.memberCounts}}</span>
                </li>
                <li>
                    <label>{{$t('message.c18')}}：</label>
                    <ProgressBar colorData="#82bd39" :widthData="this.nodeData.creditRatio"></ProgressBar>
                    <span>{{this.nodeData.creditRatios}}</span>
                </li>
                <li>
                    <label>{{$t('message.c64')}}：</label>
                    <ProgressBar colorData="#58a5c9" :widthData="this.nodeData.totalDeposit"></ProgressBar>
                    <span>&nbsp;{{this.nodeData.totalDeposits}}</span>
                </li>
                <li class="li-info overflow">
                    <label>{{$t('message.c27')}}：</label>{{this.nodeData.introduction}}
                </li>
            </ul>
        </div>
        <div class="node-page-bottom">
            <el-form ref="nodeForm" :model="nodeForm" :rules="nodeRules" size="mini" label-position="left">
                <el-form-item :label="$t('message.newAccountAddress')" class="account-address">
                    <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
                </el-form-item>
                <span class="allUsable">{{$t('message.currentBalance')}}: {{ usable }} NULS</span>
                <el-form-item :label="$t('message.c25')" class="number" prop="nodeNo">
                    <el-input v-model="nodeForm.nodeNo"></el-input>
                    <span class="allNo" @click="allUsable(usable)">{{$t('message.all')}}</span>
                </el-form-item>
                <div class="procedure"><label>{{$t('message.c28')}}</label><span>0.01 NULS</span></div>
                <el-form-item size="large" class="submit">
                    <el-button type="primary" @click="onSubmit('nodeForm')" id="nodePage">{{$t('message.confirmButtonText')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import ProgressBar from '@/components/ProgressBar.vue';
    import AccountAddressBar from '@/components/AccountAddressBar.vue';
    import Password from '@/components/PasswordBar.vue';
    export default {
        data() {
            var checkNodeNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('message.c52')));
                }
                setTimeout(() => {
                    var re = /^\d+(?=\.{0,1}\d+$|$)/;
                    if (!re.exec(value)) {
                        callback(new Error(this.$t('message.c53')));
                    } else if (value > this.usable - 0.01 || value < 2000 ) {
                        callback(new Error(this.$t('message.c54')));
                    } else {
                        callback();
                    }
                }, 100);
            };
            return {
                submitId:"nodePage",
                address: this.$route.params.address,
                agentId:'',
                nodeData: [],
                usable: 0,
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
            Password,
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
                        if (response.success) {
                            console.log(response);
                            response.data.creditRatios = response.data.creditRatio;
                            if (response.data.creditRatio != 0) {
                                if (response.data.creditRatio > 0) {
                                    response.data.creditRatio = ((((response.data.creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                } else {
                                    response.data.creditRatio = Math.abs(response.data.creditRatio) * 100+ '%';
                                }
                            } else {
                                response.data.creditRatio = "50%";
                            }
                            response.data.statuss = response.data.status;
                            response.data.status = this.switchStatus(response.data.status);
                            response.data.memberCounts = response.data.memberCount +"/1000";
                            response.data.memberCount = (response.data.memberCount / 10).toFixed(2) + '%';
                            response.data.totalDeposits = response.data.totalDeposit*0.00000001 +"/500000";
                            response.data.totalDeposit = ((response.data.totalDeposit*0.00000001) / 5000).toFixed(2) + '%';
                            this.agentId = response.data.agentId;
                            this.nodeData = response.data;
                        }
                    });
            },
            //查询共识状态
            switchStatus(status) {
                switch (status) {
                    case 0:
                        return this.$t("message.c13");
                        break;
                    case 1:
                        return this.$t("message.c14");
                        break;
                    case 2:
                        return this.$t("message.c15");
                        break;
                }
            },
            //获取下拉选择地址
            chenckAccountAddress(chenckAddress) {
                //console.log(chenckAddress);
                this.getBalanceAddress('/account/balance/' + chenckAddress);
                this.$refs.nodeForm.validateField('nodeNo');
            },
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.usable = (response.data.usable * 0.00000001).toFixed(8);
                        }
                    });
            },
            //选择全部金额
            allUsable(no) {
                if(no == 0){
                    this.$message({
                        message: this.$t('message.creditLow'),
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
                        this.$refs.password.showPassword(true);
                    } else {
                        return false;
                    }
                });
            },
            //
            toSubmit(password) {
                var param = '{"address":"' + localStorage.getItem('newAccountAddress') + '","agentId":"' + this.agentId + '","deposit":"' + this.nodeForm.nodeNo * 100000000 + '","password":"' + password + '"}';
                this.$post('/consensus/deposit/', param)
                    .then((response) => {
                        console.log(param);
                        if (response.success) {
                            this.$message({
                                message: this.$t('message.passWordSuccess'),
                                type: 'success'
                            });
                            this.$router.push({
                                name: '/consensus',
                                params:{"activeName":"first"}
                            });
                            /*this.$router.push({
                                name: '/myNode',
                                params:{"agentAddress":this.nodeData.agentAddress}
                            })*/
                        } else {
                            this.$message({
                                message: this.$t('message.passWordFailed') + response.msg,
                                type: 'warning',
                            });
                        }
                    })
            },
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
                    text-align: right;
                    width: 67px;
                }
            }
            .number {
                .el-form-item__label {
                    margin-top: 15px;
                    width: 68px;
                    text-align: right;
                }
            }
            .el-input__inner {
                width: 415px;
                color: #FFFFFF;
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