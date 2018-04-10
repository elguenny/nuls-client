<template>
    <el-dialog title="" :visible.sync="passwordVisible" top="35vh" class="password-dialog" @open="passwordShow" @close="passwordClose">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
            <el-form-item :label="$t('message.passWordTitle')+':'" prop="password">
                <el-input v-model="passwordForm.password" type="password" :autofocus="true" :maxlength="22"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="passwordVisible = false">{{$t('message.cancelButtonText')}}</el-button>
            <el-button type="primary" @click="dialogSubmit('passwordForm')" id="passwordInfo">{{$t('message.confirmButtonText')}}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                passwordVisible: false,
                passwordShows:0,
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
        created() {
            let  passwordShow = false;
            setInterval(()=>{
                passwordShow = this.$store.getters.getPasswordShow;
            },500);
            document.onkeydown=function(e){
                var key=window.event.keyCode;
                if(key === 13){
                   if(passwordShow){
                       document.getElementById('passwordInfo').click();
                    }else {
                        console.log(14);
                    }
                }
            }
        },
        methods: {
            //密码框显示执行事件
            passwordShow(){
                this.$store.commit("setPasswordShow",true);
            },
            passwordClose(){
                this.$store.commit("setPasswordShow",false);
            },
            //
            showPassword(boolean) {
                this.$store.commit("setPasswordShow",false);
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