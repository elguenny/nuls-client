<template>
	<div class="set-page">
		<h2>系统设置</h2>
		<div class="set-page-info">
			<el-switch v-model="value0" :width="30" active-color="#658ec7" inactive-color="#0b1422" inactive-text="开机启动："></el-switch>
			<el-collapse>
				<el-collapse-item>
					<template slot="title">
						<el-switch v-model="value1" :width="30" active-color="#658ec7" inactive-color="#0b1422" inactive-text="消息提示："></el-switch>
					</template>
					<ul>
						<li>
							<el-switch v-model="value2" :width="30" active-color="#658ec7" inactive-color="#0b1422" inactive-text="账户"></el-switch>
						</li>
						<li>
							<el-switch v-model="value3" :width="30" active-color="#658ec7" inactive-color="#0b1422" inactive-text="共识"></el-switch>
						</li>
						<li>
							<el-switch v-model="value4" :width="30" active-color="#658ec7" inactive-color="#0b1422" inactive-text="账本"></el-switch>
						</li>
						<li>
							<el-switch v-model="value5" :width="30" active-color="#658ec7" inactive-color="#0b1422" inactive-text="网络"></el-switch>
						</li>
					</ul>
				</el-collapse-item>
			</el-collapse>
			<div class="set-page-div">
				<label>日志：</label>
				<span class="cursor-p set-page-div-span" @click="toViewLog">查看日志</span>
			</div>
			<div class="set-page-div">
				<label>语音选择：</label>
				<el-select v-model="value" placeholder="请选择">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="set-page-div">
				<label>通讯录管理：</label>
				<span class="cursor-p set-page-div-span" @click="toUserAddressList">查看通讯录</span>
			</div>
			<div class="set-page-div">
				<label>修改钱包密码：</label>
				<span class="cursor-p set-page-div-span" @click="toEditPassword ">修改密码</span>
			</div>
			<div class="set-page-div">
				<label>当前版本：V1.0.0</label>
				<span class="cursor-p set-page-div-span" @click="versionUpdates">更新版本</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				value0: false,
				value1: false,
				value2: true,
				value3: false,
				value4: true,
				value5: false,
				options: [{
					value: '简体中文',
					label: '简体中文'
				}, {
					value: 'English',
					label: 'English'
				}],
				value: '简体中文'
			}
		},
		methods: {
			toViewLog(){
				this.$router.push({
					path: '/users/userLog'
				})
			},
			toUserAddressList(){
				this.$router.push({
					path: '/users/userAddressList'
				})
			},
			toEditPassword(){
				this.$router.push({
					path: '/users/setPassword'
				})
			},
			versionUpdates() {
				this.$confirm('确定升级到钱包版本v1.0.1（核心版本v0.1.4）？', '版本更新', {
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
	.set-page {
		width: 320px;
		margin: auto;
		h2 {
			margin-top: 30px;
			font-size: 16px;
			font-weight: 600px;
			text-align: center;
			line-height: 35px;
		}
		.set-page-info {
			margin-top: 15px;
			.set-page-div {
				color: #C1C5C9;
				font-size: 12px;
				line-height: 27px;
				label {
					display: block;
				}
				.set-page-div-span {
					display: block;
					width: 311px;
					border: 1px solid #24426c;
					text-align: center;
				}
				.el-input--suffix .el-input__inner {
					height: 27px;
					width: 311px;
				}
				.set-page-div-span:hover {
					color: #FFFFFF;
					border-color: #658ec7;
				}
			}
			.el-switch {
				border: 1px solid #1c2738;
				background-color: #17202e;
				height: 27px;
				line-height: 27px;
			}
			.el-switch__label.is-active,
			.el-switch__label--left {
				width: 270px;
				line-height: 24px;
				height: 24px;
			}
			.el-switch__label * {
				line-height: 24px;
				font-size: 12px;
				color: #C1C5C9;
			}
			.el-switch__core {
				width: 30px;
				height: 15px;
				border: 1px solid #658ec7;
			}
			.el-switch__core .el-switch__button {
				top: 0px;
				left: 2px;
				width: 13px;
				height: 13px;
			}
			.el-collapse {
				border: none;
				min-height: 45px;
				line-height: 27px;
			}
			.el-collapse-item__header {
				height: 0px;
				height: 0px;
				border: none;
			}
			.el-collapse-item__arrow {
				font-size: 0px;
			}
			.el-collapse-item__wrap {
				margin-top: 38px;
				border: none;
			}
			.el-collapse-item__content {
				background-color: #0c1323;
				padding: 5px 0 10px 0;
				ul {
					li {
						width: 60%;
						margin: auto;
						.el-switch__label.is-active,
						.el-switch__label--left {
							width: 150px;
						}
						.el-switch {
							background-color: #0c1323;
							border: none;
						}
					}
				}
			}
		}
	}
</style>