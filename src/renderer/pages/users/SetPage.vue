<template>
    <div class="set-page">
        <h2>{{$t('message.c66')}}</h2>
        <div class="set-page-info">
            <el-switch v-model="value0" :width="30" active-color="#658ec7" inactive-color="#0b1422"
                       :inactive-text="$t('message.c67')" v-show="false"></el-switch>
            <el-collapse v-show="false">
                <el-collapse-item>
                    <template slot="title">
                        <el-switch v-model="value1" :width="30" active-color="#658ec7" inactive-color="#0b1422"
                                   :inactive-text="$t('message.c68')"></el-switch>
                    </template>
                    <ul>
                        <li>
                            <el-switch v-model="value2" :width="30" active-color="#658ec7" inactive-color="#0b1422"
                                       :inactive-text="$t('message.c69')"></el-switch>
                        </li>
                        <li>
                            <el-switch v-model="value3" :width="30" active-color="#658ec7" inactive-color="#0b1422"
                                       :inactive-text="$t('message.c70')"></el-switch>
                        </li>
                        <li>
                            <el-switch v-model="value4" :width="30" active-color="#658ec7" inactive-color="#0b1422"
                                       :inactive-text="$t('message.c71')"></el-switch>
                        </li>
                        <li>
                            <el-switch v-model="value5" :width="30" active-color="#658ec7" inactive-color="#0b1422"
                                       :inactive-text="$t('message.c72')"></el-switch>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
            <div class="set-page-div"  v-show="false">
                <label>切换账户：</label>
                <SwitchAddressBar @chenckAccountAddress="chenckAccountAddress"></SwitchAddressBar>
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
                <label>{{$t('message.c81')}}：V{{this.$store.getters.getPurseVersiont}}</label>
                <span class="cursor-p set-page-div-span" @click="versionUpdates">{{$t('message.c82')}}</span>
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
  import { ipcRenderer } from 'electron'
  import SwitchAddressBar from '@/components/SwitchAddressBar.vue'
  export default {
    data () {
      return {
        value0: false,
        value1: false,
        value2: true,
        value3: false,
        value4: true,
        value5: false,
        options: [{
          value: 'zh',
          label: this.$t('message.c83')
        }, {
          value: 'en',
          label: this.$t('message.c84')
        }],
        outerVisible: false,
        type: 0,
        tips: '',
        downloadPercent: 0,
        encrypted:false,
      }
    },
    components: {
      SwitchAddressBar,
    },
    beforeCreate () {
      ipcRenderer.on('message', (event, text) => {
        this.type = text.type;
        if(this.type===2){
          this.tips = this.$t('message.c155')
        }else if(this.type===3){
          this.tips = this.$t('message.c156')
        }else if(this.type===4){
          this.tips = this.$t('message.c157')
        }else{
          this.tips = this.$t('message.c154')
        }
      })
      ipcRenderer.on('downloadProgress', (event, progressObj) => {
        this.downloadPercent = progressObj.percent || 0
        alert("downloadPercent="+this.downloadPercent)
      })
      ipcRenderer.on('isUpdateNow', () => {
        ipcRenderer.send('isUpdateNow')
      })
    },
    created () {
      if(localStorage.getItem('encrypted') ==="true"){
        this.encrypted = true;
      }else{
        this.encrypted = false;
      }
    },
    destroyed () {

    },
    methods: {
      //获取下拉选择地址
      chenckAccountAddress (chenckAddress) {
        localStorage.setItem('newAccountAddress', chenckAddress)
      },
      //去备份
      toBackups () {
        sessionStorage.setItem('isActive',1);
        this.$router.push({
          name: '/userInfo'
        })
      },
      //通讯录管理
      toUserAddressList () {
        this.$router.push({
          path: '/users/userAddressList'
        })
      },
      //修改密码
      toEditPassword () {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
          if(this.encrypted){
            this.$router.push({
              name: '/editorPassword',
              params: {address: localStorage.getItem('newAccountAddress'),backInfo:this.$t('message.setManagement')},
            })
          }else{
            this.$router.push({
              name: '/setPassword',
              params: {address: localStorage.getItem('newAccountAddress'),backInfo:this.$t('message.setManagement')},
            })
          }
        } else {
          this.$message({
            message: this.$t('message.c133'), duration: '800'
          })
        }

      },
      //版本更新
      versionUpdates () {
        this.outerVisible = true;
        ipcRenderer.send('checkForUpdate');
        setTimeout(() => {
          if (this.type !== 3) {
            this.outerVisible = false
          }
        }, 3000)
      },
    }
  }
</script>

<style lang="less">
    .set-page {
        width: 340px;
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
                .set-page-div-span {
                    display: block;
                    width: 346px;
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