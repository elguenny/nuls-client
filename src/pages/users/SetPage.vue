<template>
  <div class="set-page">
    <h2>{{$t('message.c66')}}</h2>
    <div class="set-page-info">
      <div class="set-page-div">
        <label>{{$t('message.c75')}}：</label>
        <SelecBar @select="selectLanguage" :selectedValue="projectName" :dataList="languageItem"
                  :widthData="widthData"></SelecBar>
        <!--<span class="cursor-p set-page-div-span" @click="toBackups">{{$t('message.c74')}}</span>-->
      </div>
      <div class="set-page-div">
        <label>{{$t('message.c73')}}：</label>
        <span class="cursor-p set-page-div-span" @click="toBackups">{{$t('message.c74')}}</span>
      </div>
      <div class="set-page-div">
        <label>{{$t('message.c77')}}：</label>
        <span class="cursor-p set-page-div-span" @click="toUserAddressList">{{$t('message.c78')}}</span>
      </div>
      <div class="set-page-div">
        <label>{{$t('message.c79')}}：</label>
        <span class="cursor-p set-page-div-span" @click="toEditPassword "> {{this.encrypted ? $t('message.c160'):$t('message.c161')}}</span>
      </div>
      <div class="set-page-div">
        <label>{{$t('message.c81')}}：V{{this.clientVersionData.myVersion}}</label>
        <span class="cursor-p set-page-div-span" @click="versionUpdates"
              v-show="this.percentageNumber !==100 ? true:false">{{$t('message.c82')}} {{this.clientVersionData.newestVersion}}</span>
        <span class="cursor-p set-page-div-span" @click="outRestart" v-show="this.percentageNumber ===100 ? true:false">{{$t('message.c180')}}</span>
      </div>
    </div>
    <el-dialog :title="$t('message.c151')"
               :visible.sync="outerVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               custom-class="version-dialog"
               :show-close="this.type !== 3"
               top="30vh"
               :center="true">
      <div class="progress-info">
        <h2>{{this.tips}}</h2>
        <div class="progress" v-show="this.type === 3 ">
          <el-progress :percentage=this.downloadPercent v-show="false"></el-progress>
          <p>{{$t('message.c152')}}</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-show="this.type === 3 ">
        <el-button type="primary" @click="outerVisible = false">{{$t('message.c153')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SwitchAddressBar from '@/components/SwitchAddressBar.vue'
  import SelecBar from '@/components/SelecBar.vue'

  export default {
    data() {
      return {
        //languageItem
        languageItem: [
          {
            key: 'cn',
            value: '中文'
          },
          {
            key: 'en',
            value: 'English'
          }
        ],
        //select language initial info
        projectName: {
          key: 'en',
          value: 'English'
        },
        //select language initial width
        widthData: '100%',
        outerVisible: false,
        type: 0,
        tips: '',
        downloadPercent: 0,
        encrypted: false,

        //版本信息
        clientVersionData: [],
        //进度条
        percentageNumber: 0,

      }
    },
    components: {
      SwitchAddressBar,
      SelecBar,
    },
    beforeCreate() {

    },
    created() {
      if (localStorage.getItem('encrypted') === "true") {
        this.encrypted = true;
      } else {
        this.encrypted = false;
      }
      this.projectName.value = localStorage.getItem('language') === 'cn' ? '中文' : 'English';
      this.clientVersion();
      this.clientUpgrade();
    },
    destroyed() {

    },
    methods: {
      //语言切换
      selectLanguage() {
        this.$i18n.locale = this.projectName.key;
        let param = '';
        if (this.projectName.key !== 'en') {
          param = 'zh-CHS'
        } else {
          param = this.projectName.key
        }
        this.$put('/sys/lang/' + param)
          .then((response) => {
            if (response.success) {
              //console.log('success')
            } else {
              //console.log('err')
            }
          })
      },
      //去备份
      toBackups() {
        sessionStorage.setItem('isActive',1);
        this.$router.push({
          name: '/userInfo'
        })
      },
      //通讯录管理
      toUserAddressList() {
        this.$router.push({
          path: '/users/userAddressList'
        })
      },
      //修改密码
      toEditPassword() {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
          if (this.encrypted) {
            this.$router.push({
              name: '/editorPassword',
              params: {address: localStorage.getItem('newAccountAddress'), backInfo: this.$t('message.setManagement')},
            })
          } else {
            this.$router.push({
              name: '/setPassword',
              params: {address: localStorage.getItem('newAccountAddress'), backInfo: this.$t('message.setManagement')},
            })
          }
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }

      },
      /**
       * 查询版本是否可更新
       */
      clientVersion() {
        this.$fetch('/client/version')
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.clientVersionData = response.data
            }
          })
      },
      //版本更新
      versionUpdates() {
        if (this.clientVersionData.upgradable) {
          this.$router.push({
            name: '/updatedVersion'
          });
        }
      },
      /**
       *获取下载进度
       **/
      clientUpgrade() {
        this.$fetch('/client/upgrade')
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.percentageNumber = response.data.percentage;
            }
          })
      },
      /**
       * 退出重启
       */
      outRestart() {
        this.$post('/client/restart')
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                type: 'success', message: this.$t('message.passWordSuccess')
              });
              this.closeBrowser();
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg
              })
            }
          });
      },
      //关闭浏览器
      closeBrowser() {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
          if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
          } else {
            window.open('', '_top');
            window.top.close();
          }
        } else if (navigator.userAgent.indexOf("Firefox") > 0) {
          window.location.href = 'about:blank ';
        } else {
          window.location.href = "about:blank";
          window.opener = null;
          window.open('', '_self', '');
          window.close();
          console.log('guangg')
        }
      },
    }
  }
