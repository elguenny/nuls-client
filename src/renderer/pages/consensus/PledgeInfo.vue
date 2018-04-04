<template>
    <div class="pledge-info">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{$t('message.c48')}}</h2>
        <el-table :data="pledgeData" >
            <el-table-column prop="agentName" :label="$t('message.c24')" width="180" align='center'>
            </el-table-column>
            <el-table-column prop="amount" :label="$t('message.amount')" width="150" align='center'>
            </el-table-column>
            <el-table-column prop="status" :label="$t('message.state')"  width="100" align='center'>
            </el-table-column>
            <el-table-column prop="depositTime" :label="$t('message.c49')"  width="160" align='center'>
            </el-table-column>
            <el-table-column :label="$t('message.operation')"   width="90" align='center'>
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('message.c50')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-size="8" :total=this.total class="cb"
                       @current-change="pledgeSize" v-show="totalOK = this.total > 8 ? true:false"></el-pagination>
    </div>
</template>

<script>
    import Back from './../../components/BackBar.vue'
    import moment from 'moment';
    export default {
        data() {
            return {
                pledgeData: [],
                total:0,
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            if(localStorage.getItem("newAccountAddress") != ''){
                this.getConsensusDeposit("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'),{"pageSize": "8"});
            }

        },
        methods: {
            //获取我的抵押总额明细列表
            getConsensusDeposit(url,params) {
                this.$fetch(url,params)
                    .then((response) => {
                        console.log(response)
                        if (response.success) {
                            this.total = response.data.total;
                            for (var i = 0; i < response.data.list.length; i++) {
                                response.data.list[i].amount = response.data.list[i].amount *0.00000001;
                                response.data.list[i].depositTime = moment(response.data.list[i].depositTime).format('YYYY-MM-DD hh:mm:ss');
                                response.data.list[i].status = this.switchStatus(response.data.list[i].status);
                            }
                            this.pledgeData = response.data.list;
                        }
                    });
            },
            //分页功能
            pledgeSize(events){
                this.getConsensusDeposit("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'), {"pageNumber": events, "pageSize": "8"});
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
            //查看节点详情
            handleClick(row) {
                this.$router.push({
                    name: '/myNode',
                    params: {agentAddress: row.agentAddress},
                })
            }
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .pledge-info {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .el-table {
            width: 85%;
            margin: auto;
            .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

    }
</style>