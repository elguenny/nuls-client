<template>
    <div class="edit-aliasing">
        <Back :backTitle="this.$t('message.accountManagement')"></Back>
        <div class="edit-info">
            <h2>{{$t('message.c100')}}</h2>
            <el-form :model="aliasForm" :rules="aliasRules" ref="aliasForm" @submit.native.prevent>
                <div class="div-text" style="text-align: center">
                    <label>{{$t('message.c102')}}:</label>{{this.address}}
                </div>
                <div class="div-text">{{$t('message.c103')}}</div>
                <el-form-item :label="$t('message.c104')+'：'" class="label-aliasing" prop="alias"
                              style="margin-top: 30px">
                    <el-input v-model="aliasForm.alias" class="bt-aliasing"
                              :placeholder="$t('message.c105')" :maxlength="30"></el-input>
                </el-form-item>
                <div class="div-text">
                    <label>{{$t('message.miningFee1')}}:</label>1.01NULS
                </div>
                <el-form-item class="aliasing-submit">
                    <el-button type="primary" @click="aliasingSubmit('aliasForm')" id="aliasAliasing">
                        {{$t('message.confirmButtonText')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import {BigNumber} from 'bignumber.js'

  export default {
    data() {
      let aliasing = (rule, value, callback) => {
        console.log(value.replace(/[^\x00-\xff]/g, '01').length);
        if (this.usable >= 1.01) {
          if (value === '') {
            callback(new Error(this.$t('message.c104')))
          } else if (value.replace(/[^\x00-\xff]/g, '01').length > 30) {
            callback(new Error(this.$t('message.c106')))
          } else {
            callback()
          }
        } else {
          callback(new Error(this.$t('message.c107')))
        }
      };
      return {
        submitId: 'aliasAliasing',
        address: this.$route.params.address,
        encrypted: this.$route.params.encrypted,
        usable: 0,
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
      Password,
    },
    mounted() {
      let _this = this
      this.getBalanceAddress('/account/balance/' + this.address)
    },
    methods: {
      //根据账户地址获取账户余额
      getBalanceAddress(url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.usable = parseFloat(leftShift.times(response.data.usable).toString())
              //this.usable = response.data.usable * 0.000000001
            } else {
              this.usable = 0
            }
          })
      },
      //修改别名
      aliasingSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.encrypted) {
              this.$refs.password.showPassword(true)
            } else {
              this.$confirm(this.$t('message.c164'), '', {
                confirmButtonText: this.$t('message.confirmButtonText'),
                cancelButtonText: this.$t('message.cancelButtonText')
              }).then(() => {
                let param = {'alias': this.aliasForm.alias, 'password': ''};
                this.aliasing('/account/alias/' + this.address, param)
              }).catch(() => {

              })
            }

          }
        })
      },
      //
      toSubmit(password) {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
          let param = {'alias': this.aliasForm.alias, 'password': password};
          this.aliasing('/account/alias/' + this.address, param)
        } else {
          this.$message({
            message: this.$t('message.c133'),
          })
        }
      },
      aliasing(url, param) {
        this.$post(url, param)
          .then((response) => {
            console.log(response);
            if (response.success) {
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              })
              this.$router.push({
                name: '/userInfo'
              })
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg
              })
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
                color: #FFFFFF;
            }
            .el-input__inner:hover {
                border: 1px solid #658ec7;
            }
            /**placeholder**/
            ::-webkit-input-placeholder {
                color: #8a929b;
            }
            .el-form-item__label {
                color: white;
            }
        }
    }

</style>