<template>
	<footer>
		<el-col :span="12" class='footer-left'>
			<span @click="clearData">{{$t("message.purseVersion")}}</span>：V{{$store.state.purseVersion}}（{{$t("message.coreVersion")}} V{{ bottomItem.myVersion }}）
			<span @click="updateVersionUrl" v-show="updateVersion" class="cursor-p text-d" >{{$t("message.toUpdate")}}</span>
		</el-col>
		<el-col :span="12" class='footer-right'>
			{{$t("message.blockState")}}：{{$t("message.local")}} {{ netWorkInfo.localBestHeight }}<span v-show="timeOffsetOk">（ {{$t("message.backward")}} {{ netWorkInfo.timeOffset }} ）</span> / {{$t("message.theMain")}} {{netWorkInfo.netBestHeight}}
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
				connectNumber:'0',
				netWorkInfo:[],
                iconWifi:'no-wifi_icon',
                rejectTime:0,
			}
		},
		mounted() {
			let _this = this;
			//encapsulated https
			this.getBottromInfo('/sys/version');
			//get net work info
			this.getNetWorkInfo('/network/info');
            var timer = setInterval(()=>{
                this.getNetWorkInfo('/network/info');
            },6000);

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
					    console.log(response);
					    if(response.success){
                            sessionStorage.setItem("userList","1")
                            this.netWorkInfo = response.data;
                            let wifi = this.netWorkInfo.inCount + this.netWorkInfo.outCount;
                            this.connectNumber= this.netWorkInfo.inCount + this.netWorkInfo.outCount;
                            if( wifi != 0){
								if(wifi<15){
                                    this.iconWifi='two-wifi_icon';
                                    if(wifi<5){
                                        this.iconWifi='one-wifi_icon';
                                    }
								}else {
                                    this.iconWifi='wifi_icon';
								}
							}else {
                                this.iconWifi='no-wifi_icon';
							}
						}
					}).catch((reject) => {
					    console.log(reject);
                    	sessionStorage.setItem("userList","0")
                });
			},
			//测试清理数据
            clearData(){
                localStorage.setItem('fastUser',"");
                localStorage.setItem("language","");
                localStorage.setItem("lockTime","");
                localStorage.setItem("newAccountAddress","");
                localStorage.setItem("passWordHint","");
                localStorage.setItem("userPass","");
                indexedDB.deleteDatabase("usersDB");
			}
		}
	}
</script>
<style lang="less">
	@import './../assets/css/style.less';
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
			i{
				width: 20px;
				height: 30px;
				display: block;
				margin-top: -5px;
				margin-left: 5px;
				float: right;
				background-size: @bg-size;
				background: @bg-image
			}
			.no-wifi_icon{
				background-position: -129px -34px;
			}
			.one-wifi_icon{
				background-position: -90px -36px;
			}
			.two-wifi_icon{
				background-position: -58px -36px;
			}
			.wifi_icon {
				background-position: -20px -36px;
			}
		}
	}
</style>