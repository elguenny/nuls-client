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
	.set-password {
		width: 40%;
		height: 100%;
		margin: auto;
		h2 {
			font-size: 0.8rem;
			line-height: 7rem;
			text-align: center;
		}
		.set-pass-info div {
			font-size: 0.7rem;
			color: #FFFFFF;
			word-break: break-word;
			text-align: left;
			line-height: 1.3rem;
		}
		.set-pass-submit {
			width: 70%;
		}
		.el-form-item__content {
			text-align: center;
			.setPassSubmit {
				width: 70%;
				font-size: 0.8rem;
			}
			.set-pass-reset {
				color: #FF0000;
			}
		}
		.el-input__inner {
			border: 1px solid #658ec7;
		}
		.el-form-item__label {
			line-height: 10px;
		}
		.el-form-item__content {
			line-height: 10px;
		}
		.el-input__suffix {
			margin-top: 5%;
		}
	}
</style>