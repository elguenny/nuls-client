<template>
    <div v-loading="loadingHome"
         :element-loading-text="this.$t('message.c132')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)" class="home">
        <div class="home-nav">
            <div class="home-nav-top">
                <div class="nav-title">{{$t("message.fund")}}</div>
                <div class="nav-all">
                    <label class="fl">{{$t("message.fundTotal")}}：</label>
                    <ProgressBar :colorData=this.balanceColor :widthData=this.balanceWidth></ProgressBar>
                    <span class="fr">{{(this.balanceData.balance*0.00000001).toFixed(8)}} NULS</span>
                </div>
                <div class="nav-lock cl">
                    <label class="fl">{{$t("message.fundLock")}}：</label>
                    <ProgressBar :colorData=this.usableColor :widthData=this.lockedWidth></ProgressBar>
                    <span class="fr">{{(this.balanceData.locked*0.00000001).toFixed(8)}} NULS</span>
                </div>
                <div class="nav-usable cl">
                    <label class="fl">{{$t("message.fundUsable")}}：</label>
                    <ProgressBar :colorData=this.lockedColor :widthData=this.usableWidth></ProgressBar>
                    <span class="fr">{{(this.balanceData.usable*0.00000001).toFixed(8)}} NULS</span>
                </div>
            </div>
            <div class="home-nav-top">
                <div class="nav-title">{{$t("message.consensus1")}}</div>
                <ul>
                    <li class="cl">
                        <label class="fl">{{$t("message.annualYield")}}：</label>
                        <span>{{this.nodeNumber}} {{$t('message.c30')}}</span>
                    </li>
                    <li>
                        <label class="fl">{{$t("message.pledge")}}：</label>
                        <span>{{this.entrust}} NULS</span>
                    </li>
                    <li class="cl">
                        <label class="fl">{{$t("message.income")}}：</label>
                        <span>{{this.income}} NULS</span>
                    </li>

                </ul>
            </div>
        </div>
        <div class="div-title">{{$t("message.applicationsNode")}}</div>
        <div class="cl home-info">
            <div class="home-info-consensus" v-loading.lock="loading">
                <div id="world-map-markers" style="height: 18rem;">
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
    import {jvectormap} from '@/assets/js/jvectormap/jquery-jvectormap-2.0.3.min'
    import {jvectormap1} from '@/assets/js/jvectormap/jquery-jvectormap-world-mill-en.js'

    export default {
        data() {
            return {
                loading: true,
                loadingHome: true,
                balanceData: [],
                balanceColor: '#658EC7',
                balanceWidth: '0',
                lockedColor: '#82bd39',
                lockedWidth: '0',
                usableColor: '#f64b3e',
                usableWidth: '0',
                entrust: '',
                income: '',
                nodeNumber: '',
                ipData: [],
                mapObj: [],
                ipObj: [],
            };
        },
        components: {
            ProgressBar,
        },
        created() {
            //判断是否连接数据库成功 userList(0:没链接数据库 1链接成功连接数据库)
            //console.log(sessionStorage.getItem("userList"));
            if (sessionStorage.getItem("userList") !== '1') {
                let setIntervalData = setInterval(() => {
                    console.log(sessionStorage.getItem("userList"));
                    if (sessionStorage.getItem("userList") === '1') {
                        this.getAccountAddress("/account/balances/");
                        this.getConsensus("/consensus");
                        if (this.$store.getters.getAddressList.length === 0) {
                            this.getAccountList("/account/list");
                        }
                        this.getNetWork();
                        setTimeout(() => {
                            this.methodsMaps(this.ipObj);
                        }, 2000);
                        this.loadingHome = false;
                        clearInterval(setIntervalData);
                    }
                }, 1000)
            } else {
                this.getAccountAddress("/account/balances/");
                this.getConsensus("/consensus");
                if (this.$store.getters.getAddressList.length === 0) {
                    this.getAccountList("/account/list");
                }
                this.getNetWork();
                setTimeout(() => {
                    this.methodsMaps(this.ipObj);
                }, 2000);
                this.loadingHome = false;
            }

            //判断java程序是否启动
            //sessionStorage.setItem("homeJava", "1");
            if (sessionStorage.getItem("homeJava") == null) {
                //启动java程序
                this.parserequest();
            }
            if (localStorage.getItem("fastUser") == null) {
                localStorage.setItem('fastUser', '0');
                localStorage.setItem("keyShow", false);
            }

        },
        methods: {
            /**
             * 执行java文件
             * Execute the java file
             */
            parserequest() {
                var child_process = require('child_process');
                var _path = process.execPath.substr(0, process.execPath.length - 14);
                //var _path = process.execPath.substr(0, 8);
                //alert(_path);
                child_process.execFile(_path + 'java\\bin\\nuls.bat', null, {cwd: _path + 'java\\bin\\'}, function (error) {
                    sessionStorage.setItem("homeJava", "1");
                    if (error !== null) {
                        //alert('exec error: ' + error);
                        console.log('exec error: ' + error);
                    }
                    else {
                        //alert('Execute the java file');
                        console.log('Execute the java file');
                    }
                });
            },
            /**
             * 根据账户地址获取总金、冻结、可用额
             *Get the total amount, freezing and availability according to the account address.
             * @param url
             */
            getAccountAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            //console.log(response)
                            this.balanceData = response.data;
                            this.balanceWidth = (this.balanceData.balance / this.balanceData.balance * 100).toFixed(2) + "%";
                            this.lockedWidth = (this.balanceData.locked / this.balanceData.balance * 100).toFixed(2) + "%";
                            this.usableWidth = (this.balanceData.usable / this.balanceData.balance * 100).toFixed(2) + "%";
                            //console.log(this.lockedWidth+"==="+this.usableWidth);
                        } else {
                            this.balanceColor = '';
                            this.lockedColor = '';
                            this.usableColor = '';
                        }
                    });
            },
            /**
             * 获取所有共识信息
             * Get all the consensus information
             * @param url
             */
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
            /**
             * getNetWork
             * getNetWork
             */
            getNetWork() {
                this.$fetch('/network/nodes')
                    .then((response) => {
                        if (response.success) {
                            //console.log(response);
                            this.ipData = response.data;
                            if (this.ipData.length > 0) {
                                for (var j = 0, len = this.ipData.length; j < len; j++) {
                                    axios.get('http://freegeoip.net/json/' + this.ipData[j])
                                        .then((response) => {
                                            //console.log(response.data);
                                            var latLngs = [response.data.latitude, response.data.longitude];
                                            var names = response.data.time_zone;
                                            if (names == "undefined") {
                                                names = 'anonymous'
                                            } else {
                                                names = names.split('/')[1]
                                            }
                                            this.ipObj.push({"latLng": latLngs, "name": names});
                                        })
                                        .catch(function (err) {
                                            this.ipObj = [];
                                        });
                                }
                            } else {
                                console.log("没有获取到ip")
                            }
                            console.log(this.ipObj);
                        }
                    });
            },
            /**
             * 获取账户地址列表
             * Get a list of account addresses
             * @param url
             * @param data
             * @returns {Promise}
             */
            getAccountList(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            sessionStorage.setItem("homeJava", "1");
                            if (response.data.list.length > 0) {
                                this.$store.commit("setAddressList", response.data.list);
                                localStorage.setItem('newAccountAddress', response.data.list[0].address);
                                localStorage.setItem('fastUser', '1');
                            } else {
                                this.$store.commit("setAddressList", '');
                                localStorage.setItem('newAccountAddress', '');
                                localStorage.setItem('fastUser', '0');
                            }
                        } else {
                            this.$store.commit("setAddressList", '');
                            localStorage.setItem('newAccountAddress', '');
                            localStorage.setItem('fastUser', '0');
                        }
                    }).catch((reject) => {
                    localStorage.setItem('newAccountAddress', '');
                    localStorage.setItem('fastUser', '0');
                });
            },
            /**
             * 根据坐标标注位置
             * According to coordinate annotation position
             * @param url
             * @param data
             * @returns {Promise}
             */
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
                            fill: 'none',
                            "fill-opacity": 0.5,
                            stroke: '#6da6f5',
                            "stroke-width": 0.8,
                            "stroke-opacity": 0.6
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
        width: 100%;
        height: 100%;
        margin: auto;
        background-color: #0c1323;
        .home-nav {
            width: 630px;
            height: 148px;
            margin: auto;
            .home-nav-top {
                width: 302px;
                height: 120px;
                float: left;
                margin: 24px 20px 0 0;
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
                            text-align: right;
                        }
                    }
                }
                .nav-all {
                    .bar-bg {
                        margin-top: 13px;
                    }
                }
                .nav-all,
                .nav-usable,
                .nav-lock {
                    font-size: 12px;
                    line-height: 1.5rem;
                    label {
                        margin-left: 1rem;
                        width: 60px;
                        text-align: right;
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