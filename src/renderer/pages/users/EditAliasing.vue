<template>
    <div class="edit-aliasing">
        <Back :backTitle="backTitle"></Back>
        <div class="edit-info">
            <h2>{{this.alias == null ? "设置别名":"修改别名"}}</h2>
            <el-form>
                <el-form-item label="账户地址:">
                    <el-input v-model="address" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="别名:" class="label-aliasing">
                    <el-input v-model="alias" class="bt-aliasing"></el-input>
                </el-form-item>
                <el-form-item label="手续费:">
                    <el-input v-model="serviceNo" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item class="aliasing-submit">
                    <el-button type="primary" @click="aliasingSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: '账户管理',
                alias: this.$route.params.alias,
                address: this.$route.params.address,
                serviceNo: '0.01NULS'
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            aliasingSubmit() {
                this.$prompt(this.$t('message.passWordTitle'), '', {
                    confirmButtonText: this.$t('message.confirmButtonText'),
                    cancelButtonText: this.$t('message.cancelButtonText'),
                    inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                    inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                    inputType:'password'
                }).then(({value}) => {
                    var param = {"alias": this.alias, "address": this.address, "password": value}
                    this.$post('/account/alias/', param)
                        .then((response) => {
                            //console.log(response);
                            if (response.success) {
                                this.$message({
                                    type: 'success', message: "别名设置完成！"
                                });
                                this.$router.push({
                                    path: '/users/userInfo'
                                })
                            } else {
                                this.$message({
                                    type: 'warning', message: response.msg + ",别名设置未完成!"
                                });
                            }
                        });
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
            width: 50%;
            margin: auto;
            h2 {
                text-align: center;
                line-height: 3rem;
            }
            .aliasing-submit {
                text-align: center;
                button {
                    width: 30%;
                }
            }
            input[type="text"],
            input[type="password"],
            select {
                background: #0b1422;
            }
            .el-form-item__label {
                text-align: left;
            }
            .el-input__inner {
                border-color: #0b1422;
            }
            .bt-aliasing .el-input__inner {
                border: 1px solid #24426c;
            }
            .el-input__inner:hover {
                border: 1px solid #658ec7;
            }
        }
    }

    .edit-aliasing .edit-info .el-form-item__label {
        width: 80px;
    }

    .el-form-item__content {
        margin-left: 80px;
    }

    .label-aliasing label {
        float: none;
    }

    .label-aliasing .el-form-item__content {
        margin-left: 0px;
    }

    .el-form-item {
        margin-bottom: 0px;
    }

    .el-input__inner {
        padding: 0px 3px;
    }

    .aliasing-submit .el-form-item__content {
        margin-left: 0px;
    }
</style>