<template>
    <el-dialog title="" :visible.sync="passwordVisible" top="35vh">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
            <el-form-item :label="$t('message.passWordTitle')" prop="password">
                <el-input v-model="passwordForm.password" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="passwordVisible = false">{{$t('message.cancelButtonText')}}</el-button>
            <el-button type="primary" @click="dialogSubmit('passwordForm')">{{$t('message.confirmButtonText')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
/*        props: {
            passwordOk:{
                type:Boolean,
                default: false
            }
        },*/
        data() {
            return {
                passwordVisible: false,
                passwordForm: {
                    password: '',
                },
                passwordRules: {
                    password: [
                        {required: true, message: this.$t('message.passWordTitle'), trigger: 'blur'}
                    ]
                },
            };
        },
        methods: {
            //弹出密码输入框
            dialogSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param = '{"prikey":"' + this.keyData.keyInfo + '","password":"' + this.passwordForm.password + '"}';
                        console.log(param);
                        this.$post('/wallet/import/', param)
                            .then((response) => {
                                if (response.success) {
                                    localStorage.setItem('newAccountAddress', response.data);
                                    if (localStorage.getItem('toUserInfo') != "1") {
                                        this.$router.push({
                                            path: '/wallet'
                                        })
                                    } else {
                                        this.$router.push({
                                            path: '/wallet/users/userInfo'
                                        })
                                    }
                                    this.$message({
                                        type: 'success', message: this.$t('message.passWordSuccess')
                                    });
                                } else {
                                    this.$message({
                                        type: 'warning', message: this.$t('message.passWordFailed') + response.msg
                                    });
                                }
                                this.passwordVisible = false;
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
        }
    };
</script>

<style>
    .password {
        margin-top: 5rem;
    }
</style>