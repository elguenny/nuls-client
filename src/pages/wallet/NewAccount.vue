<template>
  <div class="new-account">
    <Back :backTitle="this.$t('message.accountManagement')" v-show="!newOk"></Back>
    <div class="new-account-top">
      <h1 v-show="newOk"> {{$t('message.newAccountTitle')}}</h1>
      <h2>
        {{$t('message.newAccountAddress')}}：<span>{{ this.newAccountAddress }}</span>
        <i class="copy_icon cursor-p" @click="accountCopy(newAccountAddress)" :title="$t('message.c143')"></i>
      </h2>
    </div>
    <div @click="backupsKeyStore" class="keystore cursor-p">
      <span>{{$t('message.c181')}}</span>
      <label>{{$t('message.c182')}}<br/>{{$t('message.c183')}}</label>
    </div>
    <div @click="backupsKey" class="key text-d cursor-p">{{$t('message.c184')}}</div>

    <el-dialog title="" :visible.sync="keyDialogVisible" width="45%" center>
      <div class="key-dialog">
        <h1>{{$t('message.c185')}}</h1>
        <p>{{$t('message.c186')}}<br/>{{$t('message.c187')}}<br/>{{$t('message.c188')}}</p>
        <div class="key-info">
          {{this.inputKey}}
        </div>
        <el-button type="primary" @click="accountCopy(inputKey)">{{$t('message.c143')}}</el-button>
      </div>
    </el-dialog>
    <div class="cl new-bt">
      <el-button type="primary" class="new-submit" @click="newSubmit()">{{$t('message.newAccountSubmit')}}
      </el-button>
      <el-button type="primary" class="new-reset" v-show="newOk" @click="newReset()">
        {{$t('message.newAccountReset')}}
      </el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Back from '@/components/BackBar.vue'
  import CodeBar from '@/components/CodeBar.vue'
  import copy from 'copy-to-clipboard'

  export default {
    data() {
      return {
        keyShow: false,
        keyInfo: '',
        keyStoreInfo: [],
        newAccountAddress: this.$route.params.address === '' ? localStorage.getItem('newAccountAddress') : this.$route.params.address,
        codeShowOk: false,
        newOk: this.$route.params.newOk,
        //私钥弹框
        keyDialogVisible: false,
        //私钥
        inputKey: ''
      }
    },
    components: {
      Back,
      CodeBar
    },
    mounted() {
      let _this = this;
    },
    methods: {
      /**
       * 复制功能
       * copy
       */
      accountCopy(copyInfo) {
        copy(copyInfo);
        //javaUtil.copy(this.accountAddressValue);
        this.$message({
          message: this.$t('message.c129'), type: 'success', duration: '800'
        });
      },

      /**
       *备份KeyStore  backups KeyStore
       **/
      backupsKeyStore() {
        let params = '{"password":"' + localStorage.getItem('userPass') + '"}';
        this.getKeyStore('/account/export/' + this.newAccountAddress, params);
      },
      //获取 keyStore
      getKeyStore(url, params) {
        this.$post(url, params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              const content = '{"address":"' + response.data.address +
                '","encryptedPrivateKey":"' + response.data.encryptedPrivateKey +
                '","alias":"' + response.data.alias +
                '","pubKey":"' + response.data.pubKey +
                '","prikey":"' + response.data.prikey +
                '"}';
              const blob = new Blob([content]);
              const fileName = this.newAccountAddress + '.keystore';
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink)
              } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
              }
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg, duration: '800'
              });
            }
          })
      },

      // 下载文件
      download(data) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', '123456.keystore');

        document.body.appendChild(link);
        link.click()
      },


      /**
       * 备份私钥
       * Backups Key
       * @method backupsKey
       **/
      backupsKey() {
        this.keyDialogVisible = true;
        let params = '{"password":"' + localStorage.getItem('userPass') + '"}';
        this.getPrikey('/account/prikey/' + this.newAccountAddress, params);
      },
      //获取私钥
      getPrikey(url, params) {
        this.$post(url, params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.inputKey = response.data.value;
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg, duration: '800'
              });
            }
          })
      },
      /**
       * 完成备份提示跳转
       * New Submit
       * @method newSubmit
       **/
      newSubmit() {
        this.$confirm(this.$t('message.c110'), this.$t('message.c86'), {
          confirmButtonText: this.$t('message.c111'),
          cancelButtonText: this.$t('message.c112'),
        }).then(() => {
          if (localStorage.getItem('fastUser') === '0') {
            this.$router.push({
              path: '/wallet'
            })
          } else {
            this.$router.push({
              path: '/wallet/users/userInfo'
            })
          }
        })

      },
      /**
       * 不备份跳转
       * New Reset
       * @method newReset
       **/
      newReset() {
        this.$router.push({
          path: '/wallet'
        })
      }
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .new-account {
    width: 1024px;
    margin: auto;
    font-size: 14px;
    line-height: 1.6rem;
    .back {
      margin-left: 0;
    }
    .new-account-top {
      width: 100%;
      height: 110px;
      margin: 15px auto 10px;
      text-align: center;
      h1 {
        margin-top: 82pt;
        font-size: 20px;
      }
      h2 {
        width: 580px;
        font-size: 20px;
        margin: 10pt auto 0;
        span {
          color: #f5c757;
        }
        i {
          width: 30px;
          height: 20px;
          display: block;
          float: right;
          background-size: @bg-size;
          background: @bg-image
        }
        .copy_icon {
          background-position: -198px -46px;
        }
      }
    }
    .keystore {
      width: 285px;
      height: 270px;
      margin: 40pt auto 8pt;
      border: 1px solid #658cc5;
      background-color: #17202e;
      text-align: center;
      span {
        display: block;
        font-size: 16px;
        padding: 80px 0 0;
      }
      label {
        display: block;
        font-size: 14px;
        padding-top: 40px;
        text-align: center;
      }
    }
    .key {
      width: 280px;
      margin: auto;
      color: #3a8ee6;
      font-size: 16px;
      text-align: center;
    }
    .new-bt {
      width: 60%;
      margin: auto;
      padding-top: 20pt;
      button {
        display: block;
        width: 50%;
        margin: 5pt auto 0;
      }
      .new-submit {
      }
      .new-reset {
        background-color: #181f2f;
        border-color: #658cc5;
      }
    }

    .el-dialog__wrapper {
      .el-dialog--center {
        .el-dialog__body {
          text-align: center;
          .key-dialog {
            margin: 0 24pt;
            h1 {
              text-align: center;
              padding: 20pt 0 10pt;
              font-size: 20px;
            }
            p {
              text-align: left;
              font-size: 14px;
            }
            .key-info{
              background: #0b1422;
              border-radius: 0.05rem;
              height: 26px;
              border: 1px solid #24426c;
              margin: 8pt 0 20pt;
              text-align: left;
              font-size: 12px;
            }
            button {
              margin-bottom: 20pt;
            }
          }
        }
      }
    }

  }
</style>
