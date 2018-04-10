<template>
    <div class="consensus-index">
        <div class="account-top">
            <label v-show="accountAddressOk">{{$t("message.indexAccountAddress")}}</label>
            <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
        </div>
        <div class="consensus-index-title">
            <label>{{$t("message.c1")}}{{$t("message.c1_1")}}：</label>{{this.allTotalDeposit*0.00000001}} NULS，<label>{{$t("message.c2")}}：</label>{{this.allAgentCount}}
        </div>
        <div class="consensus-center">
            <ul>
                <li class="li-bg">
                    <label>{{$t("message.c3")}}：</label>
                </li>
                <li class="li-bg">
                    <label>{{$t("message.c7")}}：</label>{{(this.myInfoData.reward*0.00000001).toFixed(8)}} NULS
                </li>
                <li>
                    <label>{{$t("message.c4")}}：</label>{{this.myInfoData.agentCount}} {{$t("message.c30")}}
                    <span v-show="this.myInfoData.agentCount > 0 ? false:true ">(<span
                            @click="toNewNode" class="span">{{$t("message.c5")}}</span>)</span>
                </li>
                <li>
                    <label>{{$t("message.c8")}}：</label>{{this.myInfoData.joinAccountCount}} {{$t("message.c30")}}
                    (<span
                        @click="toAgencyNode"
                        class="span">{{$t("message.c9")}}</span>)
                </li>
                <li>
                    <label>{{$t("message.c6")}}：</label>{{(this.myInfoData.usableBalance*.00000001).toFixed(8)}} NULS
                </li>
                <li>
                    <label>{{$t("message.c10")}}：</label>
                    <span @click="toPledgeInfo" class="span">
                    {{(this.myInfoData.totalDeposit*0.00000001).toFixed(8)}} NULS
                    </span>
                </li>

            </ul>
        </div>
        <div class="consensus-bottom">
            <template>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="$t('message.c11')" name="first">
                        <div class="div-icon cursor-p fl" v-for="(item,index) in allConsensus"
                             @click="toNodePage(item.agentAddress)">
                            <p class="subscript" :class="item.statuss === 1  ? 'stay' : ''">
                                {{item.status}}
                            </p>
                            <h3 class="overflow">{{item.agentName}}</h3>
                            <ul>
                                <li class="overflow"><label>{{$t("message.c16")}}：</label>{{ item.agentAddress }}</li>
                                <li><label>{{$t("message.c17")}}：</label>{{ item.commissionRate }}%</li>
                                <li><label>{{$t("message.c25")}}：</label>{{ item.owndeposit*0.00000001 }} NULS</li>
                                <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                                    <label class="fl cursor-p">{{$t("message.c18")}}:</label>
                                    <ProgressBar :colorData="item.creditRatio < 0 ? '#82bd39':'#f64b3e'"
                                                 :widthData="item.creditRatio"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">{{$t("message.c19")}}：</label>
                                    <ProgressBar colorData="#6a84f7" :widthData="item.memberCount"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">{{$t("message.c20")}}：</label>
                                    <ProgressBar colorData="#82BD39" :widthData="item.totalDeposit"></ProgressBar>
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
                                       v-show="totalAllOk = this.totalAll>3 ?true:false"
                                       @current-change="allConsensusSize"></el-pagination>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('message.c12')" name="second">
                        <div class="div-icon cursor-p fl" v-for="(item,index) in myConsensus"
                             @click="toMyNode(item.agentAddress,index)">
                            <p class="subscript" :class="item.statuss === 1  ? 'stay' : ''">
                                {{item.status}}
                            </p>
                            <h3>{{item.agentName}}</h3>
                            <ul>
                                <li class="overflow"><label>{{$t("message.c16")}}：</label>{{ item.agentAddress }}</li>
                                <li><label>{{$t("message.c17")}}：</label>{{ item.commissionRate }}%</li>
                                <li><label>{{$t("message.c25")}}：</label>{{ item.owndeposit*0.00000001 }} NULS</li>
                                <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                                    <label class="fl cursor-p">{{$t("message.c18")}}:</label>
                                    <ProgressBar colorData="#6e84f7" widthData="50%"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">{{$t("message.c19")}}：</label>
                                    <ProgressBar colorData="'#f64b3e'" widthData="80%"></ProgressBar>
                                </li>
                                <li class="cb">
                                    <label class="fl">{{$t("message.c20")}}：</label>
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
                                       v-show="totalAllOk = this.myTotalAll>3 ?true:false"
                                       @current-change="myConsensusSize"></el-pagination>
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
    import AccountAddressBar from '@/components/AccountAddressBar.vue';

    export default {
        data() {
            return {
                accountAddressOk: true,
                accountAddress: [],
                accountAddressValue: '',
                activeName: this.$route.params.activeName,
                tabName: 'first',

                creditValuesShow0: false,
                creditValuesShow1: false,
                creditValuesShow2: false,
                noDataOK: false,
                myConsensusSizeOK: true,

                allAgentCount: 0,
                allTotalDeposit: 0,

                myInfoData: {
                    reward: 0,
                    rewardOfDay: 0,
                    joinAccountCount: 0,
                    totalDeposit: 0,
                    agentCount: 0,
                    usableBalance:0,
                },

                creditColor: '#6e84f7',
                totalColor: '#f64b3e',
                memberColor: '#82BD39',

                allConsensus: [],
                totalAll: 0,

                myConsensus: [],
                myTotalAll: 0,

            }
        },
        components: {
            ProgressBar,
            AccountAddressBar,
        },
        computed:{
            getAddressList(){
                return this.$store.getters.getAddressList
            },
        },
        created(){
            this.getConsensus("/consensus");
            if (localStorage.getItem("newAccountAddress") != '') {
                this.accountAddressValue = localStorage.getItem("newAccountAddress");
                this.getConsensusAddress("/consensus/address/" + localStorage.getItem('newAccountAddress'));
                this.getMyConsensus("/consensus/agent/address/" + localStorage.getItem('newAccountAddress'), {"pageSize": "3"});
            }
            this.getAllConsensus("/consensus/agent/list", {"pageSize": "3"});
            //判断用户选择的语言
            let language = localStorage.getItem('language');
            setInterval(() => {
                if (language !== localStorage.getItem('language')) {
                    language = localStorage.getItem('language');
                    if (this.tabName === 'first') {
                        this.getAllConsensus("/consensus/agent/list", {"pageSize": "3"});
                    } else {
                        this.getMyConsensus("/consensus/agent/address/" + localStorage.getItem('newAccountAddress'), {"pageSize": "3"});
                    }
                } else {
                    language = localStorage.getItem('language');
                }
            }, 1000);
        },
        methods: {
            //获取下拉选择地址
            chenckAccountAddress(chenckAddress) {
                this.getConsensusAddress("/consensus/address/" + chenckAddress);
                if (this.tabName === "first") {
                    this.getAllConsensus("/consensus/agent/list", {"pageSize": "3"});
                } else {
                    this.getMyConsensus("/consensus/agent/address/" + chenckAddress, {"pageSize": "3"});
                }
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
                            this.myInfoData = response.data;
                        } else {
                            this.myInfoData.reward = 0;
                            this.myInfoData.rewardOfDay = 0;
                            this.myInfoData.joinAccountCount = 0;
                            this.myInfoData.totalDeposit = 0;
                            this.myInfoData.agentCount = 0;
                        }
                    });
            },
            //获取我的共识列表
            getMyConsensus(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
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
                                if (response.data.list[i].creditRatio != 0) {
                                    if (response.data.list[i].creditRatio > 0) {
                                        response.data.list[i].creditRatio = ((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                    } else {
                                        response.data.list[i].creditRatio = response.data.list[i].creditRatio * 100;
                                    }
                                } else {
                                    response.data.list[i].creditRatio = "50%";
                                }
                                //response.data.list[i].creditRatio="-0.2";
                                response.data.list[i].statuss = response.data.list[i].status;
                                response.data.list[i].status = this.switchStatus(response.data.list[i].status);
                                response.data.list[i].memberCount = (response.data.list[i].memberCount / 1000).toFixed() + '%';
                                response.data.list[i].totalDeposit = response.data.list[i].totalDeposit / 50000000000000 + '%';
                            }
                            this.myTotalAll = response.data.total;
                            this.myConsensus = response.data.list;
                        }
                    });
            },
            //我的共识列表分页
            myConsensusSize(events) {
                this.getMyConsensus("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'), {
                    "pageNumber": events,
                    "pageSize": "3"
                });
            },
            //获取全部共识列表
            getAllConsensus(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
                        if (response.success) {
                            //console.log(response);
                            for (var i = 0; i < response.data.list.length; i++) {
                                //console.log(response.data.list[i].creditRatio);
                                if (response.data.list[i].creditRatio != 0) {
                                    if (response.data.list[i].creditRatio > 0) {
                                        response.data.list[i].creditRatio = ((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                    } else {
                                        response.data.list[i].creditRatio = Math.abs(response.data.list[i].creditRatio) * 100 + '%';
                                    }
                                } else {
                                    response.data.list[i].creditRatio = "50%";
                                }
                                response.data.list[i].statuss = response.data.list[i].status;
                                response.data.list[i].status = this.switchStatus(response.data.list[i].status);
                                response.data.list[i].memberCount = (response.data.list[i].memberCount / 10).toString() + '%';
                                response.data.list[i].totalDeposit = (response.data.list[i].totalDeposit / 50000000000000).toString() + '%';
                            }
                            this.totalAll = response.data.total;
                            this.allConsensus = response.data.list;
                        }
                    });
            },
            //全部共识分页
            allConsensusSize(events) {
                this.getAllConsensus("/consensus/agent/list/", {"pageNumber": events, "pageSize": "3"});
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
            toAgencyNode() {
                this.$router.push({
                    name: '/agencyNode',
                });
            },
            //我的节点跳转
            toMyNode(address, index) {
                if (address === localStorage.getItem("newAccountAddress")) {
                    this.$router.push({
                        name: '/nodeInfo'
                    });
                } else {
                    this.$router.push({
                        name: '/myNode',
                        params: {"agentAddress": address}
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
                this.tabName = tab.name;
                if (localStorage.getItem("newAccountAddress") != '') {
                    if (tab.name !== 'first') {
                        this.getMyConsensus("/consensus/agent/address/" + localStorage.getItem('newAccountAddress'), {"pageSize": "3"});
                    } else {
                        this.getAllConsensus("/consensus/agent/list", {"pageSize": "3"});
                    }
                }
            },
            //跳转加入共识列表
            toNodeList() {
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
                    width: 40%;
                    height: 25px;
                    line-height: 25px;
                    padding-left: 10%;
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