<template>
  <div class="top">
    <nav class="nav-top">
      <div class="logo fl"><img @click="to('home','0')" class="logo-img cursor-p" src="./../assets/logo.png"/></div>
      <ul>
        <li @click="to('home','0')" :class="[errorClass ,isActive===0 ? activeClass : '']"><i class="home_icon"></i><span>{{$t('message.home')}}</span>
        </li>
        <li @click="to('wallet','1')" :class="[errorClass ,isActive===1 ? activeClass : '']"><i
          class="wallet_icon"></i> <span>{{$t('message.wallet')}}</span></li>
        <li @click="to('consensus','2')" :class="[errorClass ,isActive===2 ? activeClass : '']"><i
          class="consensus_icon"></i> <span>{{$t('message.consensus')}}</span></li>
        <li @click="to('application','3')"><i
          class="application_icon"></i> <span>{{$t('message.applications')}}</span></li>
        <li @click="to('more','4')" :class="[errorClass ,isActive===4 ? activeClass : '']"><i class="more_icon"></i>
          <span>{{$t('message.setManagement')}}</span></li>
      </ul>
      <div class="top-icon fl">
        <!-- <div class="refresh">
             <i v-show="showTime" class="refresh_icon" @click="toRefresh" :title="$t('message.refresh')"></i>
             <span v-show="!showTime" class="refresh_count">{{count}}s</span>
         </div>-->
        <!--<el-badge class="news">
            <i class="message_icon" @click="news" :title="$t('message.news')"></i>
        </el-badge>-->
        <!--<el-badge :value="0" class="news">
            <i class="message_icon" @click="news"></i>
        </el-badge>-->
        <!--<div class="set"><i class="set_icon" @click="toSetUp" :title="$t('message.set')"></i></div>-->
        <!--<SelecBar @select="selectLanguage" :selectedValue="projectName" :dataList="languageItem"
                  :widthData="widthData"></SelecBar>-->
        <!--<div class="minusClose">
            <i class="el-icon-minus minus-close fl" @click="toMinus" :title="$t('message.c141')"></i>
            <i class="el-icon-close minus-close fl " @click="toClose" :title="$t('message.c142')"></i>
        </div>-->
      </div>
      <div class="news-div" v-show="newsOk">
        <h2>{{$t('message.news')}}</h2>
        <div class="news-div-info">
          <div class="news-div-info-div cursor-p">
            <h5>系统消息</h5>
            <el-badge class="mark" :value="12"/>
            <p>请更新钱包版本V1.0.0 2018-9-8</p>
          </div>
        </div>
      </div>
    </nav>
  </div>

</template>

<script>
  import SelecBar from './SelecBar.vue'
  import {jquery} from '@/assets/js/jquery.min.js'
  import * as config from '@/config.js'

  export default {
    data() {
      return {
        newsOk: false,
        current: 0,
        errorClass: '',
        activeClass: 'active',
        isActive: sessionStorage.hasOwnProperty('isActive') ? parseInt(sessionStorage.getItem('isActive')) : 0 ,
        showTime: true,
        count: '',
        timer: null,
      }
    },
    components: {
      SelecBar
    },
    computed: {},
    mounted() {
      this.$i18n.locale = localStorage.hasOwnProperty('language') ? localStorage.getItem('language') : 'en';
      //this.$i18n.locale = 'en';
      setInterval(() => {
       this.isActive = sessionStorage.hasOwnProperty('isActive') ? parseInt(sessionStorage.getItem('isActive')) : 0 ;
      }, 500)
    },
    methods: {

      //菜单跳转
      to(url, index) {

        if (url === 'home') {
          sessionStorage.setItem('isActive',0);
          this.isActive = 0;
          this.$router.push({
            path: '/*',
          })
        }
        if (url === 'wallet') {
          sessionStorage.setItem('isActive',1);
          this.isActive = 1;
          //获取账户地址列表
          if (this.$store.getters.getAddressList.length === 0) {
            this.$router.push({
              name: '/firstInfo',
            })
          } else {
            this.$router.push({
              name: '/wallet',
              params: {language: index}
            })
          }
        }
        if (url === 'consensus') {
          sessionStorage.setItem('isActive',2);
          this.isActive = 2;
          this.$router.push({
            name: '/consensus'
          })
        }
        if (url === 'application') {
          //this.isActive = 3
          this.$message({
            type: 'info', message: this.$t('message.c65'), duration: '800'
          })
        }
        if (url === 'more') {
          sessionStorage.setItem('isActive',4);
          this.isActive = 4;
          /*this.$message({
            type: 'info', message: this.$t('message.c65'), duration: '800'
          })*/
          this.$router.push({
            path: '/users/setPage'
          })
        }

      },
      //刷新
      toRefresh() {
        let url = this.$route.fullPath;
        this.$router.push({
          name: '/empty',
          params: {url: url},
        });

        const TIME_COUNT = 20;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.showTime = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.showTime = true;
              clearInterval(this.timer);
              this.timer = null
            }
          }, 1000)
        }

      },
      //消息方案
      news() {
        /*this.newsOk = !this.newsOk*/
      },
      //设置界面跳转
      toSetUp() {
        sessionStorage.setItem('isActive',9);
        this.isActive = 9;
        if (this.$store.getters.getAddressList.length === 0) {
          this.$router.push({
            name: '/firstInfo'
          })
        } else {
          this.$router.push({
            path: '/users/setPage'
          })
        }
      },
    }
  }
