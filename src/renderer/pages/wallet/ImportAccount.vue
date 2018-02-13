<template>
	<div class="import-account">
		<h1>导入账户</h1>
		<ul>
			<li @click="importKey">
				<span>明文私钥导入</span>
			</li>
			<li @click="importCode">
				<span>二维码导入</span>
			</li>
			<li @click="importNuls">
				<span>.NULS格式备份</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			importKey() {
				this.$router.push({
					path: '/firstInto/firstInfo/importKey'
				})
			},
			importCode() {
				this.$router.push({
					path: '/firstInto/firstInfo/importCode'
				})
			},
			importNuls() {
				this.$router.push({
					path: '/firstInto/firstInfo/importNuls'
				})
			}
		}
	}
</script>

<style lang="less">
	.import-account {
		widows: 90%;
		height: 100%;
		margin: auto;
		margin-top: 10%;
		text-align: center;
		font-size: 0.9rem;
		line-height: 1.6rem;
		h1 {
			line-height: 3rem;
			font-size: 1rem;
			font-weight: 500;
		}
		ul {
			width: 100%;
			height: 50%;
			margin: auto;
			margin-top: 2%;
			li {
				width: 20%;
				height: 15rem;
				float: left;
				margin-right: 5%;
				margin-left: 7%;
				border: 1px solid #658cc5;
				background-color: #181f2f;
				text-align: center;
				span {
					display: block;
					font-size: 1rem;
					font-weight: 600;
					line-height: 8rem;
				}
				label {
					display: block;
					font-size: 0.8rem;
					padding: 0 1.5rem;
					text-align: center;
				}
			}
			li:last-child {}
		}
	}
</style>