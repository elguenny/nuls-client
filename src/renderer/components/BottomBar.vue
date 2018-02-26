<template>
	<footer>
		<el-col :span="12" class='footer-left'>
			{{$t("message.purseVersion")}}：V{{$store.state.purseVersion}}（{{$t("message.coreVersion")}} V{{ bottomItem.coreVersion }}}）
			<router-link :to="updateVersionUrl" v-show="updateVersion" >{{$t("message.toUpdate")}}</router-link>
		</el-col>
		<el-col :span="12" class='footer-right'>
			{{$t("message.blockState")}}：{{$t("message.local")}} {{ bottomItem.local }}（{{$t("message.backward")}} {{ bottomItem.backWard }}s） /{{$t("message.theMain")}} {{bottomItem.theMain}}
			<i class="icon-wifi_icon" :title="connectNumber"></i>
		</el-col>
	</footer>
</template>

<script>
	import store from '@/vuex/store'
	export default {
		data() {
			return {
				bottomItem: [],
				purseVersions:store.state.purseVersion,
				updateVersionUrl:'',
				updateVersion:true,
				connectNumber:'',
				
			}
		},
		mounted() {
			let _this = this;
			//encapsulated https
			this.getBottromInfo('/5a81392c2f00006300a4c260');

		},
		methods: {
			getBottromInfo(bottomApi) {
				this.$fetch(bottomApi)
					.then((response) => {
						this.bottomItem = response;
						this.connectNumber = response.updateVersionUrl;
						this.connectNumber = response.titleNo;
						if(this.purseVersions != response.coreVersion){
							updateVersion:true
						}
					});
			}
		}
	}
</script>
<style lang="less">
	footer {
		width: 100%;
		height: 2rem;
		line-height: 2rem;
		position: fixed;
		z-index: 999;
		bottom: 0rem;
		font-size: 12px;
		.footer-left {
			text-indent: 2rem;
		}
		.footer-right {
			text-align: right;
			.icon-wifi_icon {
				margin: 0 0.5rem;
			}
		}
	}
</style>