<template>
    <div class="set-password">
        <Back :backTitle="backTitle" v-show="backOk"></Back>
        <h2>{{$t("message.setPassWord")}}</h2>
        <el-form :model="setPass" status-icon :rules="rules2" :label-position="labelPosition" ref="setPass"
                 class="set-pass">
            <el-form-item label="$t('message.oldPassWord')" prop="pass" v-show="oldPassOk">
                <el-input type="password" v-model="setPass.oldpass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.walletPassWord')" prop="pass">
                <el-input type="password" v-model="setPass.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.affirmWalletPassWord')" prop="checkPass">
                <el-input type="password" v-model="setPass.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.passWordHint')">
                <el-input v-model="setPass.passWordHint"></el-input>
            </el-form-item>
            <el-form-item class="set-pass-info">
                {{$t("message.passWordInfo")}}
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="set-pass-submit" @click="submitForm('setPass')">
                    {{$t("message.passWordAffirm")}}
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="text" class="set-pass-reset" @click="resetForm('setPass')">
                    {{$t("message.passWordCancel")}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>

</template>
<script>
    import md5 from 'js-md5'
    import Back from '@/components/BackBar.vue'

    export default {
        data() {
            var passWordHint = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('message.passWordHintEmpty')));
                }
            };
            var validatePass = (rule, value, callback) => {
                var patrn = /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/;
                if (!patrn.exec(value)) {
                    callback(new Error(this.$t('message.walletPassWordEmpty')));
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('message.affirmWalletPassWordEmpty')));
                } else if (value !== this.setPass.pass) {
                    callback(new Error(this.$t('message.passWordAtypism')));
                } else {
                    callback();
                }
            };
            return {
                oldPassOk: this.$route.params.oldPassOk,
                backOk: this.$route.params.backOk,
                backTitle: this.$t('message.set'),
                labelPosition: 'top',
                setPass: {
                    pass: '123456asd',
                    checkPass: '123456asd',
                    passWordHint: '456'
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
                    passWordHint: [{
                        validator: passWordHint,
                        trigger: 'blur'
                    }]
                }
            };
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
        },
        methods: {
            /** Set the password for the user
             * @method submitForm
             * @for
             * @param {string} user password
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('userPass', md5(this.setPass.pass).substring(0,10));
                        localStorage.setItem('passWordHint', this.setPass.passWordHint);
                        localStorage.setItem('fastUser', '1');
                        this.$router.push({
                            path: '/firstInto/firstInfo'
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /** I confirm the wallet risk, do not set the password.
             * @method resetForm
             * @param {string} formName
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            resetForm(formName) {
                localStorage.setItem('userPass', Base64.encode(this.setPass.pass));
                localStorage.setItem('passWordHint', this.setPass.passWordHint);
                localStorage.setItem('fastUser', '0');
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
            margin: 20px 0 20px 0;
        }
        .set-pass {
            width: 385px;
            margin: auto;
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
            .el-form-item {
                margin-bottom: 1rem;
            }
        }
    }
</style>