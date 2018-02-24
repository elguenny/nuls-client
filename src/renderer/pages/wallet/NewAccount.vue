<template>
	<div class="new-account">
		<div class="new-account-top">
			<h1>{{$t("message.newAccountTitle")}}</h1>
			<h2>
				{{$t("message.newAccountAddress")}}:NxaD59D7aAd29654eBC58A1DEaD649153B288928e3
			</h2>
			<div class="new-account-key">
				<h3 class="fl">
					{{$t("message.newAccountKey")}}：<input :type="keyShow ? 'text' : 'password'" v-model="keyInfo" readonly="readonly">
				</h3>
				<i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="keyShow = !keyShow"></i>
				<i class="el-icon-menu" @click="keyCode"></i>
				<div class="modal-overlay" v-show="isShow" @click="hideShow">
					<div class="modal-data">
						<div class="qrcode"></div>
					</div>
				</div>
			</div>
		</div>

		<ul>
			<li @click="backupsKey">
				<span>{{$t("message.newAccountBackupsKey")}}</span>
				<label>{{$t("message.newAccountBackupsKeyInfo")}}</label>
			</li>
			<li @click="backupsCode">
				<span>{{$t("message.newAccountBackupsCode")}}</span>
				<label>{{$t("message.newAccountBackupsCodeInfo")}}</label>
			</li>
			<li @click="backupsNuls">
				<span>{{$t("message.newAccountBackupsNuls")}}</span>
				<label>{{$t("message.newAccountBackupsNulsInfo")}}</label>
			</li>
		</ul>
		<div class="cl new-bt">
			<el-button type="primary" class="new-submit" @click="newSubmit()">{{$t("message.newAccountSubmit")}}</el-button>
			<el-button type="primary" class="new-reset" @click="newReset()">{{$t("message.newAccountReset")}}</el-button>
		</div>

	</div>
</template>

<script>
	import { jquery } from '../../assets/js/jquery.min.js'
	import { jvectormap } from '../../assets/js/jquery.qrcode.min.js'
	export default {
		data() {
			return {
				keyShow: false,
				keyInfo: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
				isShow: false,
			}
		},
		methods: {
			
			keyCode() {
				this.isShow = !this.isShow;
				$('.qrcode').qrcode({
					render: "canvas",
					width: 256,
					height: 256,
					text: "NxaD59D7aAd29654eBC58A1DEaD649153B288928e3",
					typeNumber: -1,
					correctLevel: 2,
					background: "#ffffff",
					foreground: "#000000"
				});
			},
			hideShow(){
				 this.isShow =  false;
				 $('.qrcode').html("");
			},
			backupsKey() {
				console.log('备份私钥')
				//window.open("https://codeload.github.com/douban/douban-client/legacy.zip/master");
			},
			backupsCode() {
				console.log('备份二维码')
			},
			backupsNuls() {
				console.log('备份NULS')
			},
			newSubmit() {
				this.$router.push({
					path: '/wallet/index'
				})
			},
			newReset() {
				console.log('确认风险，不备份')
			}
		}
	}
</script>

<style lang="less">
	.new-account {
		width: 90%;
		height: 100%;
		margin: auto;
		margin-top: 4%;
		text-align: center;
		font-size: 0.9rem;
		line-height: 1.6rem;
		.new-account-top {
			width: 77%;
			margin: auto;
			text-align: left;
			h1 {
				padding: 1.2rem 0;
				font-size: 1rem;
				font-weight: 500;
			}
			h2 {}
			.new-account-key {
				width: 100%;
				margin: auto;
				text-align: left;
				h3 {
					width: 70%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					input {
						width: 100%;
						border: none;
					}
				}
				i {
					font-size: 1.5rem;
					margin-left: 1rem;
				}
				.modal-overlay {
					position: absolute;
					left: 0px;
					top: 0px;
					width: 100%;
					height: 100%;
					text-align: center;
					z-index: 1000;
					background-color: #333;
					opacity: 0.85;
				}
				.modal-data {
					width: 100%;
					height: 100%;
					padding: 100px auto;
					text-align: center;
					.qrcode{
						padding: 20% 0 0 0;
					}
				}
			}
		}
		ul {
			width: 100%;
			height: 50%;
			margin: auto;
			margin-top: 2%;
			li {
				width: 25%;
				height: 11rem;
				float: left;
				margin-right: 3%;
				margin-left: 4%;
				border: 1px solid #658cc5;
				background-color: #181f2f;
				text-align: center;
				span {
					display: block;
					font-size: 1rem;
					padding: 1.2rem 0;
				}
				label {
					display: block;
					font-size: 0.8rem;
					padding: 0 0.5rem;
					text-align: center;
				}
			}
			li:last-child {}
		}
		.new-bt {
			width: 60%;
			height: 10rem;
			margin: auto;
			padding-top: 2%;
			button {
				display: block;
				width: 50%;
				margin: auto;
				margin-top: 5%;
			}
			.new-submit {}
			.new-reset {
				background-color: #181f2f;
				border-color: #658cc5;
			}
		}
	}
</style>