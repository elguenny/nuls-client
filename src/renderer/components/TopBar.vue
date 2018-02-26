<template>
	<nav class="nav-top">
		<div class="logo fl"><img class="logo-img" src="../assets/logo.png" /></div>
		<ul>
			<router-link to="/home" tag="li" class="home-bg">
				<i class="icon-home_icon"></i>
				<span>{{$t("message.home")}}</span>
			</router-link>
			<router-link to="/wallet" tag="li" class="wallet-bg">
				<i class="icon-page_icon"></i>
				<span>{{$t("message.wallet")}}</span>
			</router-link>
			<router-link to="/consensus" tag="li" class="consensus-bg">
				<i class="icon-consensus_icon"></i>
				<span>{{$t("message.consensus")}}</span>
			</router-link>
			<router-link to="/application" tag="li" class="application-bg">
				<i class="icon-use_icon"></i>
				<span>{{$t("message.applications")}}</span>
			</router-link>
			<router-link to="/more" tag="li" class="more-bg">
				<i class="icon-more_icon"></i>
				<span>{{$t("message.more")}}</span>
			</router-link>
		</ul>
		<div class="top-icon fl">
			<el-badge :value="12" class="news fl">
				<i class="el-icon-bell" @click="news"></i>
			</el-badge>
			<i class="el-icon-setting" @click="setUp"></i>
			<SelecBar v-on:select="selectLanguage" :selectedValue="projectName" :dataList="languageItem" :widthData="widthData"></SelecBar>
		</div>
	</nav>
</template>

<script>
	import SelecBar from './SelecBar.vue'
	export default {
		data() {
			return {
				//languageItem
				languageItem: [{
						key: "zh",
						value: "static/img/Language-zh.png"
					},
					{
						key: "en",
						value: "static/img/Language-en.png"
					}
				],
				//select language initial info
				projectName: {
					key: "zh",
					value: "static/img/Language-zh.png"
				},
				//select language initial width
				widthData: "2rem",
			}
		},
		components: {
			SelecBar
		},
		mounted() {

		},
		methods: {

			/**
			 * method statement
			 * @method selectLanguage
			 * @for no
			 * @param {no} 
			 * @return {string} select language type
			 * @author Wave
			 * @date 2018-2-11
			 * @version 1.0
			 **/
			selectLanguage() {
				this.$i18n.locale = this.projectName.key;
			},

			news() {
				console.log('news')
			},
			setUp() {
				console.log('setUp')
			},
		}
	}
</script>
<style lang="less">
	@import './../assets/css/style.less';
	@div-width: 100%;
	@div-height: 100%;
	.nav-top {
		width: @div-width;
		height: 42px;
		line-height: 42px;
		background-color: #181f2f;
		.logo {
			height: 42px;
			text-align: center;
			.logo-img {
				margin: 10px 10px 0 20px;
				height: 22px;
			}
		}
		ul {
			width: @div-width * 0.8;
			height: @div-height;
			float: left;
			li {
				width: 120px;
				height: @div-height;
				float: left;
				color: #FFFFFF;
				height: 42px;
				font-size: 12px;
				text-align: center;
				i {
					font-size: 16px;
					margin-right: 3px;
					line-height: 42px;
				}
			}
			li.router-link-active {
				color: #FFFFFF;
				border-bottom: 2px solid #81bc3b;
				height: 40px;
			}
			li:hover {
				cursor: pointer;
			}
		}
		.top-icon {
			width: 12%;
			margin-top: 0.2rem;
			float: right;
			margin-right: 20px;
			.news {
				width: 2rem;
			}
			i{
				font-size: 18px;
			}
			i:hover {
				cursor: pointer;
			}
			.el-icon-setting {
				float: left;
				width: 2rem;
				display: block;
				margin-top: 0.65rem;
				text-align: center;
			}
			.is-fixed {
				top: 0.6rem;
				height: 0.6rem;
				line-height: 0.6rem;
				padding: 0 0.1rem;
				font-size: 0.4rem;
				right: 1rem;
			}
		}
	}
</style>