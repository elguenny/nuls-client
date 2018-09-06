<template>
  <div class="bottom" :class="this.bottomCss ? 'bottomP':''">
    <footer>
      <el-col :span="10" class='footer-left'>
        <span>{{$t('message.purseVersion')}}</span>：V{{this.$store.getters.getVersionInfo.myVersion}}
      </el-col>
      <el-col :span="14" class='footer-right'>
        {{$t('message.blockState')}}：{{$t('message.local')}} {{ netWorkInfo.localBestHeight }} /
        {{$t('message.theMain')}} {{netWorkInfo.netBestHeight}}
        <i :class="iconWifi" :title="connectNumber"></i>
      </el-col>
    </footer>
  </div>

</template>

<script>
  import {getNetworkInfo} from '@/api/httpData.js'
  import {accountList} from '@/api/util.js'

  export default {
    data() {
      return {
        //区块高度信息
        netWorkInfo: [],
        //wifi连接数量
        connectNumber: '0',
        //WiFi icon
        iconWifi: 'no-wifi_icon',
        //底部样式
        bottomCss:false,

      }
    },
    mounted() {
      let _this = this;
      this.getNetWorkInfo();
      //5秒获取一次区块高度 encapsulated https
      setInterval(() => {
        this.getNetWorkInfo();
        if (this.$store.getters.getAddressList.length === 0) {
          this.getAccountList()
        }
      }, 5000);

      setInterval(() => {
        this.bottomCss = this.hasScrollbar();
      },100);

      //调用查询账户列表
      this.getAccountList();

    },
    methods: {
      //获取节点高度 Get node height
      getNetWorkInfo() {
        getNetworkInfo()
          .then((response) => {
            //console.log(response)
            if (response.success) {

              this.netWorkInfo = response.data;
              this.$store.commit('setNetWorkInfo', response.data);

              let wifi = this.netWorkInfo.inCount + this.netWorkInfo.outCount;
              if (wifi < 2) {
                sessionStorage.setItem('setNodeNumberOk', 'false')
              } else {
                sessionStorage.setItem('setNodeNumberOk', 'true')
              }
              this.connectNumber = this.netWorkInfo.inCount + this.netWorkInfo.outCount;
              if (wifi !== 0) {
                if (wifi < 15) {
                  this.iconWifi = 'two-wifi_icon';
                  if (wifi < 5) {
                    this.iconWifi = 'one-wifi_icon'
                  }
                } else {
                  this.iconWifi = 'wifi_icon'
                }
              } else {
                this.iconWifi = 'no-wifi_icon'
              }
            }
          }).catch((reject) => {
          console.log(reject)
        })
      },
      //获取账户地址列表 Get a list of account addresses
      getAccountList() {
        accountList().then((response) => {
          //console.log(response);
          if (response.success) {
            this.$store.commit('setAddressList', response.list);
          } else {
            this.$store.commit('setAddressList', '');
            console.log("err")
          }
        });
      },

      hasScrollbar() {
        return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
      }
    }
  }
</script>
<style lang="less">
  @import './../assets/css/style.less';

  .bottom {
    width: 100%;
    height: 30px;
    position: fixed;
    bottom: 0;
  }
  .bottomP{
    position: relative;
  }

  footer {
    width: 1024px;
    margin: auto;
    height: 2rem;
    line-height: 2rem;
    font-size: 14px;
    .footer-left {
      span {
        color: #C1C5C9;
      }
    }
    .footer-right {
      text-align: right;
      i {
        width: 20px;
        height: 30px;
        display: block;
        margin-top: -5px;
        margin-left: 5px;
        float: right;
        background-size: @bg-size;
        background: @bg-image
      }
      .no-wifi_icon {
        background-position: -129px -34px;
      }
      .one-wifi_icon {
        background-position: -90px -36px;
      }
      .two-wifi_icon {
        background-position: -58px -36px;
      }
      .wifi_icon {
        background-position: -20px -36px;
      }
    }
  }
</style>
