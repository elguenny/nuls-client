<template>
    <div class="import-key">
        <Back :backTitle="backTitle"></Back>
        <h2>明文私钥导入</h2>
        <el-form ref="keyData" :model="keyData" :rules="keyRules" label-position="top">
            <el-form-item label="请输入明文私钥:" prop="keyInfo">
                <el-input type="textarea" v-model="keyData.keyInfo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="keySubmit('keyData')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: '导入账户',
                keyData: {
                    keyInfo: ''
                },
                keyRules: {
                    keyInfo: [
                        {required: true, message: '请输入明文私钥！', trigger: 'blur'}
                    ]
                },
            }
        },
        components: {
            Back,
        },
        methods: {
            //提交导入明文私钥
            keySubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$prompt(this.$t('message.passWordTitle'), '', {
                            confirmButtonText: this.$t('message.confirmButtonText'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                            inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = '{"prikey":"' + this.keyData.keyInfo + '","password":"' + value + '"}';
                            this.$post('/wallet/import/', param)
                                .then((response) => {
                                    console.log(response)
                                    if (response.success) {
                                        localStorage.setItem('newAccountAddress', '2Ck3mbLK5vh3JBKYWjeujAnY9EA6gNA');
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
                                        //导入成功需要返回账户地址
                                        /*console.log(response)
                                    localStorage.setItem('newAccountAddress', response.data[0]);*/

                                    } else {
                                        this.$message({
                                            type: 'warning', message: this.$t('message.passWordFailed' + response.msg)
                                        });
                                    }
                                });
                        })
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .import-key {
        width: 90%;
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
    }
</style>