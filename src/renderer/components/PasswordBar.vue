<template>
    <el-dialog title="" :visible.sync="passwordVisible" top="35vh" class="password-dialog">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
            <el-form-item :label="$t('message.passWordTitle')+':'" prop="password">
                <el-input v-model="passwordForm.password" type="password" :autofocus="true"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="passwordVisible = false">{{$t('message.cancelButtonText')}}</el-button>
            <el-button type="primary" @click="dialogSubmit('passwordForm')">{{$t('message.confirmButtonText')}}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
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
            showPassword(boolean) {
                this.passwordForm.password = '';
                this.passwordVisible = boolean;
            },
            //弹出密码输入框
            dialogSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('toSubmit', this.passwordForm.password);
                        this.passwordVisible = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
        }
    }
</script>

<style>
    .password {
        margin-top: 5rem;
    }
    input[type="text"], input[type="password"], select{
        padding: 0 2px;
    }
</style>