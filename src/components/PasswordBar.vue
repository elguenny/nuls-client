<template>
    <el-dialog title="" :visible.sync="passwordVisible" top="35vh" class="password-dialog" @open="passwordShow"
               @close="passwordClose">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" @submit.native.prevent>
            <!--<el-form-item :label="$t('message.passWordTitle')+':'" prop="password">-->
              <div style="padding: 20px 0;">{{$t('message.passWordTitle')}}</div>
              <el-form-item prop="password">
                <el-input v-model.focus="passwordForm.password" type="password" :autofocus="true" :maxlength="22"
                          id="passwords"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="passwordVisible = false">{{$t('message.cancelButtonText')}}</el-button>
            <el-button type="primary" @click="dialogSubmit('passwordForm')" id="passwordInfo">
                {{$t('message.confirmButtonText')}}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    props: {
        submitId: {
            type: String,
            default: "null"
        }
    },
    data () {
      let validatePass = (rule, value, callback) => {
        let patrn = /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{8,21}$/;
        if (value === '') {
          callback(new Error(this.$t('message.walletPassWord2')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('message.walletPassWord2')))
        } else {
          callback()
        }
      };
      return {
        passwordVisible: false,
        passwordShows: 0,
        passwordForm: {
          password: '',
        },
        passwordRules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ]
        },
      }
    },
    mounted () {
      let _this = this;
      let passwordShow = false;
      setInterval(() => {
        passwordShow = this.$store.getters.getPasswordShow;
        if(passwordShow){
          document.getElementById("passwords").focus();
        }
      }, 500);

      let clickId = this.submitId;
      document.onkeydown=function(e){
          let key=window.event.keyCode;
          if(key === 13){
             if(passwordShow){
                 document.getElementById('passwordInfo').click();
              }else {
                 if(clickId !=="null"){
                     document.getElementById(clickId).click();
                 }
              }
          }
      }
    },
    methods: {
      //密码框显示执行事件
      passwordShow () {
        this.$store.commit('setPasswordShow', true);
        //this.$refs['passwordForm'].resetFields();
        //document.getElementById("passwords").focus();
      },
      passwordClose () {
        this.$store.commit('setPasswordShow', false)
        //this.$refs['passwordForm'].resetFields()
      },
      //
      showPassword (boolean) {
        this.$store.commit('setPasswordShow', false);
        this.passwordForm.password = '';
        this.passwordVisible = boolean
      },
      //弹出密码输入框
      dialogSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('toSubmit', this.passwordForm.password);
            //this.$refs[formName].resetFields()
            this.passwordVisible = false;
            this.submitId = 'null'
          } else {
            console.log('error submit!!');
            this.$refs[formName].resetFields();
            return false
          }
        })
      },
    }
  }
</script>

<style lang="less">
  .password-dialog{
    .el-dialog{
      width: 370px;
      .el-dialog__body{
        .el-form{
          .el-form-item{
            .el-form-item__label{
              line-height: 0;
              padding: 28px 0 20px 0;
            }
          }
        }
      }
    }
  }

    input[type="text"], input[type="password"], select {
        padding: 0 2px;
    }
</style>
