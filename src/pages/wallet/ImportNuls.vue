<template>
    <div class="import-nuls">
        <Back :backTitle="this.$t('message.inportAccount')"></Back>
        <h2>{{$t("message.c146")}}</h2>
        <el-upload
                class="avatar-uploader"
                action="http://192.168.1.201:8001/posts/"
                :show-file-list="true"
                :limit="1"
                :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">{{$t("message.c147")}}</div>
        </el-upload>
        <el-button type="primary" @click="keyStoreSubmit" id="importKeystore">
            {{$t('message.confirmButtonText')}}
        </el-button>
        <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>
    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'

  export default {
    data () {
      return {
        imageUrl: '',
        keyStorePath: '',
        keyStoreInfo: '',
      }
    },
    components: {
      Back,
      Password,
    },
    methods: {
      //验证文件格式和大小  Verify file format and size
      beforeAvatarUpload (file) {
        const isType = file.name.substr(file.name.length - 8) === 'keystore';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message.error('上传只能是 keystore 格式文件!')
        } else if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        } else {
          this.keyStorePath = file.path
        }
        return isType && isLt2M
      },

      //提交导入明文私钥
      keySubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs.password.showPassword(true)
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      //确定导入 Determine the import

      keyStoreSubmit () {
        if (this.keyStorePath !== '') {
          this.$refs.password.showPassword(true)
        } else {
          this.$message.error('message.passWordFailed')
        }
      },

      //输入密码后提交
      toSubmit (password) {
        let fs = require('fs');
        let dataInfo = fs.readFileSync(this.keyStorePath, 'utf-8');
        let param = {
          accountKeyStoreDto: eval('(' + dataInfo + ')'),
          password: password,
        };
        this.postKeyStore('/account/import', param)
      },

      //导入keyStore import keyStore
      postKeyStore (url, params) {
        //console.log('url=' + url)
        //console.log('params=' + params)
        this.$post(url, params)
          .then((response) => {
            console.log(response);
            if (response.success) {
              localStorage.setItem('newAccountAddress', response.data);
              if (localStorage.getItem('toUserInfo') !== '1') {
                this.getAccountList('/account');
                this.$router.push({
                  name: '/wallet'
                })
              } else {
                this.$router.push({
                  path: '/wallet/users/userInfo'
                })
              }
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
              this.$store.commit('setAddressList', response.data.list)
            }
          })
      },
    }
  }
</script>

<style lang="less">
    .import-nuls {
        width: 90%;
        margin: auto;
        text-align: center;
        h2 {
            text-align: center;
            line-height: 3rem;
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

    }
</style>
