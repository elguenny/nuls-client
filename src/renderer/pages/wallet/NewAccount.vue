<template>
    <div class="new-account">
        <Back :backTitle="this.$t('message.accountManagement')" v-show="newOks"></Back>
        <div class="new-account-top">
            <h1 v-show="newOk" style="text-align: center"> {{$t('message.newAccountTitle')}}</h1>
            <h2>
                {{$t('message.newAccountAddress')}}：{{ this.newAccountAddress }}
            </h2>
            <div class="new-account-key">
                <h3 class="fl">
                    {{$t('message.newAccountKey')}}：
                    <input :type="keyShow ? 'text' : 'password'" v-model="keyInfo" readonly="readonly"
                           style="margin-left: -5px">
                </h3>
                <i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="keyShow = !keyShow"></i>
                <i class="" @click="keyCode"></i>
                <CodeBar v-show="codeShowOk " :keyInfo="keyInfo" v-on:codeShowOks="codeShowOks" ref="codeBar"></CodeBar>
            </div>
        </div>
        <ul>
            <li @click="backupsKey">
                <span>{{$t('message.newAccountBackupsKey')}}</span>
                <label>{{$t('message.newAccountBackupsKeyInfo')}}</label>
            </li>
            <!-- <li @click="backupsCode">
                 <span>{{$t("message.newAccountBackupsCode")}}</span>
                 <label>{{$t("message.newAccountBackupsCodeInfo")}}</label>
             </li>-->
        </ul>
        <div class="cl new-bt">
            <el-button type="primary" class="new-submit" @click="newSubmit()">{{$t('message.newAccountSubmit')}}
            </el-button>
            <el-button type="primary" class="new-reset" @click="newReset()" v-show="newOk">
                {{$t('message.newAccountReset')}}
            </el-button>
        </div>
    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import CodeBar from '@/components/CodeBar.vue'
  import { jquery } from '@/assets/js/jquery.min.js'
  import { jvectormap } from '@/assets/js/jquery.qrcode.min.js'

  export default {
    data () {
      return {
        keyShow: false,
        keyInfo: '',
        newAccountAddress: this.$route.params.address === '' ? localStorage.getItem('newAccountAddress') : this.$route.params.address,
        codeShowOk: false,
        newOk: this.$route.params.newOk,
        newOks: this.$route.params.newOk ? false : true,
      }
    },
    components: {
      Back,
      CodeBar
    },
    mounted () {
      let _this = this
      let params = '{"address":"' + this.newAccountAddress + '","password":"' + localStorage.getItem('userPass') + '"}'
      this.getPrikey('/account/prikey', params)
    },
    methods: {
      //获取私钥
      getPrikey (url, params) {
        this.$post(url, params)
          .then((response) => {
            if (response.success) {
              this.keyInfo = response.data
              this.passwordVisible = false
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg, duration: '800'
              })
              this.$router.push({
                path: '/wallet/users/userInfo'
              })
            }
          })

      },
      //二维码显示隐藏
      keyCode () {
        this.$refs.codeBar.codeMaker(this.keyInfo)
        this.codeShowOk = !this.codeShowOk
      },
      codeShowOks () {
        this.codeShowOk = false
      },

      /**
       * 备份私钥
       * Backups Key
       * @method backupsKey
       **/
      backupsKey () {
        let keyInfo = this.keyInfo
        const {dialog} = require('electron').remote
        dialog.showSaveDialog({
          properties: [
            'openFile',
          ],
          filters: [
            {name: 'All Files', extensions: ['*']},
          ]
        }, function (res) {
          let path = require('path')
          let _path = path.join(res + '.txt')
          let fs = require('fs')
          fs.writeFile(_path, keyInfo, function (err) {
            if (!err) {
              alert(res + '.txt')
            }
          })
        })
      },

      /**
       * 备份二维码
       * Backups Code
       * @method backupsCode
       **/
      backupsCode () {
        $('.qrcode').qrcode({
          render: 'canvas',
          width: 256,
          height: 256,
          text: this.keyInfo,
          typeNumber: -1,
          correctLevel: 2,
          background: '#ffffff',
          foreground: '#000000'
        })
        this.exportCanvasAsPNG($('.qrcode').find('canvas')[0], this.newAccountAddress + '_privateKey.png')
      },

      /**
       * 二维码保存到本地
       * Export Canvas As PNG
       * @method exportCanvasAsPNG
       **/
      exportCanvasAsPNG (canvas, fileName) {
        const {dialog} = require('electron').remote
        const {ipcRenderer} = require('electron')
        ipcRenderer.on('tips', (event, person) => {
        })
        dialog.showOpenDialog({
          defaultPath: '../Desktop',
          properties: [
            'openDirectory',
          ],
          filters: [
            {name: 'All', extensions: ['*']},
          ]
        }, function (res) {
          if (res[0] !== '') {
            var MIME_TYPE = 'image/png'
            var dlLink = document.createElement('a')
            dlLink.download = fileName
            dlLink.href = canvas.toDataURL('image/png')
            //var fs = require('fs');
            //fs.writeFileSync('code11.png', dlLink.href.slice('22'), 'utf8');
            let path = require('path')
            let _path = path.join(__dirname, process.execPath.substr(0, process.execPath.length - 14) + this.newAccountAddress + '_privateKey.png')
            //var _path = "D:/work/nuls-client/"+this.newAccountAddress+"_privateKey.png";
            ipcRenderer.send('download', _path + '+' + res[0])
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.href].join(':')
            document.body.appendChild(dlLink)
            dlLink.click()
            document.body.removeChild(dlLink)
            $('.qrcode').html('')
            alert(res)
          } else {
            alert(this.$t('message.c109'))
          }
        })
      },

      /**
       * 完成备份提示跳转
       * New Submit
       * @method newSubmit
       **/
      newSubmit () {
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
      newReset () {
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
        width: 88%;
        height: 100%;
        margin: auto;
        font-size: 14px;
        line-height: 1.6rem;
        .back {
            margin-left: 0;
        }
        .new-account-top {
            width: 86%;
            height: 110px;
            margin: 15px auto 10px;
            text-align: left;
            h1 {
                padding: 1.2rem 0;
                font-size: 16px;
                font-weight: 500;
            }
            h2 {
            }
            .new-account-key {
                width: 125%;
                margin: auto;
                text-align: left;
                h3 {
                    width: 72%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    input {
                        width: 100%;
                        border: none;
                    }
                }
                .icon {
                    width: 30px;
                    height: 20px;
                    display: block;
                    float: left;
                    background-size: @bg-size;
                    background: @bg-image
                }
                .icon-eye {
                    background-position: -159px -46px;
                }
                .icon-eye-blocked {
                    background-position: -226px -77px;
                }
                .modal-overlay {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    z-index: 1000;
                    background-color: #333;
                    opacity: 0.85;
                }
                .modal-data {
                    width: 100%;
                    height: 100%;
                    padding: 100px auto;
                    text-align: center;
                    .qrcode {
                        padding: 20% 0 0 0;
                    }
                }
            }
        }
        ul {
            width: 65%;
            height: 50%;
            margin: 20px auto 0;

            li {
                width: 42%;
                height: 11rem;
                float: left;
                margin-right: 3%;
                //margin-left: 4%;
                margin-left: 29%;
                border: 1px solid #658cc5;
                background-color: #181f2f;
                text-align: center;
                span {
                    display: block;
                    font-size: 1rem;
                    padding: 1.2rem 0;
                }
                label {
                    display: block;
                    font-size: 0.8rem;
                    padding: 0 0.5rem;
                    text-align: center;
                }
            }
            li:last-child {
            }
        }
        .new-bt {
            width: 60%;
            margin: auto;
            padding-top: 2%;
            button {
                display: block;
                width: 50%;
                margin: 5% auto 0;

            }
            .new-submit {
            }
            .new-reset {
                background-color: #181f2f;
                border-color: #658cc5;
            }
        }

    }
</style>