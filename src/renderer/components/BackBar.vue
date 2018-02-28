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
		height: 3rem;
		line-height: 4rem;
		font-size: 14px;
		margin-left: 55px;
		cursor: pointer;
	}
</style>