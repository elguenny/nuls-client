<template>
	<div class="set-page">
		<h2>{{$t('message.c66')}}</h2>
		<div class="set-page-info">
			<el-switch v-model="value0" :width="30" active-color="#658ec7" inactive-color="#0b1422" :inactive-text="$t('message.c67')"></el-switch>
			<el-collapse>
				<el-collapse-item>
					<template slot="title">
						<el-switch v-model="value1" :width="30" active-color="#658ec7" inactive-color="#0b1422" :inactive-text="$t('message.c68')"></el-switch>
					</template>
					<ul>
						<li>
							<el-switch v-model="value2" :width="30" active-color="#658ec7" inactive-color="#0b1422" :inactive-text="$t('message.c69')"></el-switch>
						</li>
						<li>
							<el-switch v-model="value3" :width="30" active-color="#658ec7" inactive-color="#0b1422" :inactive-text="$t('message.c70')"></el-switch>
						</li>
						<li>
							<el-switch v-model="value4" :width="30" active-color="#658ec7" inactive-color="#0b1422" :inactive-text="$t('message.c71')"></el-switch>
						</li>
						<li>
							<el-switch v-model="value5" :width="30" active-color="#658ec7" inactive-color="#0b1422" :inactive-text="$t('message.c72')"></el-switch>
						</li>
					</ul>
				</el-collapse-item>
			</el-collapse>
			<div class="set-page-div">
				<label>{{$t('message.c73')}}：</label>
				<span class="cursor-p set-page-div-span" @click="toViewLog">{{$t('message.c74')}}</span>
			</div>
			<div class="set-page-div">
				<label>{{$t('message.c75')}}：</label>
				<el-select v-model="value" :placeholder="$t('message.c76')"  :change="selectLanguage(value)">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" change="selectLanguage('item.value')">
					</el-option>
				</el-select>
			</div>
			<div class="set-page-div">
				<label>{{$t('message.c77')}}：</label>
				<span class="cursor-p set-page-div-span" @click="toUserAddressList">{{$t('message.c78')}}</span>
			</div>
			<div class="set-page-div">
				<label>{{$t('message.c79')}}：</label>
				<span class="cursor-p set-page-div-span" @click="toEditPassword ">{{$t('message.c80')}}</span>
			</div>
			<div class="set-page-div">
				<label>{{$t('message.c81')}}：V1.0.0</label>
				<span class="cursor-p set-page-div-span" @click="versionUpdates">{{$t('message.c82')}}</span>
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
					value: 'zh',
					label: this.$t('message.c83')
				}, {
					value: 'en',
					label: this.$t('message.c84')
				}],
				value: 'zh'
			}
		},
		methods: {

		    //查看日志
			toViewLog(){
				this.$router.push({
					path: '/users/userLog'
				})
			},
			//选择语言
            selectLanguage(value){
               this.$i18n.locale = value;
               localStorage.setItem("language",value);
			},
			//通讯录管理
			toUserAddressList(){
				this.$router.push({
					path: '/users/userAddressList'
				})
			},
			//修改密码
			toEditPassword(){
			    if(localStorage.getItem('userPass') != ''){
                    this.$router.push({
                        name: '/editorPassword',
                    })
				}else {
                    this.$confirm(this.$t('message.c85'),this.$t('message.c86'), {
                        confirmButtonText:this.$t('message.c87'),
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            name: '/setPassword',
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: this.$t('message.c59')
                        });
                    });
				}

			},
			//版本更新
			versionUpdates() {
				this.$confirm(this.$t('message.c88'), this.$t('message.c89'), {
					confirmButtonText: this.$t('message.confirmButtonText'),
					cancelButtonText: this.$t('message.cancelButtonText'),
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: this.$t('message.passWordSuccess'),
					});
				}).catch(() => {
					this.$message({
						type: 'info',
                        message: this.$t('message.passWordFailed'),
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