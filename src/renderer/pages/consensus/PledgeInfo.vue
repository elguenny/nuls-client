<template>
    <div class="pledge-info">
        <Back :backTitle="backTitle"></Back>
        <h2>我的抵押总额明细</h2>
        <el-table :data="pledgeData" >
            <el-table-column prop="agentAddress" label="节点名称" width="280" align='center'>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="50" align='center'>
            </el-table-column>
            <el-table-column prop="status" label="状态"  width="100" align='center'>
            </el-table-column>
            <el-table-column prop="depositTime" label="加入时间"  width="160" align='center'>
            </el-table-column>
            <el-table-column label="操作"  width="90" align='center'>
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total=this.total class="cb"  @current-change="pledgeSize"></el-pagination>
    </div>
</template>

<script>
    import Back from './../../components/BackBar.vue'
    import moment from 'moment';
    export default {
        data() {
            return {
                backTitle: "共识首页",
                pledgeData: [],
                total:0,
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getConsensusDeposit("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'),{"pageSize": "8"});
        },
        methods: {
            //获取我的抵押总额明细列表
            getConsensusDeposit(url,params) {
                this.$fetch(url,params)
                    .then((response) => {
                        if (response.success) {
                            this.total = response.data.total;
                            for (var i = 0; i < response.data.list.length; i++) {
                                response.data.list[i].amount = response.data.list[i].amount *0.00000001;
                                response.data.list[i].depositTime = moment(response.data.list[i].depositTime).format('YYYY-MM-DD hh:mm:ss');
                                response.data.list[i].status = response.data.list[i].status !=2 ?"等待共识":"正在共识";
                            }
                            console.log(response)
                            this.pledgeData = response.data.list;
                        }
                    });
            },
            //分页功能
            pledgeSize(events){
                this.getConsensusDeposit("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'), {"pageNumber": events, "pageSize": "8"});
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