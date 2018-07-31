<template>
  <div class="updated-version">
    <Back :backTitle="this.$t('message.setManagement')"></Back>
    <div class="updated-info" v-show="!updatedOver">
      <h1>{{this.$t('message.c175')}}</h1>
      <p>{{this.$t('message.purseVersion')}}:V{{this.clientVersionData.newestVersion}}</p>
      <h3 v-html=this.clientVersionData.infromation>
      </h3>
      <div class="updated-info-bt" v-show="!this.percentageShow">
        <el-button type="primary" @click="toUpdated">{{this.$t('message.c176')}}</el-button>
      </div>
      <div class="updated-info-per" v-show="this.percentageShow">
        <el-progress :text-inside="true" :stroke-width="16" :percentage=this.percentageNumber
                     color="#67c23a"></el-progress>
        <i class="el-icon-close cursor-p" @click="suspend"></i>
      </div>
    </div>
    <div class="updated-info-over" v-show="updatedOver">
      <h1>{{this.$t('message.c175')}}</h1>
      <p>{{this.clientVersionData.newestVersion}}</p>
      <p>{{this.$t('message.c177')}}</p>
      <div class="updated-info-bt">
        <el-button type="primary" @click="outRestart" id="closeBt">{{this.$t('message.c178')}}</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import Back from '@/components/BackBar.vue'

  export default {
    data() {
      return {
        //进度条显示和进度数
        percentageShow: false,
        percentageNumber: 0,
        //循环执行数
        executionNumber:0,
        //定时器
        toUpdatedInterval: null,
        percentageInterval: null,
        percentageTwoInterval:null,
        //下载完成显示
        updatedOver: false,
        //版本信息
        clientVersionData: [],
      }
    },
    components: {
      Back,
    },
    created() {
      //0.5秒循环进度
      this.percentageInterval = setInterval(() => {
        if (this.percentageNumber === 100) {
          clearInterval(this.toUpdatedInterval);
          this.updatedOver = true;
          this.percentageNumber = 0;
          sessionStorage.setItem('percentageNumber', this.percentageNumber.toString());
          clearInterval(this.percentageInterval);
        }
      }, 500);
      this.clientVersion();
    },
    mounted() {
      let _this = this;
      setTimeout(() => {
        if (parseInt(sessionStorage.getItem('percentageNumber')) > 0) {
          this.percentageShow = true;
          this.percentageTwoInterval = setInterval(() => {
            this.clientUpgrade();
            //this.percentageNumber =this.percentageNumber+10
          }, 500)
        }
      }, 100);

    },
    destroyed() {
      clearInterval(this.toUpdatedInterval);
      clearInterval(this.percentageInterval);
      clearInterval(this.percentageTwoInterval);
    },
    methods: {
      /**
       * 查询版本是否可更新
       */
      clientVersion() {
        this.$fetch('/client/version')
          .then((response) => {
            console.log(response);
            if (response.success) {
              // \n转换为<br/>
              response.data.infromation = response.data.infromation.replace(/[\n\r]/g, "<br>");
              this.clientVersionData = response.data
            }
          })
      },

      /**
       * 开始下载
       */
      toUpdated() {
        this.$post('/client/upgrade/' + this.clientVersionData.newestVersion)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.percentageShow = true;
              this.toUpdatedInterval = setInterval(() => {
                this.clientUpgrade();
                sessionStorage.setItem('percentageNumber', this.percentageNumber.toString());
                //this.percentageNumber =this.percentageNumber+10
              }, 500)
            } else {
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg
              })
            }
          });
      },

      /**
       *获取下载进度
       **/
      clientUpgrade() {
        this.$fetch('/client/upgrade')
          .then((response) => {
            //console.log(response);
            if (response.success) {
              //循环次数小于10默认失败
              if(this.executionNumber < 10){
                this.percentageNumber = response.data.percentage;
                if(response.data.percentage ===0){
                  this.executionNumber = this.executionNumber+1;
                }else {
                  this.executionNumber = 0;
                }
              }else {
                this.$message({
                  type: 'warning', message: this.$t('message.c195')
                });
                this.percentageShow = false;
                this.percentageNumber = 0;
              }

            } else {
              this.percentageShow = false;
              this.$message({
                type: 'warning', message: this.$t('message.passWordFailed') + response.msg
              });
              this.percentageNumber = 0;
            }
          })
      },

      /**
       * 暂停更新
       **/
      suspend() {
        this.$confirm(this.$t('message.c179'), this.$t('message.c86'), {
          confirmButtonText: this.$t('message.confirmButtonText'),
          cancelButtonText: this.$t('message.cancelButtonText'),
          center: true
        }).then(() => {
          this.executionNumber = 0;
          this.$post('/client/upgrade/stop')
            .then((response) => {
              //console.log(response);
              if (response.success) {
                clearInterval(this.homeSetInterval);
                this.percentageNumber = 0;
                this.percentageShow = false;
                this.$message({
                  type: 'success', message: this.$t('message.passWordSuccess')
                });
              } else {
                this.$message({
                  type: 'warning', message: this.$t('message.passWordFailed') + response.msg
                })
              }
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.c59')
          });
        });
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
  @import url("../../assets/css/style");

  .updated-version {
    width: 1024px;
    margin: auto;
    .updated-info {
      width: 60%;
      margin: 100px auto 0;
      text-align: center;
      h1 {
        font-size: 24px;
        font-weight: bold;
        line-height: 3rem;
        margin-bottom: 25px;
      }
      p {
        font-size: 16px;
        font-weight: 500;
        line-height: 2rem;
      }
      h3 {
        width: 265px;
        margin: auto;
        text-align: left;
        font-size: 14px;
        line-height: 26px;

      }
      .updated-info-bt {
        margin-top: 20px;
        .el-button--primary {
          height: 34px;
          font-size: 14px;
          width: 350px;
        }
      }
      .updated-info-per {
        width: 350px;
        margin: 20px auto 0;
        .el-progress {
          .el-progress-bar {
            .el-progress-bar__outer {
              .el-progress-bar__inner {
                .el-progress-bar__innerText {
                  margin: -4px 5px 0 0;
                }
              }
            }
          }
        }
        .el-icon-close {
          display: block;
          margin-right: -30px;
          margin-top: -15px;
          float: right;
          border: 1px solid red;
          width: 15px;
          height: 15px;
          border-radius: 10px;
          line-height: 15px;
          font-size: 12px;
          color: #f0f7ff;
          background-color: red;
        }
      }
    }
    .updated-info-over {
      width: 60%;
      margin: 100px auto 0;
      text-align: center;
      h1 {
        font-size: 24px;
        font-weight: bold;
        line-height: 3rem;
        margin-bottom: 25px;
      }
      p {
        font-size: 16px;
        font-weight: 500;
        line-height: 2rem;
      }
      .updated-info-bt {
        margin-top: 20px;
        .el-button--primary {
          height: 34px;
          font-size: 14px;
          width: 350px;
        }
      }
    }
  }
</style>
