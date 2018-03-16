<template>
	<div class="users">
		<Back :backTitle="backTitle"></Back>
		<div class="freeze-list-tabs">
			<h2>账户管理</h2>
			<el-button type="primary" icon="el-icon-plus" @click="toNewAccount" class="newAccount" title="新增账户"></el-button>
			<el-table :data="userData">
				<el-table-column prop="address" label="账户" min-width="50" align='center'>
				</el-table-column>
				<el-table-column  label="别名" min-width="25" class="user-aliasing">
					 <template slot-scope="scope">
				        <span>{{ scope.row.alias != undefined  ? scope.row.alias : "-" }}</span>
				        <i class="el-icon-edit cursor-p" @click="editAliasing(scope.row.address,scope.row.alias)"></i>
				      </template>
				</el-table-column>
				<el-table-column label="操作"  min-width="25" align='center'>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="outUser()">移除</el-button>
						<el-button size="mini" type="text" @click="backupUser(scope.row.address)">备份</el-button>
					</template>
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
				setAsAddress:localStorage.getItem('newAccountAddress'),
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
					});
			},
			outUser() {
				console.log('移除账户')
			},
			backupUser(address) {
                this.$router.push({
                    name: '/newAccount',
					params:{newOk:false,address:address},
                })
			},
			editAliasing(accountAddress,accountAlias){
                this.$router.push({
                    name: '/editAliasing',
                    params: {address: accountAddress, alias: accountAlias},
                })
			},
			//新增账户
            toNewAccount(){
                this.$router.push({
                    path: '/firstInto/firstInfo'
                })
			}

		}
	}
</script>
<style lang="less">
	@import url("../../assets/css/style.less");
	.users {
		width: 100%;
		margin: auto;
		.freeze-list-tabs{
			width: 80%;
			margin: auto;
			.newAccount{
				width: 30px;
				line-height: 20px;
				height: 20px;
				background-color: #0b1422;
				float: right;
				border: 1px solid #0b1422;
				margin-bottom: 10px;
			}
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