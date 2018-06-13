<template>
    <div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        url: this.$route.params.url,
      }
    },
    created () {
      console.log(this.url)
      this.$router.replace(this.url)

    },
    methods: {

    }
  }
</script>

<style lang="less">

</style>