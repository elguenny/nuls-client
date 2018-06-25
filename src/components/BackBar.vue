<template>
    <div class="back" @click="back"><i class="el-icon-arrow-left"></i>{{backTitle}}</div>
</template>

<script>
  export default {
    props: {
      backTitle: {
        type: String,
        default: ""
      },
      backUrl: {
        type: String,
        default: "1"
      },
      backParams: {
        type: String,
        default: ''
      }
    },
    methods: {
      back() {
        if (this.backUrl === "1") {
          this.$router.go(-1);
        } else {
          this.$router.push({
            name: this.backUrl,
          })
        }
      }
    }
  }
</script>

<style lang="less">
    .back {
        font-size: 14px;
        cursor: pointer;
        margin: 25px 0 0 0;
        width: 250px;
        height: 20px;
        text-align: left;
    }
</style>
