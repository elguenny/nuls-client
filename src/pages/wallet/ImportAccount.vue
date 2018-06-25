<template>
  <div class="import-account">
    <Back :backTitle="this.$t('message.firstInfoTitle')"></Back>
    <h1>{{$t("message.inportAccount")}}</h1>
    <input type="file" id="fileId" class="hidden">
    <p id="preview" class="hidden" value=""></p>
    <div class="keystore" @click="keystore">
      <h1>{{$t('message.c189')}}</h1>
      <p>{{$t('message.c190')}}<br>{{$t('message.c191')}}</p>
      <h3 v-show="false">
        {{$t('message.c192')}}
      </h3>
    </div>
    <div class="key text-d cursor-p" @click="importKey">{{$t('message.c193')}}</div>
    <!--<PasswordTow ref="passTwo" @toSubmit="toSubmit"></PasswordTow>-->
    <Password ref="password" @toSubmit="toSubmit"></Password>
  </div>
</template>

<script>
  import Back from '@/components/BackBar.vue';
  import Password from '@/components/PasswordBar.vue'

  export default {
    data() {
      return {
        //定时获取文件路径
        fellPathSetInterval: null,
        encrypted:false,
        imageUrl: '',
        keyStorePath: '',
        keyStoreInfo: {},
      }
    },
    components: {
      Back,
      Password,
    },
    mounted() {

    },
    methods: {
      /**
       * 导入keystore
       **/
      keystore() {
        let obj = document.getElementById("fileId");
        obj.click();
        let fellPath = '';
        //定时获取文件路径
        this.fellPathSetInterval = setInterval(() => {
          fellPath = this.getFullPath(obj);
          if (fellPath !== '') {
            let obj = document.getElementById("fileId");
            let p = document.querySelector('#preview');
            if (window.FileReader) {
              let file = obj.files[0];
              let suffixName = file.name.toLowerCase().split('.').splice(-1);
              if (suffixName[0] === 'keystore') {
                if (window.FileReader) {
                  let file = obj.files[0];
                  let reader = new FileReader();
                  reader.onload = function () {
                    p.innerHTML = this.result;
                  };
                  reader.readAsText(file);
                  //定时导入
                  setTimeout(() => {
                    let params = JSON.parse(p.innerHTML);
                    this.keyStoreInfo = {
                      address: params.address === "null" ? null : params.address,
                      encryptedPrivateKey: params.encryptedPrivateKey === "null" ? null : params.encryptedPrivateKey,
                      alias: params.alias === "null" ? null : params.alias,
                      pubKey: params.pubKey === "null" ? null : params.pubKey,
                      prikey: params.prikey === "null" ? null : params.prikey
                    };
                    if (JSON.parse(p.innerHTML).encryptedPrivateKey !== 'null') {
                      this.encrypted = true;
                      this.$refs.password.showPassword(true);
                    } else {
                      let param = {
                        accountKeyStoreDto: this.keyStoreInfo,
                        password: '',
                        overwrite: false
                      };
                      this.postKeyStore('/account/import', param);
                    }
                  }, 500)
                }
              } else {
                obj.outerHTML = obj.outerHTML;
                this.$message({
                  type: 'warning', message: this.$t('message.c194'), duration: '800'
                })
              }
            }
            clearInterval(this.fellPathSetInterval)
          }
        }, 500);
      },

      //读取本地文件
      upload(input) {
        //支持chrome IE10
        if (window.FileReader) {
          let file = input.files[0];
          let filename = file.name.split(".")[0];
          let reader = new FileReader();
          reader.onload = function () {
            return this.result
          };
          reader.readAsText(file);
        }
        return true;
        //支持IE 7 8 9 10
        /*else if (typeof window.ActiveXObject !== 'undefined') {
          let xmlDoc;
          xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = false;
          xmlDoc.load(input.value);
          //alert(xmlDoc.xml);
          //this.keyStoreInfo = xmlDoc.xml
        }*/
        //支持FF
        /*else if (document.implementation && document.implementation.createDocument) {
          let xmlDoc;
          xmlDoc = document.implementation.createDocument("", "", null);
          xmlDoc.async = false;
          xmlDoc.load(input.value);
          //alert(xmlDoc.xml);
          //this.keyStoreInfo = xmlDoc.xml
        } else {
          alert('error');
        }*/
      },
      //判断是否选择文件
      getFullPath(obj) {
        if (obj) {
          //ie
          if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select();
            return document.selection.createRange().text;
          }
          //firefox
          else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
            if (obj.files) {
              return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
          }
          return obj.value;
        }
      },

      //输入密码导入
      toSubmit(password) {
        let param = {
          accountKeyStoreDto: this.keyStoreInfo,
          password: password,
          overwrite: false
        };
        this.postKeyStore('/account/import', param);
        let obj = document.getElementById("fileId");
        obj.outerHTML = obj.outerHTML;
      },

      //导入keyStore import keyStore
      postKeyStore(url, params) {
        this.$post(url, params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let p = document.querySelector('#preview');
              p.innerHTML = '';
              //导入的新账户默认为当前账户
              localStorage.setItem('newAccountAddress', response.data.value);
              localStorage.setItem('encrypted', this.encrypted.toString());

              this.getAccountList('/account');
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              })
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg
              })
            }
          })
      },
      //获取账户地址列表
      getAccountList (url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              this.$store.commit('setAddressList', response.data.list);
              if(response.data.list.length === 1){
                this.$router.push({
                  name: '/wallet'
                })
              }else {
                this.$router.push({
                  name: '/userInfo',
                  params: {'address':response.data},
                })
              }
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              })
            }
          }).catch((reject) => {
          console.log('User List err' + reject)
        })
      },

      /**
       * 导入私钥
       */
      importKey() {
        this.$router.push({
          path: '/firstInto/firstInfo/importKey'
        })
      },
    }
  }
</script>

<style lang="less">
  .import-account {
    width: 1024px;
    margin: auto;
    text-align: center;
    font-size: 0.9rem;
    line-height: 1.6rem;
    h1 {
      line-height: 3rem;
      font-size: 16px;
      font-weight: 500;
    }
    .avatar-uploader {
      text-align: center;
      margin-top: 3rem;
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
    .keystore {
      width: 280px;
      height: auto;
      margin: 28pt auto;
      border: 1px solid #1e314d;
      background-color: #181f2f;
      text-align: center;
      cursor: pointer;
      h1 {
        font-size: 16px;
        margin: 48px 0 20pt;
      }
      p {
        font-size: 12px;
        margin-bottom: 48pt;
      }
      h3 {

      }
      &:hover {
        cursor: pointer;
        border-color: #658ec7;
      }

    }
    .key {
      width: 280px;
      margin: 20pt auto 0;
      color: #3a8ee6;
      font-size: 16px;
    }

  }
</style>
