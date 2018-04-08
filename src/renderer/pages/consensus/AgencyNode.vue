<template>
    <div class="agency-node">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{$t('message.c43')}}</h2>
        <div class="agency-node-top">
            <div class="search-div fl">
                <el-input :placeholder="this.$t('message.c44')" v-model="keyword">
                    <template slot="append">
                        <el-button slot="append" @click="searchConsensus">{{$t('message.c45')}}</el-button>
                    </template>
                </el-input>
            </div>
            <div class="select-div fl">
                <el-select v-model="selectKeyword" slot="prepend" :placeholder="$t('message.c46')"
                           @change="sortConsensus">
                    <el-option :label="$t('message.c17')" value="commissionRate"></el-option>
                    <el-option :label="$t('message.c25')" value="owndeposit"></el-option>
                    <el-option :label="$t('message.c18')" value="creditRatio"></el-option>
                </el-select>
            </div>
        </div>
        <div class="agency-node-bottom">
            <div class="div-icon cursor-p" v-for="(item,index) in allConsensus" @click="toNodePage(item.agentAddress)">
                <p class="subscript">
                    {{item.status}}
                </p>
                <h3>{{item.agentName}}</h3>
                <ul>
                    <li class="overflow"><label>{{$t('message.c16')}}：</label>{{ item.agentAddress }}</li>
                    <li><label>{{$t('message.c17')}}：</label>{{ item.commissionRate }}%</li>
                    <li><label>{{$t('message.c25')}}：</label>{{ item.owndeposit*0.00000001 }} NULS</li>
                    <li @mouseover="toggleShow(index)" @mouseout="toggleShow(index)">
                        <label class="fl cursor-p">{{$t('message.c18')}}:</label>
                        <ProgressBar colorData="#f64b3e" :widthData="item.creditRatio"></ProgressBar>
                    </li>
                    <li class="cb">
                        <label class="fl">{{$t('message.c47')}}：</label>
                        <ProgressBar colorData="#58a5c9" :widthData="item.totalDeposit"></ProgressBar>
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
        <el-pagination layout="prev, pager, next" :page-size="6" :total=this.totalAll
                       v-show="totalOK = this.totalAll > 6 ? true:false" class="cb"
                       @current-change="allConsensusSize"></el-pagination>
    </div>
</template>

<script>
    import Back from './../../components/BackBar.vue'
    import ProgressBar from './../../components/ProgressBar.vue'

    export default {
        data() {
            return {
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
            this.getAllConsensus("/consensus/agent/list/", {"pageSize": "6", "pageNumber": "1"});
        },
        methods: {
            //获取全部共识列表
            getAllConsensus(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
                        //console.log(response);
                        if (response.success) {
                            for (var i = 0; i < response.data.list.length; i++) {
                                response.data.list[i].status = this.switchStatus(response.data.list[i].status);
                                response.data.list[i].creditRatio = (((((response.data.list[i].creditRatio + 1) / 2)) * 100).toFixed()).toString() + '%';
                                response.data.list[i].totalDeposit = ((response.data.list[i].totalDeposit / 50000000000000).toFixed()).toString() + '%';
                            }
                            this.totalAll = response.data.total;
                            this.allConsensus = response.data.list;
                        } else {
                            this.totalAll = 0;
                            this.allConsensus = [];
                        }
                    }).catch((reject) => {
                    console.log("获取全部共识列表：" + reject);
                });
            },
            //全部共识分页
            allConsensusSize(events) {
                this.getAllConsensus("/consensus/agent/list/", {"pageNumber": events, "pageSize": "6"});
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
            //搜索功能
            searchConsensus() {
                if (this.keyword != '') {
                    var params = {"keyword": this.keyword, "pageSize": "6", "pageNumber": "1"};
                    this.getAllConsensus("/consensus/agent/list/", params);
                } else {
                    this.getAllConsensus("/consensus/agent/list/", {"pageSize": "6", "pageNumber": "1"});
                }
            },
            //排序共识
            sortConsensus(sort) {
                if (this.keyword != '') {
                    var params = {"keyword": this.keyword, "sortType": sort, "pageSize": "6", "pageNumber": "1"};
                    this.getAllConsensus("/consensus/agent/list/", params);
                } else {
                    var params = {"sortType": sort, "pageSize": "6", "pageNumber": "1"};
                    this.getAllConsensus("/consensus/agent/list/", params);
                }

            },
            //显示隐藏信用值
            toggleShow(e) {
                this.creditValuesShow0 = !this.creditValuesShow0;
            },
            //查看节点详情
            toNodePage(index) {
                this.$router.push({
                    name: '/nodePage',
                    params: {address: index},
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
                    padding: 0 2px;
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
                display: inline-block;
            }
        }
        .el-select-dropdown__list {
            width: 165px;
        }
    }

    .el-popper[x-placement^=bottom] .popper__arrow {
        display: none;
    }
</style>