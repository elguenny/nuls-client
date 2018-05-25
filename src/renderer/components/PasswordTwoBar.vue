<template>
    <el-dialog title="" :visible.sync="passVisible" top="15vh" class="password-two-dialog" @open="passwordShow"
               @close="passwordClose">
        <h2>{{$t('message.setPassWord')}}</h2>
        <el-form :model="passForm" status-icon :rules="rulesPass" ref="passForm" class="set-pass">
            <el-form-item :label="$t('message.walletPassWord')" prop="pass" style="margin-bottom: 5px">
                <el-input type="password" v-model="passForm.pass" :maxlength=20></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.affirmWalletPassWord')" prop="checkPass" style="margin-bottom: 5px">
                <el-input type="password" v-model="passForm.checkPass" :maxlength=20></el-input>
            </el-form-item>
            <div class="set-pass-title">{{$t('message.passWordInfo')}}</div>
            <el-form-item>
                <el-button type="primary" @click="submitForm('passForm')" class="set-pass-submit" id="setPass">
                    {{$t('message.passWordAffirm')}}
                </el-button>
               <div class="new-no-pass" @click="noPassword">
                   {{$t('message.c159')}}
               </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
  export default {
    data () {
      let validatePass = (rule, value, callback) => {
        let patrn = /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{8,21}$/
        if (value === '') {
          callback(new Error(this.$t('message.walletPassWord1')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('message.walletPassWord1')))
        } else {
          if (this.passForm.checkPass !== '') {
            this.$refs.passForm.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('message.affirmWalletPassWordEmpty')))
        } else if (value !== this.passForm.pass) {
          callback(new Error(this.$t('message.passWordAtypism')))
        } else {
          callback()
        }
      }
      return {
        passVisible: false,
        passForm: {
          pass: '',
          checkPass: '',
        },
        rulesPass: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    created () {

    },
    methods: {

      //密码框显示执行事件
      passwordShow () {
        //this.$store.commit('setPasswordShow', true);
      },
      passwordClose () {
        //this.$store.commit('setPasswordShow', false)
      },
      //
      showPasswordTwo (boolean) {
        this.passForm.password = ''
        this.passVisible = boolean
      },

      /** Set the password for the user
       **/
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('toSubmit',this.passForm.checkPass)
            this.passVisible = false
          } else {
            return false
          }
        })
      },
      noPassword(){
        this.$emit('toSubmit',this.passForm.checkPass)
        this.passVisible = false
      }
    }
  }
</script>
<style lang="less">
    .password-two-dialog{
        .el-dialog{
            .el-dialog__header{}
            .el-dialog__body{
                h2{
                    line-height: 45px;
                }
                .set-pass{
                    .el-form-item{
                        margin-bottom: 5px;
                        .el-form-item__content{

                            .el-input__inner{
                                padding: 0 5px;
                                color: #FFFFFF;
                            }
                            .el-input__icon{
                                line-height: 27px;
                            }
                            text-align: center;
                            .el-button--primary{
                                margin-bottom: 30px;
                            }
                            .new-no-pass{
                                line-height: 28px;
                                font-size: 12px;
                                border: 1px solid #24426c;
                                width: 230px;
                                margin: 0 auto 30px;
                                &:hover{
                                    border-color: #c1c5c9;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                    .set-pass-title{
                        font-size: 12px;
                        padding: 25px 0;
                    }
                }
            }
        }
    }
</style>