<template>
	<div class="users">
		<div class="back" @click="back"><i class="el-icon-arrow-left"></i>钱包管理</div>
		<div class="freeze-list-tabs">
			<h2>账户管理</h2>
			<el-table :data="userData" style="width: 100%">
				<el-table-column prop="userName" label="账户">
				</el-table-column>
				<el-table-column  label="别名" min-width="20" class="user-aliasing">
					 <template slot-scope="scope">
				        <span style="margin-left: 10px">{{ scope.row.userAliasing }}</span>
				        <i class="el-icon-edit" @click="editAliasing"></i>
				      </template>
				</el-table-column>
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="outUser()">移除账户</el-button>
						<el-button size="mini" type="text" @click="backupUser()">备份账户</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="prev, pager, next" :total="1000">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userData: [{
					userName: '0x7f80545d8c3147002c752fe8ade665739bf578ca',
					userAliasing: 'NETER7'
				}, {
					userName: '0x7f80545d8c3147002c752fe8ade665739bf578ca',
					userAliasing: 'NETER7'
				}, {
					userName: '0x7f80545d8c3147002c752fe8ade665739bf578ca',
					userAliasing: 'NETER7'
				}, {
					userName: '0x7f80545d8c3147002c752fe8ade665739bf578ca',
					userAliasing: 'NETER7'
				}]
			}
		},
		components: {

		},
		methods: {
			back() {
				this.$router.go(-1);
			},
			outUser() {
				console.log('移除账户')
			},
			backupUser() {
				console.log('备份账户')
			},
			editAliasing(){
				this.$router.push({
					path: '/wallet/users/editAliasing'
				})
			}

		}
	}
</script>
<style lang="less">
	#bg() {
		display: block;
		width: 2rem;
		height: 2rem;
		background-repeat: no-repeat;
		background-image: url(../../assets/images/top-icon.png);
		background-size: 200px;
	}
	.users {
		width: 90%;
		margin: auto;
		.back {
			width: 100%;
			height: 3rem;
			line-height: 3rem;
			font-size: 1rem;
		}
		.freeze-list-tabs{
			h2{
				text-align: center;
				line-height: 3rem;
			}
			.user-aliasing{
			 	i{
			 		#bg();
			 		background-position: -130px -45px;
			 	}	
			}
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
</style>