<template>
  <div class="import-account" v-loading="importAccountLoading">
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
  </div>
</template>

<script>
  import Back from '@/components/BackBar.vue';
  import Password from '@/components/PasswordBar.vue'
  import {postImportKeystore,getAccountInfo} from '@/api/httpData.js'
  import {accountList} from '@/api/util.js'

  export default {
    data() {
      return {
        //定时获取文件路径
        fellPathSetInterval: null,
        encrypted: false,
        imageUrl: '',
        keyStorePath: '',
        keystoreInfo: '',
        importAccountLoading: false,
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
      keystore(){
        let _this = this;
        let obj = document.getElementById("fileId");
        obj.click();
        obj.onchange = function () {
          if (this.value !== '') {
            let file = obj.files[0];
            let suffixName = file.name.toLowerCase().split('.').splice(-1);
            console.log(file);
            console.log(file.name);
            console.log(suffixName);
          } else {
            _this.$message({
              type: 'warning', message:_this.$t('message.c194'), duration: '2000'
            })
          }
        }
      },

      /**
       * 读取keystore文件内容
       * read keystore files info
       * @param files
       **/
      readFiles(files) {
        let _this = this;
        //支持chrome IE10
        if (window.FileReader) {
          let file = files.files[0];
          let filename = file.name.split(".")[0];
          let reader = new FileReader();
          reader.onload = function () {
            //console.log(this.result);
            _this.keystoreInfo = this.result;
          };
          reader.readAsText(file);
        }
        //支持IE 7 8 9 10
        else if (typeof window.ActiveXObject !== 'undefined') {
          let xmlDoc;
          xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = false;
          xmlDoc.load(files.value);
          _this.keystoreInfo = xmlDoc.xml;
        }
        //支持FF
        else if (document.implementation && document.implementation.createDocument) {
          let xmlDoc;
          xmlDoc = document.implementation.createDocument("", "", null);
          xmlDoc.async = false;
          xmlDoc.load(files.value);
          _this.keystoreInfo = xmlDoc.xml;
        } else {
          alert('error');
        }
      },

      //回调关闭或取消
      toClose(boolean){
        if(!boolean){
          document.getElementById("fileId").value ='';
        }
      },

      //输入密码导入
      toSubmit(password) {
        let param = {
          accountKeyStoreDto: JSON.parse(this.keystoreInfo),
          password: password,
          overwrite: true
        };
        this.postKeyStore(param);
      },

      //导入keyStore import keyStore
      postKeyStore( params) {
        this.importAccountLoading = true;
        postImportKeystore(params)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              //导入的新账户默认为当前账户
              localStorage.setItem('newAccountAddress', response.data.value);
              localStorage.setItem('addressRemark', '');
              getAccountInfo(response.data.value).then((response) =>{
                //console.log(response);
                if (response.success) {
                  localStorage.setItem('addressAlias',response.data.alias);
                }
              });
              localStorage.setItem('encrypted', this.encrypted.toString());

              this.getAccountList();
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              })
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.data.msg
              })
            }
            this.importAccountLoading = false;
          })
          .catch(err => {
            //console.log(err);
            this.getAccountList();
            this.$message({
              type: 'success', message: this.$t('message.c197'), duration: '3000'
            });
            this.importAccountLoading = false;
          })
      },
      //获取账户地址列表
      getAccountList() {
        accountList()
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$store.commit('setAddressList', response.list);
              if (response.list.length === 1) {
                this.$router.push({
                  name: '/wallet'
                })
              } else {
                this.$router.push({
                  name: '/userInfo'
                })
              }
            }
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
