<template>
    <div class="edit-aliasing">
        <Back :backTitle="backTitle"></Back>
        <div class="edit-info">
            <h2>{{$t('message.c100')}}</h2>

            <el-form :model="aliasForm" :rules="aliasRules" ref="aliasForm">
                <div class="div-text">
                    <label>{{$t('message.c102')}}:</label>{{this.address}}
                </div>
                <div class="div-text">{{$t('message.c103')}}</div>
                <el-form-item :label="$t('message.c104')" class="label-aliasing" prop="alias">
                    <el-input v-model="aliasForm.alias" class="bt-aliasing" :placeholder="$t('message.c105')"></el-input>
                </el-form-item>
                <div class="div-text">
                    <label>{{$t('message.miningFee1')}}:</label>0.01NULS
                </div>
                <el-form-item class="aliasing-submit">
                    <el-button type="primary"  @click="aliasingSubmit('aliasForm')">{{$t('message.confirmButtonText')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            var aliasing = (rule, value, callback) => {
                if(this.usable > 1.01){
                    if (value === '') {
                        callback(new Error(this.$t('message.c104')));
                    }else if(value.length > 8){
                        callback(new Error(this.$t('message.c106')));
                    }else{
                        callback();
                    }
                }else {
                    callback(new Error(this.$t('message.c107')));
                }
            };
            return {
                backTitle: this.$t('message.accountManagement'),
                address: this.$route.params.address,
                usable:0,
                aliasForm: {
                    alias: '',
                },
                aliasRules: {
                    alias: [
                        {validator: aliasing, trigger: 'blur'}
                    ]
                },
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getBalanceAddress('/account/balance/' +this.address);
        },
        methods: {
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.usable = response.data.usable * 0.000000001;
                        }else {
                            this.usable = 0;
                        }
                    });
            },
            //修改别名
            aliasingSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$prompt(this.$t('message.passWordTitle'), '', {
                            confirmButtonText: this.$t('message.confirmButtonText'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                            inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = {"alias": this.aliasForm.alias, "address": this.address, "password": value};
                            console.log(param);
                            this.$post('/account/alias/', param)
                                .then((response) => {
                                    console.log(response);
                                    if (response.success) {
                                        this.$message({
                                            type: 'success', message: this.$t('message.passWordSuccess')
                                        });
                                        this.$router.push({
                                            name: '/userInfo'
                                        })
                                    } else {
                                        this.$message({
                                            type: 'warning', message: this.$t('message.passWordFailed') + response.msg
                                        });
                                    }
                                });
                        })
                    }else {
                        this.$message({
                            type: 'warning', message: this.$t('message.passWordFailed')
                        });
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    .edit-aliasing {
        width: 100%;
        margin: auto;
        .edit-info {
            width: 60%;
            margin: auto;
            h2 {
                text-align: center;
                line-height: 3rem;
            }
            .aliasing-submit {
                text-align: center;
                button {
                    width: 60%;
                    margin-top: 50px;
                }
            }
            .div-text {
                font-size: 14px;
                line-height: 30px;
                color: #e3dddd;
            }
            .el-form-item {
                margin-bottom: 15px;
            }
            .bt-aliasing .el-input__inner {
                border: 1px solid #24426c;
            }
            .el-input__inner:hover {
                border: 1px solid #658ec7;
            }
            /**placeholder**/
            ::-webkit-input-placeholder {
                color: #8a929b;
            }
        }
    }

</style>