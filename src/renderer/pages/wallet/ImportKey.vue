<template>
    <div class="import-key">
        <h2>明文私钥导入</h2>
        <el-form ref="keyData" :model="keyData" label-position="top">
            <el-form-item label="请输入明文私钥:">
                <el-input type="textarea" v-model="keyData.keyInfo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="keySubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                keyData: {
                    keyInfo: ''
                }
            }
        },
        methods: {
            keySubmit() {
                this.$prompt(this.$t('message.passWordTitle'), '', {
                    confirmButtonText: this.$t('message.confirmButtonText'),
                    cancelButtonText: this.$t('message.cancelButtonText'),
                    inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                    inputErrorMessage: this.$t('message.walletPassWordEmpty')
                }).then(({value}) => {
                    var param = '{"prikey":"'+this.keyData.keyInfo+'","password":"' + value + '"}';
                    this.$post('/wallet/import/', param)
                        .then((response) => {
                            if (response.success) {
                                this.$message({
                                    type: 'success', message: this.$t('message.passWordSuccess')
                                });
                                /*localStorage.setItem('newAccountAddress', response.data[0]);
                                this.$router.push({
                                    name: '/newAccount',
                                    params: {newOk: true, address: ''},
                                })*/
                            } else {
                                this.$message({
                                    type: 'warning', message: this.$t('message.passWordFailed')
                                });
                            }
                        });

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