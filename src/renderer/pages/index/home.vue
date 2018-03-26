<template>
    <div class="home">
        <div class="home-nav">
            <div class="home-nav-top">
                <div class="nav-title">{{$t("message.fund")}}</div>
                <div class="nav-all">
                    <label class="fl">{{$t("message.fundTotal")}}：</label>
                   <!-- <ProgressBar :colorData=this.balanceColor widthData="100%"></ProgressBar>-->
                    <span class="fr">{{(this.balanceData.balance*0.00000001).toFixed(8)}} NULS</span>
                </div>
                <div class="nav-usable cl">
                    <label class="fl">{{$t("message.fundUsable")}}：</label>
                    <!--<ProgressBar :colorData=this.lockedColor :widthData=this.lockedWidth></ProgressBar>-->
                    <span class="fr">{{(this.balanceData.usable*0.00000001).toFixed(8)}} NULS</span>
                </div>
                <div class="nav-lock cl">
                    <label class="fl">{{$t("message.fundLock")}}：</label>
                    <!--<ProgressBar :colorData=this.usableColor :widthData=this.usableWidth></ProgressBar>-->
                    <span class="fr">{{(this.balanceData.locked*0.00000001).toFixed(8)}} NULS</span>
                </div>
            </div>
            <div class="home-nav-top">
                <div class="nav-title">{{$t("message.consensus1")}}</div>
                <ul>
                    <li>
                        <label class="fl">{{$t("message.pledge")}}：</label>
                        <span>{{this.entrust}} NULS</span>
                    </li>
                    <li class="cl">
                        <label class="fl">{{$t("message.income")}}：</label>
                        <span>{{this.income}} NULS</span>
                    </li>
                    <li class="cl">
                        <label class="fl">{{$t("message.annualYield")}}：</label>
                        <span>{{this.nodeNumber}}</span>
                    </li>
                </ul>
            </div>
            <!--<div class="home-nav-top">
            </div>-->
        </div>
        <div class="div-title">{{$t("message.applicationsNode")}}</div>
        <div class="cl home-info">
           <!-- <div class="home-info-consensus">-->
               <div class="home-info-consensus" v-loading.lock="loading">
                <div id="world-map-markers" style="height: 17rem;" >
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
                loading: true,
                balanceData:[],
                balanceColor: '#658EC7',
                lockedColor: '#82bd39',
                lockedWidth: '0',
                usableColor: '#f64b3e',
                usableWidth: '0',

                entrust: '',
                income: '',
                nodeNumber: '',

                /* ipData: [
                     "186.101.196.150",
                     "176.101.196.150",
                     "166.101.196.150",
                     "156.101.196.150",
                     "146.101.196.150",
                     "136.101.196.150",
                     "126.101.196.150",
                     "116.101.196.150",
                     "106.101.196.150",
                     "186.101.166.150"
                 ],*/
                ipData: [],
                mapObj: [],

            };
        },
        components: {
            ProgressBar,
        },
        mounted() {
            let _this = this;
            //this.getNetworkNodes('/network/nodes');
            let obj = [];
            //查询网络节点数
            this.$fetch('/network/nodes')
                .then((response) => {
                    if (response.success) {
                        //this.ipData = response.data;
                        this.ipData = [
                            "186.101.196.150",
                            "176.101.196.150",
                            "166.101.196.150",
                            "156.101.196.150",
                            "146.101.196.150",
                            "136.101.196.150",
                            "126.101.196.150",
                            "116.101.196.150",
                            "106.101.196.150",
                            "186.101.166.150"
                        ];
                        for (var j = 0, len = this.ipData.length; j < len; j++) {
                            axios.get('http://freegeoip.net/json/' + this.ipData[j])
                                .then(function (response) {
                                    var latLngs = [response.data.latitude, response.data.longitude];
                                    var names = response.data.time_zone;
                                    if (names == "undefined") {
                                        names = 'anonymous'
                                    } else {
                                        names = names.split('/')[1]
                                    }
                                    obj.push({"latLng": latLngs, "name": names});
                                })
                                .catch(function (err) {
                                    console.log(err);
                                });
                        }
                    }
                });
            setTimeout(() => {
                this.methodsMaps(obj);
            }, 600);

            if (localStorage.getItem("fastUser") == null) {
                localStorage.setItem('fastUser', '0');
                localStorage.setItem("keyShow",false);
            }
            this.getAccountAddress("/account/balances/");
            this.getConsensus("/consensus");
        },
        methods: {
            //根据账户地址获取总金、冻结、可用额
            getAccountAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            //console.log(response);
                            this.balanceData = response.data;
                            this.lockedWidth = this.locked / this.balance * 100 + "%";
                            this.usableWidth = this.usable / this.balance * 100 + "%";
                        } else {
                            this.balanceColor = '';
                            this.lockedColor = '';
                            this.usableColor = '';
                        }
                    });
            },
            //获取所有共识信息
            getConsensus(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.entrust = (response.data.totalDeposit * 0.00000001).toFixed(8);
                            this.income = (response.data.rewardOfDay * 0.00000001).toFixed(8);
                            this.nodeNumber = response.data.agentCount;
                        }
                    })
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
                            stroke: '#82bd39',
                            r: 3,
                        },
                        hover: {
                            r: 4,
                            fill: '#dbf433',
                            stroke: '#82bd39',
                        }
                    },
                    markers: maps,
                });
                this.loading = false;
            }
        }
    }
</script>
<style lang="less">
    @import url("../../assets/css/style.less");

    .home {
        width: 93%;
        margin: 24px auto;
        background-color: #0c1323;
        .home-nav {
            width: 605px;
            height: 122px;
            margin: auto;
            .home-nav-top {
                width: 280px;
                height: 120px;
                float: left;
                margin-right: 40px;
                border: 1px solid #658ec7;
                background-color: #17202e;
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
                            width: 55px;
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
                        margin-right: 5px;
                    }
                }
            }
            .home-nav-top:last-child {
                margin-right: 0px;
            }
            .home-info {
                widow: 100%;
                height: 25rem;
                margin-top: 0.5rem;
                border: 1px solid #333333;

            }
        }
        .div-title {
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: 14px;
        }
    }

    .jvectormap-labels {
        font-size: 12px;
        color: #C1C5C9;
    }
</style>