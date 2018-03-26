<template>
	<div class="back" @click="back"><i class="el-icon-arrow-left"></i>{{backTitle}}</div>
</template>

<script>
	export default {
		props: ['backTitle'],
		methods: {
			back() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="less">
	.back {
		font-size: 14px;
		cursor: pointer;
		margin: 25px 0 0 55px;
		width: 250px;
		height: 20px;
		text-align: left;
	}
</style>