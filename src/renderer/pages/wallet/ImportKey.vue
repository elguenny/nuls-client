<template>
    <div class="import-key">
        <Back :backTitle="backTitle"></Back>
        <h2>{{$t("message.key")}}</h2>
        <el-form ref="keyData" :model="keyData" :rules="keyRules" label-position="top">
            <el-form-item :label="$t('message.keyLow')" prop="keyInfo">
                <el-input type="textarea" v-model="keyData.keyInfo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="keySubmit('keyData')">{{$t('message.confirmButtonText')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: this.$t("message.inportAccount"),
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
                                            type: 'warning', message: this.$t('message.passWordFailed') + response.msg
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
    }
</style>