</script>
<style lang="less">
  @import './../assets/css/style.less';
.top{
  width: 100%;
  height: 42px;
  background-color: #17202e;
  .nav-top {
    width: 1024px;
    height: 42px;
    margin: auto;
    line-height: 42px;
    background-color: #17202e;
    -webkit-app-region: drag;
    .logo {
      height: 42px;
      text-align: center;
      .logo-img {
        margin: 10px 0;
        height: 22px;
      }
    }
    ul {
      width: 580px;
      height: 100%;
      float: left;
      -webkit-app-region: no-drag;
      li {
        width: 100px;
        float: left;
        color: #FFFFFF;
        height: 42px;
        font-size: 12px;
        text-align: center;
        margin: 0 5px;
        i {
          width: 35px;
          height: 40px;
          position: absolute;
          margin-left: 0;
          background-size: @bg-size;
          background: @bg-image
        }
        .home_icon {
          background-position: -23px 0;
        }
        .wallet_icon {
          background-position: -59px 0;
        }
        .consensus_icon {
          background-position: -94px 0;
        }
        .application_icon {
          background-position: -130px 0;
        }
        .more_icon {
          background-position: -236px 0;
        }
        span {
          margin-left: 20px;
        }
      }
      li.router-link-active {
        color: #FFFFFF;
        border-bottom: 2px solid #81bc3b;
        height: 40px;
      }
      li:hover {
        cursor: pointer;
        color: #FFFFFF;
        border-bottom: 2px solid #81bc3b;
        height: 40px;
      }
      li.active {
        border-bottom: 2px solid #81bc3b;
        height: 40px;
      }
    }
    .top-icon {
      width: 165px;
      margin-top: 0.2rem;
      float: right;
      -webkit-app-region: no-drag;
      i:hover {
        cursor: pointer;
      }
      .refresh_count {
        width: 30px;
        height: 20px;
        position: absolute;
        top: 0;
        font-size: 12px;
      }
      .refresh {
        width: 16px;
        height: 16px;
        float: left;
        padding-top: 12px;
        .refresh_icon {
          width: 20px;
          height: 20px;
          position: absolute;
          margin-left: 0;
          background-size: 16px 16px;
          background: url("./../assets/images/shuaxin_icon.png") no-repeat;
        }
      }
      .news {
        width: 35px;
        height: 40px;
        float: left;
        .message_icon {
          width: 35px;
          height: 40px;
          position: absolute;
          margin-left: 0;
          background-size: @bg-size;
          background: @bg-image -188px -1px;
        }
      }
      .set {
        width: 45px;
        height: 40px;
        float: left;
        .set_icon {
          width: 35px;
          height: 40px;
          position: absolute;
          margin-left: 0;
          background-size: @bg-size;
          background: @bg-image -224px -1px;
        }
      }
      .minusClose {
        width: 75px;
        height: 40px;
        float: right;
        i {
          font-size: 18px;
          float: left;
          text-align: center;
        }
        i.minus-close {
          margin-left: 23px;
          margin-top: 10px;
          color: #C1C5C9;
        }
        i.minus-close:last-child {
          margin-left: 10px;
        }
      }
      .is-fixed {
        top: 0.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.1rem;
        font-size: 0.4rem;
        right: 1rem;
      }
    }
    .news-div {
      width: 145px;
      height: 100%;
      border: 1px solid #24426c;
      position: fixed;
      top: 40px;
      right: 0;
      z-index: 9999;
      background-color: #0b1422;
      h2 {
        font-size: 12px;
        text-align: center;
        background-color: #222d3f;
        line-height: 30px;
      }
      .news-div-info {
        border-bottom: 1px solid #24426c;
        .news-div-info-div {
          .el-badge__content {
            border-radius: 2px;
            height: 15px;
            line-height: 15px;
            border: none;
          }
          h5 {
            float: left;
            color: #C1C5C9;
            font-size: 12px;
            padding: 0 5px;
            line-height: 30px;
            height: 35px;
          }
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #C1C5C9;
            font-size: 12px;
            padding: 0 5px;
            height: 35px;
            margin-top: -10px;
            clear: both;
          }
          div {
            line-height: 9px;
            margin-top: -20px;
          }
        }
      }
    }
  }
}

</style>
