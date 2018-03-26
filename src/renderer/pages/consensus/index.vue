<template>
    <div class="consensus-index">
        <div class="account-address">
            <label v-show="accountAddressOk">{{$t("message.indexAccountAddress")}}</label>
            <el-select v-model="accountAddressValue" placeholder="请选择账户地址" @change="accountAddressChecked">
                <el-option v-for="item in accountAddress" :key="item.address"
                           :label="item.address + item.alias == null ? '('+item.alias+')' : '' "
                           :value="item.address">
                </el-option>
            </el-select>
        </div>
        <div class="consensus-index-title">
            <label>总抵押金额（全网）：</label>{{this.allTotalDeposit*0.00000001}} NULS,<label>总共识数：</label>{{this.allAgentCount}}
            <!--<label>年化收益：</label>0.25%-->
        </div>
        <div class="consensus-center">
            <ul>
                <li class="li-bg">
                    <label>我的总体情况：</label>
                </li>
                <li class="li-bg">
                    <label>累计收益：</label>{{this.reward*0.00000001}} NULS
                </li>
                <li>
                    <label>创建节点：</label>{{this.agentCount}} 个 <span v-show="this.agentCount > 0 ? false:true ">(<span
                        title="点击创建节点" @click="toNewNode" class="span">创建</span>)</span>
                </li>
                <li>
                    <label>委托节点：</label>{{this.delegateAgentCount}} 个 (<span title="点击委托节点"
                                                                             @click="toAgencyNode"
                                                                             class="span">委托</span>)
                </li>
                <li>
                    <label>抵押总数：</label><span title="点击查看抵押详情" @click="toPledgeInfo" class="span">{{this.totalDeposit*0.00000001}} NULS</span>
                </li>
                <li>
                    <label>可用余额：</label>{{this.usableBalance*.00000001}} NULS
                </li>
            </ul>
        </div>
        <div class="consensus-bottom">
            <template>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="全部共识" name="first">
                        <div class="div-icon cursor-p fl" v-for="(item,index) in allConsensus"
                             @click="toNodePage(item.agentAddress)">
                            <p class="subscript">
                                {{item.status = 2 ? "正在共识" : "等待共识"}}
                            </p>
                            <h3>{{item.agentName}}</h3>
                            <ul>
                                <li class="overflow"><label>节点来源：</label>{{ item.agentAddress }}</li>
                                <li><label>佣金比例：</label>{{ item.commissionRate }}%</li>
                                <li><label>保证金：</label>{{ item.owndeposit*0.00000001 }} NULS</li>
                                <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                                    <label class="fl cursor-p">信用值:</label>
                                    <ProgressBar colorData="#6e84f7" :widthData="item.creditRatio"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">参与人数：</label>
                                    <ProgressBar colorData="'#f64b3e'" :widthData="item.memberCount"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">抵押金额：</label>
                                    <ProgressBar colorData="#82BD39" :widthData="item.totalDeposit.value"></ProgressBar>
                                </li>
                            </ul>
                            <div class="credit-valuesDiv" :id=index>
                                <h2>
                                    <label class="fl">能力系数&nbsp;</label>
                                    <ProgressBar colorData="#82BD39" widthData="50%"></ProgressBar>
                                </h2>
                                <p class="cb">根据近100轮出块数量计算</p>
                                <h4>
                                    <label class="fl">责任系数&nbsp;</label>
                                    <ProgressBar colorData="#82BD39" widthData="80%"></ProgressBar>
                                </h4>
                                <p class="cb">根据近100轮违规情况和出块正确性计算</p>
                            </div>
                        </div>
                        <el-pagination layout="prev, pager, next" :page-size="3" :total=this.totalAll class="cb"
                                       @current-change="allConsensusSize"></el-pagination>
                    </el-tab-pane>
                    <el-tab-pane label="我的共识" name="second">
                        <div class="div-icon cursor-p fl" v-for="(item,index) in myConsensus"
                             @click="toMyNode(item.agentAddress,index)">
                            <p class="subscript" :class="{stay:item.status == 2 ? false : true }">
                                {{item.status == 2 ? "正在共识" : "等待共识"}}
                            </p>
                            <h3>{{item.agentName}}</h3>
                            <ul>
                                <li><label>节点来源：</label>{{ item.rewardValue }}</li>
                                <li><label>佣金比例：</label>{{ item.commissionRate }}%</li>
                                <li><label>保证金：</label>{{ item.owndeposit*0.00000001 }} NULS</li>
                                <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                                    <label class="fl cursor-p">信用值:</label>
                                    <ProgressBar colorData="#6e84f7" widthData="50%"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">参与人数：</label>
                                    <ProgressBar colorData="'#f64b3e'" widthData="80%"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">抵押金额：</label>
                                    <ProgressBar colorData="#82BD39" widthData="90%"></ProgressBar>
                                </li>
                            </ul>
                            <div class="credit-valuesDiv" :id=index>
                                <h2>
                                    <label class="fl">能力系数&nbsp;</label>
                                    <ProgressBar colorData="#82BD39" widthData="50%"></ProgressBar>
                                </h2>
                                <p class="cb">根据近100轮出块数量计算</p>
                                <h4>
                                    <label class="fl">责任系数&nbsp;</label>
                                    <ProgressBar colorData="#82BD39" widthData="80%"></ProgressBar>
                                </h4>
                                <p class="cb">根据近100轮违规情况和出块正确性计算</p>
                            </div>
                        </div>
                        <el-pagination layout="prev, pager, next" :page-size="3" :total=this.myTotalAll class="cb"
                                       @current-change="myConsensusSize" v-show="myConsensusSizeOK"></el-pagination>
                        <div class="noData" v-show="noDataOK" @click="toNodeList">
                            <i class="el-icon-plus"></i>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </div>
    </div>
