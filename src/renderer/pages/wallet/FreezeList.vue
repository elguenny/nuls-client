<template>
	<div class="freeze-list">
		<Back :backTitle="this.$t('message.accountAssetsManagement')"></Back>
		<div class="freeze-list-tabs">
			<h2>{{$t('message.freezeList')}}</h2>
			<el-table :data="freezeData">
				<el-table-column prop="status" :label="$t('message.type')" align='center'>
				</el-table-column>
				<el-table-column prop="value" :label="$t('message.amount')" align='center'>
				</el-table-column>
				<el-table-column prop="createTime" :label="$t('message.freezeTime')" align='center'>
				</el-table-column>
				<el-table-column prop="lockTime" :label="$t('message.thawingTime')" align='center'>
				</el-table-column>
			</el-table>
			<el-pagination layout="prev, pager, next" :page-size="10" :total=this.totalAll class="cb"
					   v-show="totalAllOk = this.totalAll>5 ? true:false"
					   @current-change="freezeSize"></el-pagination>
			<!--<el-pagination
					layout="prev, pager, next"
					:total=this.totalAll>
			</el-pagination>-->
		</div>

	</div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import moment from 'moment';
	export default {
		data() {
			return {
				address:this.$route.params.address,
				freezeData: [],
                totalAll: 0,
			}
		},
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            let params = {"address": this.address,"pageSize":10,"pageNumber":1};
            this.getLocked('tx/locked/',params);
		},
		methods: {
			getLocked(url,param){
                this.$fetch(url, param)
                    .then((response) => {
                       //console.log(response);
						if(response.success){
                            this.totalAll = response.data.total;
                            for(let i=0;i<response.data.list.length;i++){
                                response.data.list[i].status = this.switchTyep(response.data.list[i].status);
                                response.data.list[i].value = (response.data.list[i].value * 0.00000001).toFixed(8);
                                response.data.list[i].createTime = moment(response.data.list[i].createTime).format('YYYY-MM-DD hh:mm:ss');
                                response.data.list[i].lockTime = response.data.list[i].lockTime===0 ? '': moment(response.data.list[i].lockTime).format('YYYY-MM-DD hh:mm:ss');
                            }
                            this.freezeData =response.data.list
						}else {
                            this.freezeData =[]
						}
					})
			},
            //交易列表分页
            freezeSize(events) {
                this.getLocked('tx/locked/', {
                    "address": this.address,
                    "pageSize": 10,
                    "pageNumber": events
                });
            },
            //查询交易类型
            switchTyep(status) {
                switch (status) {
                    case 0:
                        return "未花费";
                    case 1:
                        return "高度锁定";
                    case 2:
                        return "参与共识";
                    case 3:
                        return "已花费";
                }
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.freeze-list {
		width: 100%;
		margin: auto;
		.freeze-list-tabs {
			width: 85%;
			margin: auto;
			h2 {
				line-height: 3rem;
				text-align: center;
			}
			.el-table th {
				background-color: #222d3f;
			}
			.el-table tr {
				background-color: #0c1323;
			}
			.el-pagination {
				margin-top: 1rem;
				text-align: center;
			}
		}
		
	}
</style>