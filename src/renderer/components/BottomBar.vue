<template>
	<footer>
		<el-col :span="12" class='footer-left'>
			<span @click="clearData">{{$t("message.purseVersion")}}</span>：V{{$store.state.purseVersion}}（{{$t("message.coreVersion")}} V{{ bottomItem.myVersion }}）
			<span @click="updateVersionUrl" v-show="updateVersion" class="cursor-p text-d" >{{$t("message.toUpdate")}}</span>
		</el-col>
		<el-col :span="12" class='footer-right'>
			{{$t("message.blockState")}}：{{$t("message.local")}} {{ netWorkInfo.localBestHeight }}<span v-show="timeOffsetOk">({{$t("message.backward")}} {{ netWorkInfo.timeOffset }})</span> / {{$t("message.theMain")}} {{netWorkInfo.netBestHeight}}
			<!--<i class="icon-wifi_icon" :title="connectNumber"></i>-->
			<i :class="iconWifi" :title="connectNumber"></i>
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
                iconWifi:'icon-wifi_icon'
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
			getBottromInfo(url) {
				this.$fetch(url)
					.then((response) => {
					    if(response.success){
                            this.bottomItem = response.data;
                            if(response.data.myVersion != response.data.newestVersion){
                                //this.updateVersion = true
                            }
						}else {
                            this.$confirm('似乎已断开与互联网的连接，请连接后重试。确定关闭NULS钱包客户端？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                var ipc = require('electron').ipcRenderer;
                                ipc.send('window-close');
                            }).catch(() => {

                            });
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
			getNetWorkInfo(url) {
				this.$fetch(url)
					.then((response) => {
					    if(response.success){
					        //console.log(response);
                            this.netWorkInfo = response.data;
                            let wifi = this.netWorkInfo.inCount + this.netWorkInfo.outCount;
                            if( wifi != 0){
								if(wifi<5){
									console.log("<5")
                                    this.iconWifi='icon-wifi_icon';
								}else if(5<wifi<15){
								    console.log("6-14")
                                    this.iconWifi='icon-wifi_icon';
								}else {
								    console.log(">15")
                                    this.iconWifi='icon-wifi_icon';
								}
							}else {
                                this.iconWifi='icon-wifi_icon';
							}
                            //this.netWorkInfo.inCount
						}

					});
			},
			//测试清理数据
            clearData(){
                localStorage.removeItem('fastUser');
                localStorage.removeItem("language");
                localStorage.removeItem("lockTime");
                localStorage.removeItem("newAccountAddress");
                localStorage.removeItem("passWordHint");
                localStorage.removeItem("userPass");
                indexedDB.deleteDatabase("usersDB");
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