</template>

<script>
    import ProgressBar from '@/components/ProgressBar.vue'

    export default {
        data() {
            return {
                accountAddressOk: true,
                accountAddress: [],
                accountAddressValue: localStorage.getItem('newAccountAddress'),
                activeName: this.$route.params.activeName,
                creditValuesShow0: false,
                creditValuesShow1: false,
                creditValuesShow2: false,
                noDataOK: false,
                myConsensusSizeOK: true,

                allAgentCount: 0,
                allTotalDeposit: 0,

                agentCount: 0,
                totalDeposit: 0,
                reward: 0,
                usableBalance: 0,
                delegateAgentCount: 0,

                creditColor: '#6e84f7',
                totalColor: '#f64b3e',
                memberColor: '#82BD39',

                allConsensus: [],
                totalAll: 0,

                myConsensus:[],
                myTotalAll: 0,

            }
        },
        components: {
            ProgressBar,
        },
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
            this.getConsensus("/consensus");
            this.getConsensusAddress("/consensus/address/" + localStorage.getItem('newAccountAddress'));

            this.getAllConsensus("/consensus/agent/list/", {"pageSize": "4"});
            this.getMyConsensus("/consensus/agent/address/"+localStorage.getItem('newAccountAddress'),{"pageSize": "4"});
        },
        methods: {
            //获取账户地址列表
            getaccountAddress(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.accountAddress = response.data;
                    });
            },
            //选择账户地址
            accountAddressChecked(value) {
                localStorage.setItem('newAccountAddress',value);
                this.getConsensusAddress("/consensus/address/" + value);
                this.getMyConsensus("/consensus/agent/address/"+value,{"pageSize": "4"});
            },
            //获取共识信息
            getConsensus(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.allAgentCount = response.data.agentCount;
                            this.allTotalDeposit = response.data.totalDeposit;
                        }
                    });
            },
            //获取钱包内账户参与共识基本信息
            getConsensusAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        //console.log(response);
                        if (response.success) {
                            this.agentCount = response.data.agentCount;
                            this.totalDeposit = response.data.totalDeposit;
                            this.reward = response.data.reward;
                            this.usableBalance = response.data.usableBalance;
                            this.delegateAgentCount = response.data.joinAccountCount;
                        }
                    });
            },
            //获取我的共识列表
            getMyConsensus(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
                        console.log(url);
                        this.myTotalAll = 1;
                        if (response.success) {
                            if (response.data.list.length != 0) {
                                this.noDataOK = false;
                                this.myConsensusSizeOK = true;
                            } else {
                                this.noDataOK = true;
                                this.myConsensusSizeOK = false;
                            }
                            for (var i = 0; i < response.data.list.length; i++) {
                                //response.data.list[i].agentAddress = response.data.list[i].agentAddress.substr(0, 4) + "..." + response.data.list[i].agentAddress.substr(-4);
                                if (response.data.list[i].creditRatio != 0) {
                                    if (response.data.list[i].creditRatio > 0) {
                                        response.data.list[i].creditRatio = ((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                    } else {
                                        response.data.list[i].creditRatio = response.data.list[i].creditRatio * 100;
                                    }
                                } else {
                                    response.data.list[i].creditRatio = "50%";
                                }
                                response.data.list[i].memberCount = (response.data.list[i].memberCount/1000).toFixed() + '%';
                                response.data.list[i].totalDeposit = response.data.list[i].totalDeposit / 50000000000000 + '%';
                            }
                            this.myTotalAll = response.data.total;
                            this.myConsensus = response.data.list;
                            //console.log("===" + this.myConsensus)
                        }
                    });
            },
            //我的共识列表分页
            myConsensusSize(events) {
                this.getMyConsensus("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'), {
                    "pageNumber": events,
                    "pageSize": "4"
                });
            },
            //获取全部共识列表
            getAllConsensus(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
                        console.log(url)
                       if (response.success) {
                           //console.log(response)
                            for (var i = 0; i < response.data.list.length; i++) {
                                //response.data.list[i].agentAddress = response.data.list[i].agentAddress.substr(0, 4) + "..." + response.data.list[i].agentAddress.substr(-4);
                                if (response.data.list[i].creditRatio != 0) {
                                    if (response.data.list[i].creditRatio > 0) {
                                        response.data.list[i].creditRatio = ((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                    } else {
                                        response.data.list[i].creditRatio = response.data.list[i].creditRatio * 100;
                                    }
                                } else {
                                    response.data.list[i].creditRatio = "50%";
                                }
                                response.data.list[i].memberCount = (response.data.list[i].memberCount/1000).toFixed() + '%';
                                response.data.list[i].totalDeposit = response.data.list[i].totalDeposit / 50000000000000 + '%';
                            }
                            this.totalAll = response.data.total;
                            this.allConsensus = response.data.list;
                        }
                    });
            },
            //全部共识分页
            allConsensusSize(events) {
                this.getAllConsensus("/consensus/agent/list/", {"pageNumber": events, "pageSize": "4"});
            },
            //创建节点跳转
            toNewNode() {
                this.$router.push({
                    path: '/consensus/newNode'
                });
            },
            //查看抵押详情跳转
            toPledgeInfo() {
                this.$router.push({
                    path: '/consensus/pledgeInfo'
                });
            },
            //点击全部共识跳转加入节点页面
            toNodePage(index) {
                this.$router.push({
                    name: '/nodePage',
                    params: {address: index},
                });
                /*this.$router.push({
                    name: '/nodePage',
                    params: {address: index},
                });*/
            },
            //委托节点跳转
            toAgencyNode(){
                this.$router.push({
                    name: '/agencyNode',
                });
             },
            //我的节点跳转
            toMyNode(addres,index) {
                if(index !=0){
                    this.$router.push({
                        name: '/myNode'
                    });
                }else {
                    this.$router.push({
                        name: '/nodeInfo'
                    });
                }
            },
            //显示隐藏信用系数规则
            toggleShow(index) {
                //console.log(index);
                /*this.creditValuesShow0 = !this.creditValuesShow0;*/
            },
            //切换tab
            handleClick(tab, event) {
                if(tab.name !== 'first'){
                    this.getMyConsensus("/consensus/deposit/address/"+localStorage.getItem('newAccountAddress'),{"pageSize": "4"});
                }
                //this.getAllConsensus("/consensus/agent/list/", {"pageSize": "4"});
                //方法没有，待定

            },
            //跳转加入共识列表
            toNodeList(){
                this.$router.push({
                    name: '/agencyNode'
                });
            },
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style");
    .consensus-index {
        .account-address {
            height: 50px;
            margin:20px auto 0px;
            width: 68%;
            label {
                font-size: 14px;
                margin-right: 15px;
            }
            .el-input--suffix .el-input__inner {
                width: 410px;
            }
            .el-input__suffix {
                margin-top: 1%;
            }
            .el-select .el-input .el-select__caret {
                font-size: 14px;
            }
        }
        .consensus-index-title {
            width: 640px;
            margin: auto;
            font-size: 12px;
            line-height: 32px;
            color: #658ec7;
            label {
            }
        }
        .consensus-center {
            width: 640px;
            height: 80px;
            margin: auto;
            border: 1px solid #658ec7;
            text-align: center;
            font-family: "微软雅黑";
            ul {
                width: 100%;
                li {
                    width: 35%;
                    height: 25px;
                    line-height: 25px;
                    padding-left: 15%;
                    text-align: left;
                    float: left;
                    font-size: 12px;
                    color: #C1C5C9;
                    label {
                    }
                    .span {
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    span.span {
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }
                li.li-bg {
                    background-color: #222d3f;
                }
            }

        }
        .consensus-bottom {
            width: 80%;
            margin: 5px auto 0px;
            h3 {
                text-align: center;
                font-size: 14px;
                line-height: 35px;
            }
            ul {
                li {
                    label {
                    }
                    .bar-bg {
                        margin-top: 10px;
                    }
                }
            }
            .noData {
                width: 130px;
                height: 100px;
                text-align: center;
                border: 1px solid #658ec7;
                line-height: 90px;
                font-size: 50px;
                color: #c1c1c1;
                margin: 50px auto;
                background-color: #17202e;
            }
            .noData:hover {
                border: 1px solid #3a8ee6;
                cursor: pointer;
            }
        }
    }
</style>