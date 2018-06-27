<template>
  <div class="bottom">
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
  import {getNetworkInfo,getAccountList} from '@/api/httpData.js'
  export default {
    data() {
      return {
        //区块高度信息
        netWorkInfo: [],
       //wifi连接数量
        connectNumber: '0',
        //WiFi icon
        iconWifi: 'no-wifi_icon',
      }
    },
    mounted() {
      let _this = this;
      this.getNetWorkInfo();
      //5秒获取一次区块高度 encapsulated https
      setInterval(() => {
        this.getNetWorkInfo()
      }, 5000)

    },
    methods: {
      //获取节点高度 Get node height
      getNetWorkInfo() {
        getNetworkInfo()
          .then((response) => {
            //console.log(response)
            if (response.success) {

              //调用查询账户列表
              this.getAccountList();
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
        getAccountList()
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$store.commit('setAddressList', response.data.list);
            }
          }).catch((reject) => {
          localStorage.setItem('newAccountAddress', '');
        })
      },
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
