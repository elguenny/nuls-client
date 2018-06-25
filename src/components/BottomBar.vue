<template>
  <div class="bottom">
    <footer>
      <el-col :span="10" class='footer-left'>
        <span>{{$t('message.purseVersion')}}</span>：V{{this.$store.getters.getVersionInfo.myVersion}}
      </el-col>
      <el-col :span="14" class='footer-right'>
        {{$t('message.blockState')}}：{{$t('message.local')}} {{ netWorkInfo.localBestHeight }}<span
        v-show="timeOffsetOk"></span> /
        {{$t('message.theMain')}} {{netWorkInfo.netBestHeight}}
        <i :class="iconWifi" :title="connectNumber"></i>
      </el-col>
    </footer>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        //bottomItem: [],
        updateVersion: false,
        timeOffsetOk: true,
        connectNumber: '0',
        netWorkInfo: [],
        iconWifi: 'no-wifi_icon',
        rejectTime: 0,
        rejectOut: 10,
        messageBox: 0,
      }
    },
    mounted() {
      let _this = this;

      this.getNetWorkInfo('/network/info');
      //5秒获取一次区块高度 encapsulated https
      setInterval(() => {
        this.getNetWorkInfo('/network/info')
      }, 5000)

    },
    methods: {
      //获取节点高度 Get node height
      getNetWorkInfo(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response)
            if (response.success) {
              if (this.rejectTime > 1) {
                this.rejectTime = this.rejectTime - 1
              }
              //调用查询账户列表
              this.getAccountList('/account');

              sessionStorage.setItem('javaFile', '1');
              sessionStorage.setItem('userList', '1');
              this.rejectTime = 0;
              this.netWorkInfo = response.data;
              if (this.netWorkInfo.localBestHeight === 0 || this.netWorkInfo.netBestHeight === 0) {
                sessionStorage.setItem('userList', '0')
              }
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
          this.rejectTime = this.rejectTime + 1;
          sessionStorage.setItem('userList', '0')
        })
      },
      //获取账户地址列表 Get a list of account addresses
      getAccountList(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$store.commit('setAddressList', response.data.list);
            }
            /*if (response.success) {
              if (response.data.list.length > 0) {
                this.$store.commit('setAddressList', response.data.list);
                if (localStorage.getItem('newAccountAddress') === '') {
                  localStorage.setItem('newAccountAddress', response.data.list[0].address)
                }
                localStorage.setItem('fastUser', '1')
              } else {
                this.$store.commit('setAddressList', '');
                localStorage.setItem('newAccountAddress', '');
                localStorage.setItem('fastUser', '0')
              }
            } else {
              this.$store.commit('setAddressList', '');
              localStorage.setItem('newAccountAddress', '');
              localStorage.setItem('fastUser', '0')
            }*/
          }).catch((reject) => {
          localStorage.setItem('newAccountAddress', '');
          localStorage.setItem('fastUser', '0')
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
