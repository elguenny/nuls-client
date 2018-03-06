<template>
	<div class="users">
		<Back :backTitle="backTitle"></Back>
		<div class="freeze-list-tabs">
			<h2>账户管理</h2>
			<el-table :data="userData">
				<el-table-column prop="address" label="账户" min-width="50" align='center'>
				</el-table-column>
				<el-table-column  label="别名" min-width="25" class="user-aliasing">
					 <template slot-scope="scope">

				        <span>{{ scope.row.alias != undefined  ? scope.row.alias : "-" }}</span>
				        <i class="el-icon-edit cursor-p" @click="editAliasing"></i>
				      </template>
				</el-table-column>
				<el-table-column label="操作"  min-width="25" align='center'>
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
    import Back from '@/components/BackBar.vue';
	export default {
		data() {
			return {
                backTitle:'钱包管理',
                userData:[],
			}
		},
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getUserList("/account/list");

        },
		methods: {
		    getUserList(api){
                this.$fetch(api)
					.then((response) => {
						this.userData = response.data;
						console.log(response.data.alias);
					});
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
	@import url("../../assets/css/style.less");
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