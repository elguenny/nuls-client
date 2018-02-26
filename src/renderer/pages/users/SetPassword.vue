<template>
	<div class="set-password">
		<h2>{{$t("message.setPassWord")}}</h2>
		<el-form :model="setPass" status-icon :rules="rules2" :label-position="labelPosition" ref="setPass" label-width="100px" class="set-pass">
			<el-form-item :label="$t('message.walletPassWord')" prop="pass">
				<el-input type="password" v-model="setPass.pass" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item :label="$t('message.affirmWalletPassWord')" prop="checkPass">
				<el-input type="password" v-model="setPass.checkPass" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item :label="$t('message.passWordHint')" prop="prompt">
				<el-input v-model.number="setPass.prompt"></el-input>
			</el-form-item>
			<el-form-item class="set-pass-info">
				{{$t("message.passWordInfo")}}
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="set-pass-submit" @click="submitForm('setPass')">{{$t("message.passWordAffirm")}}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="text" class="set-pass-reset" @click="resetForm('setPass')">{{$t("message.passWordCancel")}}</el-button>
			</el-form-item>
		</el-form>
	</div>

</template>
<script>
	export default {
		data() {
			var checkprompt = (rule, value, callback) => {
				if(!value) {
					return callback(new Error(this.$t('message.passWordHintEmpty')));
				}
			};
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error(this.$t('message.walletPassWordEmpty')));
				} else {
					if(this.setPass.checkPass !== '') {
						this.$refs.setPass.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error(this.$t('message.affirmWalletPassWordEmpty')));
				} else if(value !== this.setPass.pass) {
					callback(new Error(this.$t('message.passWordAtypism')));
				} else {
					callback();
				}
			};
			return {
				labelPosition: 'top',
				setPass: {
					pass: '',
					checkPass: '',
					prompt: ''
				},
				rules2: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
					prompt: [{
						validator: checkprompt,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$router.push({
					path: '/firstInto/firstInfo'
				})
				/*this.$refs[formName].validate((valid) => {
					if(valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});*/
			},
			resetForm(formName) {
				this.$router.push({
					path: '/firstInto/firstInfo'
				})
			}
		}
	}
</script>
<style lang="less">
	@import url("../../assets/css/style");
	.set-password {
		width: 385px;
		height: 100%;
		font-family: "微软雅黑";
		margin: auto;
		h2 {
			font-size: 16px;
			text-align: center;
			margin: 2.5rem 0 2rem 0;
			color: #ffffff;
		}
		.set-pass-info div {
			font-size: 12px;
			color: #FFFFFF;
			word-break: break-word;
			text-align: left;
			line-height: 15px;
			padding-bottom: 30px;
		}
		.set-pass-submit {
			width: 230px;
		    border-radius: 0.05rem;
		    background-color: #24426c;
		    border-color: #24426c;
		    height: 30px;
		    line-height: 30px;
		    padding: 0px;
		}
		.el-form-item__content {
			text-align: center;
			.setPassSubmit {
				width: 70%;
				font-size: 0.8rem;
			}
			.set-pass-reset {
				color: #f64b3e;
				font-size: 12px;
			}
		}
		.el-input__inner {
			border: 1px solid #6290c7;
		}
		.el-form-item__label {
			font-size: 12px;
			color: #8a929b;
			padding: 0 0 6px;
			line-height: 0px;
		}
		.el-form-item__content {
			line-height: 10px;
		}
		.el-input__suffix {
			margin-top: 5%;
		}
		.el-form-item
		{
			margin-bottom: 1rem;
		}
		
	}
</style>