<template>
  <div class="edit-aliasing">
    <Back :backTitle="this.$t('message.accountManagement')"></Back>
    <div class="edit-info">
      <h2>{{$t('message.c100')}}</h2>
      <el-form :model="aliasForm" :rules="aliasRules" ref="aliasForm" @submit.native.prevent>
        <div class="edit-aliasing-bg">
          <p><i></i>{{$t('message.c103')}}</p>
          <p><i></i>{{$t('message.c170')}}</p>
        </div>
        <el-form-item :label="$t('message.c102')+'：'" class="label-aliasing">
          <el-input v-model="this.address" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c104')+'：'" class="label-aliasing" prop="alias">
          <span class="yue">{{$t('message.currentBalance') }}: {{this.usable}} NULS</span>
          <el-input v-model="aliasForm.alias" class="bt-aliasing"
                    :placeholder="$t('message.c105')" :maxlength="20" @change="countFee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.c28')+': '+this.fee+' NULS'" class="procedure">
        </el-form-item>
        <div class="allNuls">{{$t('message.c171')}}: {{parseFloat(this.allFee.toString())}} NULS</div>
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
        //console.log(value.replace(/[^\x00-\xff]/g, '01').length);
        let re = /^(?!_)(?!.*?_$)[a-z0-9_]+$/;
        //console.log(!re.exec(value));
        if (this.usable >= 1.01) {
          if (!value || !re.exec(value)) {
            callback(new Error(this.$t('message.c1041')))
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
        fee: 0.00,
        allFee: 1.00,
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
      let _this = this;
      this.getBalanceAddress('/accountledger/balance/' + this.address)
    },
    methods: {
      //根据账户地址获取账户余额
      getBalanceAddress(url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.usable = parseFloat(leftShift.times(response.data.usable.value).toString())
              //this.usable = response.data.usable * 0.000000001
            } else {
              this.usable = 0
            }
          })
      },
      /**
       *计算手续费
       *Calculation fee
       **/
      countFee() {
        if (this.aliasForm.alias !== '') {
          let params = "address=" + this.address
            + "&alias=" + this.aliasForm.alias;
          //console.log("params=" + params);
          this.$fetch('/account/alias/fee?' + params)
            .then((response) => {
              //console.log(response);
              if (response.success) {
                let leftShift = new BigNumber(0.00000001);
                this.fee = leftShift.times(response.data.value);
                let Bplsus = new BigNumber(1);
                this.allFee = Bplsus.plus(this.fee);
              }
            });
        }
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
            //console.log(response);
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
              })
            }
          })
      }

    }
  }
</script>
<style lang="less">
  .edit-aliasing {
    width: 1024px;
    margin: auto;
    .edit-info {
      width: 90%;
      margin: auto;
      h2 {
        text-align: center;
        line-height: 3rem;
      }
      .aliasing-submit {
        text-align: center;
        button {
          width: 60%;
          margin-top: 30px;
        }
      }
      .div-text {
        font-size: 14px;
        line-height: 30px;
        color: #e3dddd;
      }
      .el-form {
        .edit-aliasing-bg {
          background-color: #222d3f;
          padding: 10px 0 10px 25px;
          margin-bottom: 20px;
          p {
            i {
              width: 5px;
              height: 5px;
              background-color: #ffffff;
              border-radius: 5px;
              margin-top: 12px;
              margin-right: 5px;
              display: block;
              float: left;
            }
            font-size: 14px;
            line-height: 26px;
          }
        }
        .el-form-item {
          margin-bottom: 15px;
          .el-form-item__label {
            line-height: 28px;
          }
          .el-form-item__content {
            .yue {
              font-size: 12px;
              float: right;
            }
            line-height: 28px;
            .is-disabled {
              .el-input__inner {
                border: 1px solid #658ec7;
                color: #FFFFFF;
                background: #0b1422;
              }
            }
          }
        }
        .allNuls {
          text-align: center;
          font-size: 16px;
        }
        .procedure {
          label {
            margin-left: 0;
            text-align: left;
          }
        }
      }

      .bt-aliasing .el-input__inner {
        border: 1px solid #24426c;
        color: #FFFFFF;
      }
      .el-input__inner:hover {
        border: 1px solid #658ec7;
      }
      .el-form-item__label {
        color: white;
      }
    }
  }

</style>
