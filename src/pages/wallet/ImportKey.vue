<template>
    <div class="import-key">
        <Back :backTitle="this.$t('message.inportAccount')"></Back>
        <h2>{{$t('message.key')}}</h2>
        <el-form ref="keyData" :model="keyData" :rules="keyRules" label-position="top">
            <el-form-item :label="$t('message.keyLow')" prop="keyInfo">
                <el-input type="textarea" v-model.trim="keyData.keyInfo" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="keySubmit('keyData')" id="importKey">
                    {{$t('message.confirmButtonText')}}
                </el-button>
            </el-form-item>
        </el-form>
        <PasswordTow ref="passTwo" @toSubmit="toSubmit"></PasswordTow>
    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import PasswordTow from '@/components/PasswordTwoBar.vue'

  export default {
    data () {
      return {
        submitId: 'importKey',
        encrypted:false,
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
      PasswordTow,
    },
    methods: {
      //提交导入明文私钥
      keySubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs.passTwo.showPasswordTwo(true)
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      //
      toSubmit (password) {
        let params = '';
        if(password === ''){
          params = '{"priKey":"' + this.keyData.keyInfo + '","password":""}'
        }else{
          params = '{"priKey":"' + this.keyData.keyInfo + '","password":"' + password + '"}';
          this.encrypted = true
        }
        this.$post('/account/import/pri', params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              //导入的新账户默认为当前账户
              localStorage.setItem('newAccountAddress', response.data.value);
              localStorage.setItem('encrypted', this.encrypted.toString());
              this.getAccountList('/account');
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              })
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.data.msg
              })
            }
            this.passwordVisible = false
          })
          .catch(err => {
            //console.log(err);
            this.getAccountList('/account');
            this.$message({
              type: 'success', message: this.$t('message.c197'), duration: '3000'
            })
          })
      },
      //获取账户地址列表
      getAccountList (url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              this.$store.commit('setAddressList', response.data.list);
              if(response.data.list.length === 1){
                localStorage.setItem('newAccountAddress', response.data.list[0].address);
                localStorage.setItem('encrypted', response.data.list[0].encrypted);
                this.$router.push({
                  name: '/wallet'
                })
              }else {
                this.$router.push({
                  name: '/userInfo',
                  params: {'address':response.data},
                })
              }

            }
          }).catch((reject) => {
          console.log('User List err' + reject)
        })
      },
    }
  }
</script>

<style lang="less">
    .import-key {
      width: 1024px;
      margin: auto;
        h2 {
            text-align: center;
            line-height: 3rem;
        }
        form {
            width: 60%;
            margin: auto;
            .el-form-item__label {
                line-height: 10px;
                color: #FFFFFF;
            }
        }
        .el-textarea__inner {
            background-color: #17202e;
            padding: 0 2px;
            color: #FFFFFF;
        }
        .el-form-item__content {
            text-align: center;
        }
        .el-form-item.is-required .el-form-item__label:before {
            font-size: 0;
        }
    }
</style>
