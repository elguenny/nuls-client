<template>
	<div class="home">
		<div class="home-nav">
			<div class="home-nav-top">
				<div class="nav-title">{{$t("message.fund")}}</div>
				<div class="nav-all">
					<label class="fl">{{$t("message.fundTotal")}}：</label>
					<el-progress :percentage="100" :show-text="false" class="fl"></el-progress>
					<span class="fr">12866nuls</span>
				</div>
				<div class="nav-usable cl">
					<label class="fl">{{$t("message.fundUsable")}}：</label>
					<el-progress :percentage="(866/12866)*100" :show-text="false" class="fl" status="success"></el-progress>
					<span class="fr">866nuls</span>
				</div>
				<div class="nav-lock cl">
					<label class="fl">{{$t("message.fundLock")}}：</label>
					<el-progress :percentage="(12000/12866)*100" :show-text="false" class="fl" status="exception"></el-progress>
					<span class="fr">12000nuls</span>
				</div>
			</div>
			<div class="home-nav-top">
				<div class="nav-title">{{$t("message.consensus1")}}</div>
				<div class="nav-all">
					<label class="fl">{{$t("message.pledge")}}：</label>
					<el-progress :percentage="100" :show-text="false" class="fl" status="success"></el-progress>
					<span class="fr">12866nuls</span>
				</div>
				<div class="nav-usable cl">
					<label class="fl">{{$t("message.income")}}：</label>
					<el-progress :percentage="10" :show-text="false" class="fl" status="exception"></el-progress>
					<span class="fr">866nuls</span>
				</div>
				<div class="nav-lock cl">
					<label class="fl">{{$t("message.annualYield")}}：</label>

				</div>
			</div>
			<div class="home-nav-top">
			</div>
		</div>
		<div class="cl home-info">
			<div class="home-info-consensus">
				<div id="world-map-markers" style="height: 25rem;">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import '../../assets/css/jquery-jvectormap.css'
	import { jquery } from '../../assets/js/jquery.min.js'
	import { jvectormap } from '../../assets/js/jvectormap/jquery-jvectormap-1.2.2.min.js'
	import { jvectormap1 } from '../../assets/js/jvectormap/jquery-jvectormap-world-mill-en.js'
	export default {
		data() {
			return {
				ipData: [],
				mapObj: []
			};
		},
		mounted() {
			let _this = this;
			//encapsulated https
			this.getQueryIp('/5a7fec882e0000f327b56990');

		},
		methods: {
			
			/** get IP 
			 * @method getQueryIp
			 * @for 
			 * @param {string} Api adderss
			 * @return {int} Whether to get IP data.
			 * @author Wave
			 * @date 2018-2-11
			 * @version 1.0
			 **/
			getQueryIp(ipApi){
				this.$fetch(ipApi)
				.then((response) => {
					this.ipData = response;
					if(this.ipData.length > 0) {
						this.ipMaps();
						this.methodsMaps(this.mapObj);
					} else {
						console.log('Node data failed！');
					}
				});
			},
			
			
			/** According to IP query node latitude and longitude, city name.
			 * @method ipMaps
			 * @for 所属类名
			 * @param {参数类型} 参数名 参数说明
			 * @return {返回值类型} 返回值说明
			 * @author Wave
			 * @date 2018-2-11
			 * @version 1.0
			 **/
			ipMaps() {
				var MMDBReader = require('mmdb-reader');
				var reader = new MMDBReader('./src/renderer/assets/path/data.mmdb');
				var lats = [];
				var cityName = '';
				var markers = [];
				for(var j = 0, len = this.ipData.length; j < len; j++) {
					var latLngs = [reader.lookup(this.ipData[j]).location.latitude, reader.lookup(this.ipData[j]).location.longitude];
					var names = reader.lookup(this.ipData[j]).location.time_zone;
					if(names == undefined) {
						names = 'anonymous'
					} else {
						names = names.split('/')[1]
					}
					var obj = {
						//GOOGLE API
						"latLng": latLngs,
						//Get city name
						"name": names
					};
					markers.push(obj);
				}
				this.mapObj = markers;
			},

			/** jVector Maps
			 * Create a world map with markers
			 * @method methodsMaps
			 * @for 
			 * @param {Object} maps mapsObj
			 * @return 
			 * @author Wave
			 * @date 2018-2-11
			 * @version 1.0
			 **/
			methodsMaps(maps) {
				$('#world-map-markers').vectorMap({
					map: 'world_mill_en',
					normalizeFunction: 'polynomial',
					hoverOpacity: 0.7,
					hoverColor: false,
					zoomOnScroll: false,
					zoomStep: 1,
					backgroundColor: 'transparent',
					regionStyle: {
						initial: {
							fill: 'rgba(210, 214, 222, 1)',
							'fill-opacity': 1,
							stroke: 'none',
							'stroke-width': 0,
							'stroke-opacity': 1
						},
						hover: {
							'fill-opacity': 0.7,
							cursor: 'pointer'
						},
						selected: {
							fill: 'yellow'
						},
						selectedHover: {}
					},
					markerStyle: {
						initial: {
							fill: '#00a65a',
							stroke: '#111'
						}
					},
					markers: maps

				});
			}

		}
	}
</script>
<style lang="less">
	.home {
		width: 90%;
		margin: auto;
		margin-top: 2rem;
		background-color: #0c1323;
	}
	
	.home-nav {
		width: 100%;
		height: 150px;
		.home-nav-top {
			width: 30%;
			height: 7.5rem;
			float: left;
			margin-right: 4.5%;
			border: 1px solid #658ec7;
			.nav-title {
				text-align: center;
				font-size: 0.7rem;
				line-height: 2rem;
			}
			.nav-all,
			.nav-usable,
			.nav-lock {
				font-size: 0.6rem;
				line-height: 1.5rem;
				label {
					margin-left: 1rem;
				}
				.el-progress {
					width: 44%;
					margin-top: 0.6rem;
				}
				span {
					margin-right: 1rem;
				}
			}
		}
		.home-nav-top:last-child {
			margin-right: 0px;
		}
		.home-info {
			widows: 100%;
			height: 25rem;
			margin-top: 0.5rem;
			border: 1px solid #333333;
		}
	}
</style>