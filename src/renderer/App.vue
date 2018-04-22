<template>
    <div id="app"
         v-loading="loadingHome"
         :element-loading-text="this.$t('message.c132')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 1)">
        <!--top start -->
        <Top></Top>
        <!--top end -->
        <transition>
            <router-view></router-view>
        </transition>
        <!--bottom start -->
        <Bottom v-show="bottomOk"></Bottom>
        <!--bottom end -->
        <el-dialog title="Language" :visible.sync="selectedValueVisible" top="35vh" :show-close="false"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="app">
                <label>Language:</label>
                <div class="language-select" @click="showLanguageList">
                    <div class="language-selected-value">
                        {{this.languageValue}}
                        <div class="language-select-list" v-if="showLanguageData">
                            <div class="language-select-item" v-for="item in languageList"
                                 @click.stop="selectedValue(item.languageName,item.languageKey)">
                                {{item.languageName}}
                            </div>
                        </div>
                    </div>
                    <i class="el-icon-arrow-up" :class="showLanguageData ? 'i_reverse':''"></i>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="selectedValue"
                           style="margin-right: 0px; width: 180px; margin-top: 20px">OK
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import Top from './components/TopBar.vue'
  import Bottom from './components/BottomBar.vue'
  import * as config from '@/config.js'

  const ipc = require('electron').ipcRenderer

  export default {
    name: 'app',
    data () {
      return {
        //全局加载
        loadingHome: true,
        bottomOk: false,
        selectedValueVisible: false,
        languageValue: 'English',
        showLanguageData: false,
        languageList: [
          {languageName: 'English', languageKey: 'en'},
          {languageName: '简体中文', languageKey: 'cn'},
        ],
        retryCount: 0,
      }
    },
    components: {
      Top,
      Bottom,
    },
    created () {
      let appSet = setInterval(() => {
        this.getBottromInfo()
        //判断是否连接到后台程序
        if (sessionStorage.getItem('getVersionSuccess') === '1') {
          //用户是否选择语言
          if (localStorage.hasOwnProperty('language')) {
            this.loadingHome = false
            this.bottomOk = true
            clearInterval(appSet)
          } else {
            this.selectedValueVisible = true
            clearInterval(appSet)
          }
          sessionStorage.setItem('walletActiveName', 'first')
          sessionStorage.setItem('consensusTabName', 'first')
        }
        else {
          if (this.retryCount === 0 || this.retryCount === 6 || this.retryCount === 10) {
            let fileName = 'nuls'
            ipc.send('CoreLauncher', 'nuls')
          } else if (this.retryCount === 15) {
            this.$alert(this.$t('message.c137'), this.$t('message.c138'), {
              confirmButtonText: this.$t('message.confirmButtonText'),
              showClose: false,
              callback: action => {
                ipc.send('CoreLauncher', 'stop')
                setTimeout(() => {
                  const ipc = require('electron').ipcRenderer
                  ipc.send('window-close')
                }, 500)
              }
            })
            clearInterval(appSet)
          }
        }
      }, 3000)
    },
    methods: {
      showLanguageList () {
        this.showLanguageData = !this.showLanguageData
      },
      selectedValue (languageName, languageKey) {
        if (languageKey !== 'cn') {
          languageKey = 'en'
        }
        this.languageValue = languageName
        this.$i18n.locale = languageKey
        this.loadingHome = false
        this.bottomOk = true
        localStorage.setItem('language', languageKey)
        this.selectedValueVisible = false
      },
      //获取版本信息
      getBottromInfo () {
        this.$fetch('/sys/version')
          .then((response) => {
            if (response.success) {
              this.$store.commit('setVersionInfo', response.data)
            }
            sessionStorage.setItem('getVersionSuccess', '1')
          }).catch((reject) => {
          this.retryCount++
          console.log(reject)
          sessionStorage.setItem('getVersionSuccess', '0')
        })
      },
    }
  }
</script>
<style lang="less">
    .el-dialog__title {
        color: #0c1323;
    }

    .app {
        width: 250px;
        height: 25px;
        margin: 0 auto 10px;
        label {
            width: 80px;
            float: left;
            display: block;
        }
        .language-select {
            width: 120px;
            height: 25px;
            float: left;
            padding-left: 5px;
            border: 1px solid #0d5aa7;
            i {
                position: absolute;
                top: 29px;
                right: 133px;
                content: '';
                width: 20px;
                height: 15px;
                color: #FFFFFF;
                text-align: center;
                transform: rotateZ(180deg);
                transition: transform .3s;
                &.i_reverse {
                    transform: rotateZ(0);
                }
            }
            .language-selected-value {
                position: absolute;
                .language-select-list {
                    position: absolute;
                    top: 35px;
                    background: white;
                    border: 1px solid #658ec7;
                    z-index: 9;
                    margin-left: -6px;
                    max-height: 500px;
                    transition: transform .3s;
                    .language-select-item {
                        width: 120px;
                        height: 26px;
                        line-height: 26px;
                        position: relative;
                        text-align: left;
                        color: #FFFFFF;
                        background-color: #0c1323;
                        padding: 0 0 0 5px;
                        &:hover {
                            background-color: #17202e;
                        }
                    }
                }
            }
        }
    }
</style>