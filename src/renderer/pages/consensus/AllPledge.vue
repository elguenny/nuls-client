<template>
	<div class="all-pledge">
		<Back :backTitle="backTitle"></Back>
		<h2>抵押总额明细</h2>
		<el-table :data="pledgeData" :stripe="false">
			<el-table-column prop="address" label="账户" min-width="50" align='center'>
			</el-table-column>
			<el-table-column prop="amount" label="金额" min-width="13" align='center'>
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="12" align='center'>
			</el-table-column>
			<el-table-column prop="depositTime" label="加入时间" min-width="20" align='center'>
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
				backTitle:this.$route.params.agentName,
				pledgeData: [],
                total:0,
			}
		},
		components: {
			Back,
		},
        mounted() {
            let _this = this;
            this.getConsensusDeposit("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'),{"pageSize": "10"});
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
                this.getConsensusDeposit("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'), {"pageNumber": events, "pageSize": "10"});
            },
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.all-pledge {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 28px;
		}
		.el-table {
			width: 85%;
			margin: auto;
		}
	}
</style>