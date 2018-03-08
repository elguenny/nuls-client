<template>
    <div class="edit-aliasing">
        <Back :backTitle="backTitle"></Back>
        <div class="edit-info">
            <h2>{{this.aliasingData.alias == null ? "设置别名":"修改别名"}}</h2>
            <el-form :model="aliasingData">
                <el-form-item label="账户地址:">
                    <el-input type="text" disabled v-model="aliasingData.address"></el-input>
                </el-form-item>
                <el-form-item label="别名:" class="label-aliasing">
                    <el-input v-model="aliasingData.aliasing" class="bt-aliasing"></el-input>
                </el-form-item>
                <el-form-item label="手续费:">
                    <el-input type="text" disabled v-model="aliasingData.serviceNo"></el-input>
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
                aliasingData: {
                    address: this.$route.params.address,
                    alias: this.$route.params.alias,
                    serviceNo: '0.01NULS'
                }
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            console.log(this.aliasingData.alias == null);
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            aliasingSubmit() {
                console.log('提交');
                var param = {"alias": "", "address": "", "password": ""}
                this.$post('/account/alias/', param)
                    .then((response) => {
                        if (response.success) {
                            this.$message({
                                type: 'success', message: "别名设置完成！"
                            });
                            //localStorage.setItem('newAccountAddress', response.data[0]);
                            this.$router.push({
                                path: '/firstInto/firstInfo/newAccount'
                            })
                        } else {
                            this.$message({
                                type: 'warning', message: "别名设置未完成！"
                            });
                        }
                    });
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