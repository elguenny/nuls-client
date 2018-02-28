<template>
	<div class="my-node">
		<Back :backTitle="backTitle"></Back>
		<h2>雷霆节点</h2>
		<div class="div-icon my-node-top">
			<p class="subscript">
				待共识
			</p>
			<ul>
				<li class="li-bg">
					<label>节点来源：</label>NTER7
				</li>
				<li>
					<label>佣金比例：</label>15%
				</li>
				<li>
					<label>保证金：</label>20000NULS
				</li>
				<li>
					<label>参与人数：</label>
					<ProgressBar colorData="#6a84f7" widthData="80%"></ProgressBar>
				</li>
				<li>
					<label>信用值：</label>
					<ProgressBar colorData="#82bd39" widthData="30%"></ProgressBar>
				</li>
				<li>
					<label>剩余可抵押：</label>
					<ProgressBar colorData="#58a5c9" widthData="60%"></ProgressBar>
				</li>
				<li class="li-info">
					<label>节点介绍：</label>雷霆节点NULS忠实粉丝！
				</li>
			</ul>
		</div>
		<div class="my-node-bottom">
			<div class="my-node-list">
				我的抵押明细 <span class="text-d cursor-p fr" @click="allOut">全部退出</span><span class="text-d cursor-p fr" @click="addNode">追加</span>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="name" label="抵押保证金" min-width="20" align='center'>
				</el-table-column>
				<el-table-column prop="province" label="状态" min-width="10" align='center'>
				</el-table-column>
				<el-table-column prop="city" label="加入时间" min-width="25" align='center'>
				</el-table-column>
				<el-table-column label="操作" min-width="25" align='center'>
					<template slot-scope="scope">
						<el-button @click="outNode(scope.row)" type="text" size="small">退出</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>
		</div>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'
	import ProgressBar from './../../components/ProgressBar.vue'
	export default {
		data() {
			return {
				backTitle: "委托共识",
				tableData: [{
					name: '2000NULS',
					province: '正在共识',
					city: '2018-8-9 15:25:60'
				}, {
					name: '2000NULS',
					province: '等待下一轮',
					city: '2018-8-9 15:25:60'
				}, {
					name: '2000NULS',
					province: '正在共识',
					city: '2018-8-9 15:25:60'
				}]
			}
		},
		components: {
			Back,
			ProgressBar,
		},
		methods: {
			allOut(){
				console.log('全部退出');
			},
			addNode(){
				this.$router.push({
					path: '/consensus/myNode/addNode'
				});
			},
			outNode(e) {
				this.$confirm('确定退出雷霆节点？(抵押保证金200NULS)', '退出节点', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}

		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.my-node {
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
				span {}
			}
			.li-info {
				width: 100%;
				text-align: left;
			}
			li.number,
			.el-icon {
				width: auto;
				float: none;
				background-color: #17202e;
			}
		}
		.el-pager {
			width: auto;
			height: auto;
			padding: 0px;
			background-color: #17202e;
		}
		.my-node-bottom {
			width: 80%;
			height: 200px;
			margin: auto;
			margin-top: 20px;
			border: 1px solid #658ec7;
			background-color: #17202e;
			.my-node-list {
				text-align: center;
				font-size: 14px;
				line-height: 25px;
				color: #c1c5c9;
				span {
					margin-right: 10px;
				}
			}
			.el-table tr {
				/*background-color: #17202e;
				border-bottom: 1px solid #00FFFF;*/
			}
			.el-pagination {
				margin-top: 0px;
				padding: 0px;
			}
			.el-pagination button.disabled {
				background-color: #17202e;
			}
			.btn-next,
			.btn-prev {
				background: center center no-repeat #17202e;
			}
		}
	}
</style>