<template>
    <div class="import-key">
        <Back :backTitle="backTitle"></Back>
        <h2>{{$t("message.key")}}</h2>
        <el-form ref="keyData" :model="keyData" :rules="keyRules" label-position="top">
            <el-form-item :label="$t('message.keyLow')" prop="keyInfo">
                <el-input type="textarea" v-model.trim="keyData.keyInfo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="keySubmit('keyData')">{{$t('message.confirmButtonText')}}</el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="" :visible.sync="passwordVisible" top="35vh">
            <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
                <el-form-item :label="this.$t('message.passWordTitle')" prop="password">
                    <el-input v-model="passwordForm.password" type="password" :maxlength=20></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="passwordVisible = false">{{$t('message.cancelButtonText')}}</el-button>
                <el-button type="primary" @click="dialogSubmit('passwordForm')">{{$t('message.confirmButtonText')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: this.$t("message.inportAccount"),
                passwordVisible: false,
                passwordForm: {
                    password: '',
                },
                passwordRules: {
                    password: [
                        {required: true, message:this.$t("message.passWordTitle"), trigger: 'blur'}
                    ]
                },

                keyData: {
                    keyInfo: ''
                },
                keyRules: {
                    keyInfo: [
                        {required: true, message: this.$t('message.keyLow'), trigger: 'blur'}
                    ]
                },
            }
        },
        components: {
            Back,
        },
        methods: {
            //弹出密码输入框
            dialogSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param = '{"prikey":"' + this.keyData.keyInfo + '","password":"' + this.passwordForm.password + '"}';
                        this.$post('/wallet/import/', param)
                            .then((response) => {
                                if (response.success) {
                                    localStorage.setItem('newAccountAddress', response.data);
                                    localStorage.setItem('userPass', this.passwordForm.password);
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

            //提交导入明文私钥
            keySubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.passwordForm.password ='';
                        this.passwordVisible = true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="less">
    .import-key {
        width: 100%;
        margin: auto;
        h2 {
            text-align: center;
            line-height: 3rem;
        }
        form {
            width: 60%;
            margin: auto;
        }
        .el-textarea__inner {
            background-color: #17202e;
        }
        .el-form-item__content {
            text-align: center;
            button {
                width: 30%;
            }
        }
        .el-form-item.is-required .el-form-item__label:before{
            font-size: 0px;
        }
    }
</style>