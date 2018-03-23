<template>
    <div class="set-password">
        <Back :backTitle="backTitle" ></Back>
        <h2>修改密码</h2>

        <el-form :model="passForm" status-icon :rules="rulesPass" ref="passForm"  class="set-pass">
            <el-form-item label="旧密码:" prop="oldPass">
                <el-input type="password" v-model="passForm.oldPass"></el-input>
            </el-form-item>
            <el-form-item label="新密码(8-16位字符，需包含大小写字母和数字):" prop="pass">
                <el-input type="password" v-model="passForm.pass"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
                <el-input type="password" v-model="passForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item label="密码提示(可选):">
                <el-input v-model.number="passForm.passHelp"></el-input>
            </el-form-item>
            <el-form-item class="submitForm">
                <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>
<script>
    import Back from '@/components/BackBar.vue';
    export default {
        data() {
            var validateOldPass = (rule, value, callback) => {
                if ( value !== localStorage.getItem('userPass')) {
                    callback(new Error('请输入正确的旧密码'));
                } else {
                    if (this.passForm.checkPass !== '') {
                        this.$refs.passForm.validateField('checkPass');
                    }
                    callback();
                }
            };
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
                backTitle: '设置',
                passForm: {
                    oldPass:'',
                    pass: '',
                    checkPass: '',
                    passHelp: ''
                },
                rulesPass: {
                    oldPass:[
                        { validator: validateOldPass, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]

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
            /** Editor password
             * @method submitForm
             * @param {string} user password
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param = '{"password":"' + this.passForm.oldPass + '","newPassword":"' + this.passForm.pass + '"}';
                        //console.log(param);
                        this.$post('/wallet/reset/', param)
                            .then((response) => {
                                if (response.success) {
                                    this.$message({
                                        type: 'success', message: "恭喜您！" + response.msg
                                    });
                                    localStorage.setItem('userPass', this.passForm.pass);
                                    localStorage.setItem('passWordHint', this.passForm.passWordHint);
                                    this.$router.push({
                                        path: '/users/setPage'
                                    })
                                } else {
                                    this.$message({
                                        type: 'success', message: "对不起！" + response.msg
                                    });
                                }

                            });
                    } else {
                        this.$message({
                            type: 'success', message: "对不起！请输入正确的密码信息。"
                        });
                        return false;
                    }
                });
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
            margin: 10px 0 20px 0;
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
                    margin-top: 20px;
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
            .submitForm{
                margin-top: 50px;
            }
        }
    }
</style>