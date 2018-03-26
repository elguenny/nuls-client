<template>
    <div class="agency-node">
        <Back :backTitle="backTitle"></Back>
        <h2>共识代理节点</h2>
        <div class="agency-node-top">
            <div class="search-div fl">
                <el-input placeholder="请输入别名或地址" v-model="keyword">
                    <template slot="append">
                        <el-button slot="append" @click="searchConsensus">搜索</el-button>
                    </template>
                </el-input>
            </div>
            <div class="select-div fl">
                <el-select v-model="selectKeyword" slot="prepend" placeholder="请选择排序方式" @change="sortConsensus">
                    <el-option label="佣金比例" value="commissionRate"></el-option>
                    <el-option label="保证金" value="totalDeposit"></el-option>
                    <el-option label="信用系数" value="creditRatio"></el-option>
                </el-select>
            </div>
        </div>
        <div class="agency-node-bottom">
            <!--<div class="div-icon cursor-p fl" @click="toNodePage">-->
            <div class="div-icon fl cursor-p" v-for="(item,index) in allConsensus" @click="toNodePage(item.agentAddress)">
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
                       <!-- <ProgressBar colorData="#f64b3e" :widthData="item.creditRatio"></ProgressBar>-->
                        <ProgressBar colorData="#f64b3e" widthData="50%"></ProgressBar>
                    </li>
                    <li class="cb">
                        <label class="fl">剩余可委托：</label>
                        <!--<ProgressBar colorData="#58a5c9" :widthData="item.totalDeposit"></ProgressBar>-->
                        <ProgressBar colorData="#58a5c9" widthData="85%"></ProgressBar>
                    </li>
                </ul>
                <div class="credit-valuesDiv" v-show="creditValuesShow0">
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
        </div>
        <el-pagination layout="prev, pager, next" :page-size="6" :total=this.totalAll class="cb"
                       @current-change="allConsensusSize"></el-pagination>
    </div>
</template>

<script>
    import Back from './../../components/BackBar.vue'
    import ProgressBar from './../../components/ProgressBar.vue'

    export default {
        data() {
            return {
                backTitle: "雷霆节点",
                keyword: '',
                selectKeyword: '',
                creditValuesShow0: false,
                creditValuesShow1: false,
                creditValuesShow2: false,

                allConsensus: [],
                totalAll: 0,
            }
        },
        components: {
            Back,
            ProgressBar,
        },
        mounted() {
            let _this = this;
            this.getAllConsensus("/consensus/agent/list/", {"pageSize": "6"});
            /*this.getAllConsensus("/consensus/agent/1/6");*/
        },
        methods: {
            //获取全部共识列表
            getAllConsensus(url,params) {
                this.$fetch(url,params)
                    .then((response) => {
                        if (response.success) {
                            console.log(response.data.list);
                            for (var i = 0; i < response.data.list.length; i++) {
                                //response.data.list[i].agentAddress = response.data.list[i].agentAddress.substr(0, 4) + "..." + response.data.list[i].agentAddress.substr(-4);
                                response.data.list[i].creditRatio = (((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed()).toString() + '%';
                                response.data.list[i].totalDeposit = ((response.data.list[i].totalDeposit / 50000000000000).toFixed()).toString() + '%';
                            }
                            this.totalAll = response.data.total;
                            this.allConsensus = response.data.list;
                        }
                    });
            },
            //全部共识分页
            allConsensusSize(events) {
                this.getAllConsensus("/consensus/agent/list/", {"pageNumber": events,"pageSize": "6"});
            },
            //搜索功能
            searchConsensus(){
                if(this.keyword !=''){
                    var params = {"keyword":this.keyword,"pageSize": "6"};
                    this.getAllConsensus("/consensus/agent/list/",params);
                }else {
                    this.$message({
                        message: '请输入搜索关键字！',
                        type: 'warning'
                    });
                }
            },
            //排序共识
            sortConsensus(sort){
                var params = {"sortType":sort,"pageSize": "6"};
                this.getAllConsensus("/consensus/agent/list/",params);
            },
            //显示隐藏信用值
            toggleShow(e) {
                this.creditValuesShow0 = !this.creditValuesShow0;
            },
            //查看节点详情
            toNodePage(index) {
                this.$router.push({
                    name: '/nodePage',
                    params: {address:index},
                });
            }
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .agency-node {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 10px;
        }
        .agency-node-top {
            width: 80%;
            margin: auto;
            height: 30px;
            .search-div {
                width: 433px;
                input[type="text"],
                select {
                    background-color: #17202e;
                    border: 1px solid #658ec7;
                }
                .el-input-group__append {
                    border-left: 0;
                    background-color: #658ec7;
                    border-color: #658ec7;
                    border-radius: 0px;
                    color: #ffffff;
                    font-size: 12px;
                }
            }
            .select-div {
                margin-left: 3%;
                width: 165px;
            }
        }
        .agency-node-bottom {
            width: 80%;
            margin: auto;
            .div-icon {
                height: 145px;
                margin-top: 15px;
                margin-right: 6px;
            }
        }
    }
</style>