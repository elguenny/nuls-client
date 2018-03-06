<template>
	<footer>
		<el-col :span="12" class='footer-left'>
			{{$t("message.purseVersion")}}：V{{$store.state.purseVersion}}（{{$t("message.coreVersion")}} V{{ bottomItem.myVersion }}）
			<span @click="updateVersionUrl" v-show="updateVersion" class="cursor-p text-d" >{{$t("message.toUpdate")}}</span>
		</el-col>
		<el-col :span="12" class='footer-right'>
			{{$t("message.blockState")}}：{{$t("message.local")}} {{ netWorkInfo.localBestHeight }}<span v-show="timeOffsetOk">（{{$t("message.backward")}} {{ netWorkInfo.timeOffset }}）</span> /{{$t("message.theMain")}} {{netWorkInfo.netBestHeight}}
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
				timeOffsetOk:true,
				connectNumber:'节点块数',
				netWorkInfo:[],
			}
		},
		mounted() {
			let _this = this;
			//encapsulated https
			this.getBottromInfo('/sys/version');
			//get net work info
			this.getNetWorkInfo('/network/info');

		},
		methods: {
            /** getBottromInfo
             * @method getBottromInfo
             * @param {string} urlAdderss
             * @return {int} update to install
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
			getBottromInfo(bottomApi) {
				this.$fetch(bottomApi)
					.then((response) => {
						this.bottomItem = response.data;
						if(response.data.myVersion != response.data.newestVersion){
							this.updateVersion = true
						}
					});
			},
            /** updateVersionUrl
             * @method updateVersionUrl
             * @param {string} urlAdderss
             * @return {int} updateUrl
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
			updateVersionUrl(){
				console.log('更新！');
			},
            /** getNetWorkInfo
             * @method getNetWorkInfo
             * @param {string} urlAdderss
             * @return {int} netWorkInfo
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
			getNetWorkInfo(urls) {
				this.$fetch(urls)
					.then((response) => {
						this.netWorkInfo = response.data;
						if(this.netWorkInfo.timeOffset > 0){
							this.timeOffsetOk = true;
						}else{
							this.timeOffsetOk = false;
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