</script>

<style lang="less">
  .set-page {
    width: 500px;
    margin: auto;
    h2 {
      margin-top: 30px;
      font-size: 16px;
      text-align: center;
      line-height: 35px;
    }
    .set-page-info {
      margin-top: 15px;
      .set-page-div {
        color: #C1C5C9;
        font-size: 12px;
        line-height: 27px;
        label {
          display: block;
        }
        .base-select {
          width: 100%;
          text-align: center;
          margin-top: 6px;
          .sub-selected-value {
            width: 100%;
            border: 1px solid #24426c;
            ul {
              margin-left: 0;
              background-color: #1c2738;
              li {
                width: 100%;
                right: 0;
                border-bottom: 1px dotted #24426c;
              }
            }
          }
        }
        .set-page-div-span {
          display: block;
          width: 100%;
          border: 1px solid #24426c;
          text-align: center;
        }
        .el-input--suffix .el-input__inner {
          height: 27px;
          width: 311px;
        }
        .set-page-div-span:hover {
          color: #FFFFFF;
          border-color: #658ec7;
        }
      }
      .el-switch {
        border: 1px solid #1c2738;
        background-color: #17202e;
        height: 27px;
        line-height: 27px;
      }
      .el-switch__label.is-active,
      .el-switch__label--left {
        width: 270px;
        line-height: 24px;
        height: 24px;
      }
      .el-switch__label * {
        line-height: 24px;
        font-size: 12px;
        color: #C1C5C9;
        padding-left: 8px;
      }
      .el-switch__core {
        width: 30px;
        height: 15px;
        border: 1px solid #658ec7;
        .el-switch__button {
          top: 0;
          left: 1px;
          width: 13px;
          height: 13px;
        }
      }
      .is-checked {
        .el-switch__core {
          .el-switch__button {
            left: 5px;
          }
        }
      }
      .el-collapse {
        border: none;
        min-height: 45px;
        line-height: 27px;
      }
      .el-collapse-item__header {
        height: 0;
        border: none;
      }
      .el-collapse-item__arrow {
        font-size: 0;
      }
      .el-collapse-item__wrap {
        margin-top: 38px;
        border: none;
      }
      .el-collapse-item__content {
        background-color: #0c1323;
        padding: 5px 0 10px 0;
        ul {
          li {
            width: 60%;
            margin: auto;
            .el-switch__label.is-active,
            .el-switch__label--left {
              width: 150px;
            }
            .el-switch {
              background-color: #0c1323;
              border: none;
            }
          }
        }
      }
    }
    .el-select-dropdown__list {
      width: 310px;
    }
    .version-dialog {
      width: 70%;
      .el-dialog__header {
        padding: 20px 0 0 0;
        .el-dialog__title {
          color: #FFFFFF;
          font-size: 16px;
        }
      }
      .el-dialog__body {
        .progress-info {
          h2 {
            font-size: 14px;
            line-height: 32px;
            text-align: center;
          }
          .progress {
            width: 75%;
            margin: 0 0 0 13%;
            height: 80px;
            p {
              font-size: 12px;
              color: #c1c5c9;
              line-height: 32px;
              text-align: center;
            }
          }
        }
      }
      .el-dialog__footer {
        padding: 0 0 20px;
      }
    }
  }
</style>
