<template>
    <footer>
        <el-col :span="10" class='footer-left'>
            <span @click="clearData">{{$t("message.purseVersion")}}</span>：V{{this.$store.getters.getPurseVersiont}}（{{$t("message.coreVersion")}}
            V{{ this.bottomItem.myVersion }}）
            <span @click="updateVersionUrl" v-show="updateVersion"
                  class="cursor-p text-d">{{$t("message.toUpdate")}}</span>
        </el-col>
        <el-col :span="14" class='footer-right'>
            {{$t("message.blockState")}}：{{$t("message.local")}} {{ netWorkInfo.localBestHeight }}<span
                v-show="timeOffsetOk">（ {{$t("message.backward")}} {{ netWorkInfo.timeOffset }} ）</span> /
            {{$t("message.theMain")}} {{netWorkInfo.netBestHeight}}
            <i :class="iconWifi" :title="connectNumber"></i>
        </el-col>
    </footer>
</template>

<script>
    import { ipcRenderer } from "electron";
    export default {
        data() {
            return {
                bottomItem: [],
                updateVersion: false,
                timeOffsetOk: true,
                connectNumber: '0',
                netWorkInfo: [],
                iconWifi: 'no-wifi_icon',
                rejectTime: 0,
                rejectOut: 6,
                messageBox: 0,
            }
        },
        mounted() {
            let _this = this;

            /*ipcRenderer.on("message", (event, text) => {
                console.log(arguments);
                this.tips = text;
            });
            ipcRenderer.on("downloadProgress", (event, progressObj)=> {
                console.log(progressObj);
                this.downloadPercent = progressObj.percent || 0;
            });
            ipcRenderer.on("isUpdateNow", () => {
                ipcRenderer.send("isUpdateNow");
            });
            //组件销毁前移除所有事件监听channel
            ipcRenderer.removeAll(["message", "downloadProgress", "isUpdateNow"]);*/

            //encapsulated https
            setInterval(() => {
                //根据messageBox判断弹框只执行一次
                if (this.messageBox === 0) {
                    //每过5000毫秒*3弹出出现
                    if (this.rejectTime > this.rejectOut) {
                        this.messageBox = 1;
                        sessionStorage.setItem("userList", "0");
                        this.$confirm(this.$t('message.c97'), this.$t('message.c86'), {
                            confirmButtonText: this.$t('message.c98'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                        }).then(() => {
                            let child_process = require('child_process');
                            //调用执行文件
                            let _path = process.execPath.substr(0, process.execPath.length - 14);
                            //var _path = process.execPath.substr(0, 8);
                            //alert(_path);
                            child_process.execFile(_path + 'java\\bin\\stop.bat', null, {cwd: _path + 'java\\bin\\'}, function (error) {
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                                else {
                                    console.log('成功执行指令!');
                                }
                            });
                            setTimeout(() => {
                                const ipc = require('electron').ipcRenderer;
                                ipc.send('window-close');
                            }, 600);
                        }).catch(() => {
                            this.messageBox = 0;
                            this.rejectOut = this.rejectOut * 3;
                        });
                        console.log("请检查您的网络！")
                    }
                }
                this.getNetWorkInfo('/network/info');
            }, 1000);

            setTimeout(() => {
                this.getBottromInfo('/sys/version');
            }, 9000);

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
                        //console.log(response);
                        if (response.success) {
                            this.bottomItem = response.data;
                            if (response.data.myVersion !== response.data.newestVersion) {
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
            updateVersionUrl() {
                //console.log('更新！');
                alert("开始更新....");
                //ipcRenderer.send("checkForUpdate");
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
                        //console.log(response);
                        if (response.success) {
                            if (this.rejectTime > 1) {
                                this.rejectTime = this.rejectTime - 1;
                            }
                            //调用用户地址列表没有就调用一下获取用户方法
                            if (this.$store.getters.getAddressList.length === 0) {
                                this.getAccountList("/account/list");
                            }
                            sessionStorage.setItem("userList", "1");
                            this.rejectTime = 0;
                            this.netWorkInfo = response.data;
                            this.$store.commit("setNetWorkInfo",response.data);
                            let wifi = this.netWorkInfo.inCount + this.netWorkInfo.outCount;
                            this.connectNumber = this.netWorkInfo.inCount + this.netWorkInfo.outCount;
                            if (wifi !== 0) {
                                if (wifi < 15) {
                                    this.iconWifi = 'two-wifi_icon';
                                    if (wifi < 5) {
                                        this.iconWifi = 'one-wifi_icon';
                                    }
                                } else {
                                    this.iconWifi = 'wifi_icon';
                                }
                            } else {
                                this.iconWifi = 'no-wifi_icon';
                            }
                        }
                    }).catch((reject) => {
                    this.rejectTime = this.rejectTime + 1;
                    sessionStorage.setItem("userList", "0")
                });
            },
            //获取账户地址列表
            getAccountList(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.$store.commit("setAddressList",response.data.list);
                        }
                    }).catch((reject) => {
                    console.log("User List err" + reject);
                });
            },
            //测试清理数据
            clearData() {
                /*localStorage.setItem('fastUser', "0");
                localStorage.setItem("language", "en");
                localStorage.setItem("newAccountAddress", "");
                localStorage.setItem("userPass", "");
                indexedDB.deleteDatabase("usersDB");*/
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
        bottom: 0;
        font-size: 12px;
        .footer-left {
            text-indent: 2rem;
            span {
                color: #C1C5C9;
            }
        }
        .footer-right {
            text-align: right;
            i {
                width: 20px;
                height: 30px;
                display: block;
                margin-top: -5px;
                margin-left: 5px;
                float: right;
                background-size: @bg-size;
                background: @bg-image
            }
            .no-wifi_icon {
                background-position: -129px -34px;
            }
            .one-wifi_icon {
                background-position: -90px -36px;
            }
            .two-wifi_icon {
                background-position: -58px -36px;
            }
            .wifi_icon {
                background-position: -20px -36px;
            }
        }
    }
</style>