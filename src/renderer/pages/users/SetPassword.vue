<template>
    <div class="set-password">
        <h2>{{$t("message.setPassWord")}}</h2>
        <el-form :model="passForm" status-icon :rules="rulesPass" ref="passForm" class="set-pass">
            <el-form-item :label="$t('message.walletPassWord')" prop="pass">
                <el-input type="password" v-model="passForm.pass"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.affirmWalletPassWord')" prop="checkPass">
                <el-input type="password" v-model="passForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.passWordHint')">
                <el-input v-model.number="passForm.passHelp"></el-input>
            </el-form-item>
            <div class="set-pass-title">请认真保存当前钱包密码，若钱包密码丢失，很可能导致您的资产丢失！</div>
            <el-form-item>
                <el-button type="primary" @click="submitForm('passForm')" class="set-pass-submit">{{$t('message.passWordAffirm')}}</el-button>
                <el-button type="text" class="set-pass-reset" @click="resetForm('setPass')">
                   {{$t('message.passWordCancel')}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>

</template>
<script>
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                var patrn = /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/;
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (!patrn.exec(value)) {
                    callback(new Error("密码8-20位，且为字母、数字、符号等任意2种以上组合！"));
                } else {
                    if (this.passForm.checkPass !== '') {
                        this.$refs.passForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                passForm: {
                    pass: '',
                    checkPass: '',
                    passHelp: ''
                },
                rulesPass: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            /** Set the password for the user
             * @method submitForm
             * @param {string} user password
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('userPass', this.passForm.pass);
                        localStorage.setItem('passWordHint', this.passForm.passHelp);
                        localStorage.setItem('fastUser', '1');
                        this.$router.push({
                            path: '/firstInto/firstInfo'
                        })
                    } else {
                        this.$message({
                            type: 'success', message: "对不起！" + response.msg
                        });
                        return false;
                    }
                });
            },
            //不设置密码
            resetForm() {
                localStorage.setItem('userPass', '');
                localStorage.setItem('passWordHint', '');
                localStorage.setItem('fastUser', '1');
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
        height: 100%;
        font-family: "微软雅黑";
        margin: auto;
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin: 40px 0 20px 0;
        }
        .set-pass {
            width: 385px;
            margin: auto;
            .set-pass-info div {
                font-size: 12px;
                color: #FFFFFF;
                text-align: left;
                line-height: 15px;
                padding-bottom: 30px;
            }
            .set-pass-title{
                font-size: 12px;
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
                .set-pass-submit {
                    margin-top: 40px;
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
                padding: 15px 0 10px;
                line-height: 0px;
            }
            .el-form-item__content {
                line-height: 10px;
            }
            .el-input__suffix {
                margin-top: -2%;
                right: -5px;
            }
            .el-form-item {
                margin-bottom: 1rem;
            }
        }
    }
</style>