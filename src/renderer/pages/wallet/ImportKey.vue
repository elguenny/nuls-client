<template>
    <div class="import-key">
        <Back :backTitle="this.$t('message.inportAccount')"></Back>
        <h2>{{$t("message.key")}}</h2>
        <el-form ref="keyData" :model="keyData" :rules="keyRules" label-position="top">
            <el-form-item :label="$t('message.keyLow')" prop="keyInfo">
                <el-input type="textarea" v-model.trim="keyData.keyInfo" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="keySubmit('keyData')" id="importKey">{{$t('message.confirmButtonText')}}</el-button>
            </el-form-item>
        </el-form>
        <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import Password from '@/components/PasswordBar.vue';
    export default {
        data() {
            return {
                submitId:"importKey",
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
            Password,
        },
        methods: {
            //提交导入明文私钥
            keySubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs.password.showPassword(true);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //
            toSubmit(password) {
                let param = '{"prikey":"' + this.keyData.keyInfo + '","password":"' + password + '"}';
                this.$post('/wallet/import/', param)
                    .then((response) => {
                        if (response.success) {
                            localStorage.setItem('newAccountAddress', response.data);
                            localStorage.setItem('userPass', password);
                            if (localStorage.getItem('toUserInfo') !== "1") {
                                this.getAccountList("/account/list");
                                this.$router.push({
                                    name: '/wallet'
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
            },
            //获取账户地址列表
            getAccountList(url) {
                this.$fetch(url)
                    .then((response) => {
                        if(response.success){
                            this.$store.commit("setAddressList",response.data.list);
                        }
                    }).catch((reject) => {
                    console.log("User List err"+reject);
                });
            },
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
            padding: 0 2px;
            color: #FFFFFF;
        }
        .el-form-item__content {
            text-align: center;
            button {
                width: 30%;
            }
        }
        .el-form-item.is-required .el-form-item__label:before{
            font-size: 0;
        }
    }
</style>