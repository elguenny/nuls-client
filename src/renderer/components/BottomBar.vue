<template>
	<footer>
		<el-col :span="12" class='footer-left'>
			{{$t("message.purseVersion")}}：V{{$store.state.purseVersion}}（{{$t("message.coreVersion")}} V{{ bottomItem.myVersion }}）
			<span @click="updateVersionUrl" v-show="updateVersion" class="cursor-p text-d" >{{$t("message.toUpdate")}}</span>
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
				updateVersion:false,
				connectNumber:'',
				
			}
		},
		mounted() {
			let _this = this;
			//encapsulated https
			this.getBottromInfo('/sys/version');

		},
		methods: {
			getBottromInfo(bottomApi) {
				this.$fetch(bottomApi)
					.then((response) => {
						this.bottomItem = response.data;
						//console.log(response);
						if(response.data.myVersion == response.data.newestVersion){
							this.updateVersion = true
						}
						/*if(this.purseVersions != response.coreVersion){
							this.updateVersion = true
						}*/
					});
			},
			updateVersionUrl(){
				console.log('更新！');
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
			span{
				color: #C1C5C9;
			}
		}
		.footer-right {
			text-align: right;
			.icon-wifi_icon {
				margin: 0 0.5rem;
			}
		}
	}
</style>