<template>
    <div class="home">
        <div class="home-nav">
            <div class="home-nav-top">
                <div class="nav-title">{{$t("message.fund")}}</div>
                <div class="nav-all">
                    <label class="fl">{{$t("message.fundTotal")}}：</label>
                    <ProgressBar :colorData=this.balanceColor widthData="100%"></ProgressBar>
                    <span class="fr">{{this.balance}} nuls</span>
                </div>
                <div class="nav-usable cl">
                    <label class="fl">{{$t("message.fundUsable")}}：</label>
                    <ProgressBar :colorData=this.lockedColor :widthData=this.lockedWidth ></ProgressBar>
                    <span class="fr">{{this.locked}} nuls</span>
                </div>
                <div class="nav-lock cl">
                    <label class="fl">{{$t("message.fundLock")}}：</label>
                    <ProgressBar :colorData=this.usableColor :widthData= this.usableWidth></ProgressBar>
                    <span class="fr">{{this.usable}} nuls</span>
                </div>
            </div>
            <div class="home-nav-top">
                <div class="nav-title">{{$t("message.consensus1")}}</div>
                <ul>
                    <li>
                        <label class="fl">{{$t("message.pledge")}}：</label>
                        <span>12866nuls</span>
                    </li>
                    <li class="cl">
                        <label class="fl">{{$t("message.income")}}：</label>
                        <span>866nuls</span>
                    </li>
                    <li class="cl">
                        <label class="fl">{{$t("message.annualYield")}}：</label>
                        <span>50%</span>
                    </li>
                </ul>
            </div>
            <div class="home-nav-top">
            </div>
        </div>
        <div class="cl home-info">
            <div class="home-info-consensus">
                <div id="world-map-markers" style="height: 20rem;">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import ProgressBar from '@/components/ProgressBar.vue'
    import '@/assets/css/jquery-jvectormap.css'
    import {jquery} from '@/assets/js/jquery.min.js'
    import {jvectormap} from '@/assets/js/jvectormap/jquery-jvectormap-1.2.2.min.js'
    import {jvectormap1} from '@/assets/js/jvectormap/jquery-jvectormap-world-mill-en.js'

    export default {
        data() {
            return {
                balance: '0',
                balanceColor: '#658EC7',
                locked: '0',
                lockedColor: '#82bd39',
                lockedWidth:'0',
                usable: '0',
                usableColor: '#f64b3e',
                usableWidth:'0',
                ipData: [
                    "186.101.196.150",
                    "176.101.196.150",
                    "166.101.196.150",
                    "156.101.196.150",
                    "146.101.196.150",
                    "136.101.196.150",
                    "126.101.196.150",
                    "116.101.196.150",
                    "106.101.196.150",
                    "186.101.196.150",
                    "186.100.196.150",
                    "186.99.196.150",
                    "186.80.196.150",
                    "186.70.196.150",
                    "186.60.196.150",
                    "186.50.196.150",
                    "186.40.196.150",
                    "186.30.196.150"
                ],
                mapObj: [{latLng: [34.74, 113.66], name: '郑州 '}],
            };
        },
        components: {
            ProgressBar,
        },
        mounted() {
            let _this = this;
            for (var j = 0, len = this.ipData.length; j < len; j++) {
                this.getQueryIp(this.ipData[j]);
            }
            this.methodsMaps(this.mapObj);
            if (localStorage.getItem("fastUser") == null) {
                localStorage.setItem('fastUser', '0');
            }
            if (localStorage.getItem("newAccountAddress") != null) {
                this.getAccountAddress("/account/balance/" + localStorage.getItem("newAccountAddress"));
            } else {
                this.balanceColor = '';
                this.lockedColor = '';
                this.usableColor = '';
            }
        },
        methods: {
            getAccountAddress(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.balance = response.data.balance*0.0000000001;
                        this.locked = response.data.locked*0.0000000001;
                        this.lockedWidth =this.locked/this.balance*100+"%";
                        this.usable = response.data.usable*0.0000000001;
                        this.usableWidth =this.usable/this.balance*100+"%";
                    });
            },


            /** get IP
             * @method getQueryIp
             * @for
             * @param {string} Api adderss
             * @return {int} Whether to get IP data.
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            getQueryIp(ip) {
                axios.get('http://freegeoip.net/json/' + ip)
                    .then(function (response) {
                        var latLngs = [response.data.latitude, response.data.longitude];
                        var names = response.data.time_zone;
                        if (names == undefined) {
                            names = 'anonymous'
                        } else {
                            names = names.split('/')[1]
                        }
                        var obj = {
                            "latLng": latLngs,
                            "name": names
                        };
                        //this.mapObj.push(obj);
                    })
                    .catch(function (err) {
                        console.log('Node data failed！===' + err);
                    });

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
    @import url("../../assets/css/style.less");

    .home {
        width: 93%;
        margin: auto;
        margin-top: 24px;
        background-color: #0c1323;
    }

    .home-nav {
        width: 100%;
        height: 150px;
        .home-nav-top {
            width: 30%;
            height: 120px;
            float: left;
            margin-right: 4.5%;
            border: 1px solid #658ec7;
            .nav-title {
                text-align: center;
                font-size: 14px;
                line-height: 2rem;
            }
            ul {
                li {
                    font-size: 12px;
                    line-height: 22px;
                    label {
                        display: block;
                        width: 70px;
                        float: left;
                        margin-left: 1rem;
                    }
                }
            }
            .nav-all,
            .nav-usable,
            .nav-lock {
                font-size: 12px;
                line-height: 1.5rem;
                label {
                    margin-left: 1rem;
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