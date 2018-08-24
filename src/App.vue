<template>
  <div id="app">
    <Top></Top>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <Bottom></Bottom>
  </div>
</template>

<script>
  import Top from './components/TopBar.vue'
  import Bottom from './components/BottomBar.vue'

  export default {
    name: 'app',
    data() {
      return {}
    },
    components: {
      Top,
      Bottom,
    },
    created() {
      this.getBottromInfo();
      //设置钱包和共识的默认选择tab
      sessionStorage.setItem('walletActiveName', 'first');
      sessionStorage.setItem('consensusTabName', 'first');
    },
    mounted() {
      this.selectLanguage();
    },
    methods: {
      /**
       * 获取版本信息
       **/
      getBottromInfo() {
        this.$fetch('/client/version')
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$store.commit('setVersionInfo', response.data);
            }
          }).catch((reject) => {
          //console.log(reject);
        })
      },
      //语言切换
      selectLanguage() {
        let param = '';
        if (localStorage.getItem('language') === 'cn') {
          param = 'zh-CHS'
        } else {
          param = 'en'
        }

        this.$put('/sys/lang/' + param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              //console.log('success')
            } else {
              //console.log('err')
            }
          })
      },
    }
  }
</script>
<style lang="less">

</style>
