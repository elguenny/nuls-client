<template>
	<div class="freeze-list">
		<Back :backTitle="backTitle"></Back>
		<div class="freeze-list-tabs">
			<h2>冻结列表</h2>
			<el-table :data="freezeData" style="width: 100%">
				<el-table-column prop="freezeType" label="类型">
				</el-table-column>
				<el-table-column prop="freezeMoney" label="金额">
				</el-table-column>
				<el-table-column prop="lockTime" label="冻结时间">
				</el-table-column>
				<el-table-column prop="outTime" label="解冻时间">
				</el-table-column>
			</el-table>
			<!--<el-pagination background layout="prev, pager, next" :total="1000">
			</el-pagination>-->
		</div>
	</div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
	export default {
		data() {
			return {
                backTitle:'钱包管理',
				address:this.$route.params.address,
				freezeData: []

			}
		},
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            var params = {"address": this.address};
            this.getLocked('tx/locked',params);
		},
		methods: {
			getLocked(url,param){
                this.$fetch(url, param)
                    .then((response) => {
                        this.freezeData =response.data
					})
			}
		}
	}
</script>

<style lang="less">
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
				background-color: #17202e;
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