<template>
	<div class="first-info">
		<ul>
			<li @click="newAccount">
				<span>{{$t("message.createNewAccount")}}</span>
				<label>{{$t("message.createNewAccountInfo")}}</label>
			</li>
			<li @click="importAccount">
				<span>{{$t("message.importAccount")}}</span>
				<label>{{$t("message.importAccountInfo")}}</label>
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
			newAccount() {
				this.$router.push({
					path: '/firstInto/firstInfo/newAccount'
				})
			},
			importAccount() {
				this.$router.push({
					path: '/firstInto/firstInfo/importAccount'
				})
			}
		}
	}
</script>
<style lang="less">
	.first-info {
		width: 100%;
		height: 100%;
		ul {
			width: 60%;
			height: 50%;
			margin: auto;
			margin-top: 19%;
			li {
				width: 40%;
				height: 11rem;
				float: left;
				margin-right: 18%;
				border: 1px solid #658cc5;
				background-color: #181f2f;
				text-align: center;
				span {
					display: block;
					font-size: 1rem;
					line-height: 6rem;
				}
				label {
					display: block;
					font-size: 0.8rem;
					padding: 0 1rem;
					text-align: left;
				}
			}
			li:last-child {
				margin-right: 0px;
			}
		}
	}
</style>