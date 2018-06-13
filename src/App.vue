<template>
  <div id="app">
    <Top></Top>
    <transition>
      <router-view></router-view>
    </transition>
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

      /*let protocol = window.location.protocol; //协议
      let host = window.location.host; //主机

      console.log("protocol="+protocol+"=host=="+host);
      /!*let reg = /^localhost+/;*!/
      if(reg.test(host)) {
        //若本地项目调试使用
        axios.defaults.baseURL = 'http://10.0.xx.xxx:xxxx/api/';
      } else {
        //动态请求地址
        axios.defaults.baseURL = protocol + "//" + host + "/api/";
      }*/


      this.getBottromInfo();
      //设置钱包和共识的默认选择tab
      sessionStorage.setItem('walletActiveName', 'first');
      sessionStorage.setItem('consensusTabName', 'first');

      /*this.$message({
        type: 'info', message:'浏览器是否兼容css3=='+this.supportCss3('transform'), duration: '8000'
      });*/

    },
    methods: {
      /**
       * 判断浏览器是否支持某一个CSS3属性
       * @param {String} 属性名称
       * @return {Boolean} true/false
       * @version 1.0
       * @author ydr.me
       * 2014年4月4日14:47:19
       */

      supportCss3(style) {
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
          i,
          humpString = [],
          htmlStyle = document.documentElement.style,
          _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
              return $1.toUpperCase();
            });
          };

        for (i in prefix)
          humpString.push(_toHumb(prefix[i] + '-' + style));

        humpString.push(_toHumb(style));

        for (i in humpString)
          if (humpString[i] in htmlStyle) return true;

        return false;
      },


      /**
       * 获取版本信息
       **/
      getBottromInfo() {
        this.$fetch('/sys/version')
          .then((response) => {
            if (response.success) {
              this.$store.commit('setVersionInfo', response.data);
            }
          }).catch((reject) => {
          console.log(reject);
        })
      },
    }
  }
</script>
<style lang="less">

</style>
