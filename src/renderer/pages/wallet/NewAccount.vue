<template>
    <div class="new-account">
        <Back :backTitle="backTitle" v-show="newOks"></Back>
        <div class="new-account-top">
            <h1 v-show="newOk">{{$t("message.newAccountTitle")}}</h1>
            <h2>
                {{$t("message.newAccountAddress")}}:{{ newAccountAddress }}
            </h2>
            <div class="new-account-key">
                <h3 class="fl">
                    {{$t("message.newAccountKey")}}：
                    <input :type="keyShow ? 'text' : 'password'" v-model="keyInfo" readonly="readonly">
                </h3>
                <i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="keyShow = !keyShow"></i>
                <i class="" @click="keyCode"></i>
                <CodeBar v-show="codeShowOk " :keyInfo="keyInfo" v-on:codeShowOks="codeShowOks" ref="codeBar"></CodeBar>
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
        </ul>
        <div class="cl new-bt">
            <el-button type="primary" class="new-submit" @click="newSubmit()">{{$t("message.newAccountSubmit")}}
            </el-button>
            <el-button type="primary" class="new-reset" @click="newReset()" v-show="newOk">
                {{$t("message.newAccountReset")}}
            </el-button>
        </div>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import CodeBar from '@/components/CodeBar.vue'
    import {jquery} from '@/assets/js/jquery.min.js'
    import {jvectormap} from '@/assets/js/jquery.qrcode.min.js'

    export default {
        data() {
            return {
                backTitle: this.$t('message.accountManagement'),
                keyShow: false,
                keyInfo: '',
                newAccountAddress: this.$route.params.address == "" ? localStorage.getItem('newAccountAddress') : this.$route.params.address,
                codeShowOk: false,
                newOk: this.$route.params.newOk,
                newOks: this.$route.params.newOk ? false : true,
                //address:this.$route.params.address,
            }
        },
        components: {
            Back,
            CodeBar
        },
        mounted() {
            let _this = this;
            var address = this.newAccountAddress;
            var password = localStorage.getItem('userPass');
            var param = '{"address":"' + address + '","password":"' + password + '"}';
            this.$post('/account/prikey', param)
                .then((response) => {
                    console.log(response);
                    this.keyInfo = response.data;
                });
        },
        methods: {
            keyCode() {
                this.$refs.codeBar.codeMaker(this.keyInfo)
                this.codeShowOk = !this.codeShowOk;
            },
            codeShowOks() {
                this.codeShowOk = false;
            },
            /** Backups Key
             * @method backupsKey
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            backupsKey() {
                var path = require('path');
                var _path = path.join(__dirname, '../../../../pubKey.txt');
                /* var _path ="D:/work/nuls-client/pubKey.txt";*/
                //console.log(_path)
                var fs = require('fs');
                fs.readFile(_path, 'utf8', function (err, data) {
                    if (err) return console.log(err);
                });

                fs.writeFile(_path, this.keyInfo, function (err) {
                    if (!err)
                        console.log("写入成功！" + _path)
                })
                /*var downloadFileAddress = "D:/work/nuls-client/pubKey.txt";*/
                const {dialog} = require('electron').remote;
                const {ipcRenderer} = require('electron');
                ipcRenderer.on('tips', (event, person) => {
                });
                dialog.showOpenDialog({
                    defaultPath: '../Desktop',
                    properties: [
                        'openDirectory',
                    ],
                    filters: [
                        {name: 'All', extensions: ['*']},
                    ]
                }, function (res) {
                    if (res[0] != "") {
                        ipcRenderer.send('download', _path + "+" + res[0]);
                        /*fs.unlink(_path, function (err) {
                                 if (err) return console.log(err);
                                 console.log('文件删除成功');
                             });*/
                        alert("保存成功！路径:" + res);
                    } else {
                        alert("请选择保存文件夹！");
                    }
                })
            },
            /** Backups Code
             * @method backupsCode
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            backupsCode() {
                $('.qrcode').qrcode({
                    render: "canvas",
                    width: 256,
                    height: 256,
                    text: this.keyInfo,
                    typeNumber: -1,
                    correctLevel: 2,
                    background: "#ffffff",
                    foreground: "#000000"
                });
                this.exportCanvasAsPNG($(".qrcode").find("canvas")[0], "code.png");
            },
            /** Export Canvas As PNG
             * @method exportCanvasAsPNG
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            exportCanvasAsPNG(canvas, fileName) {
                const {dialog} = require('electron').remote;
                const {ipcRenderer} = require('electron');
                ipcRenderer.on('tips', (event, person) => {
                });
                dialog.showOpenDialog({
                    defaultPath: '../Desktop',
                    properties: [
                        'openDirectory',
                    ],
                    filters: [
                        {name: 'All', extensions: ['*']},
                    ]
                }, function (res) {
                    if (res[0] != "") {
                        var MIME_TYPE = "image/png";
                        var dlLink = document.createElement('a');
                        dlLink.download = fileName;
                        dlLink.href = canvas.toDataURL("image/png");
                        //var fs = require('fs');
                        //fs.writeFileSync('code11.png', dlLink.href.slice('22'), 'utf8');
                        //var path = require('path');
                        var _path = path.join(__dirname, '../../../../code.png');
                        //var _path = "D:/work/nuls-client/code.png";
                        ipcRenderer.send('download', _path + "+" + res[0]);
                        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.href].join(':');
                        document.body.appendChild(dlLink);
                        dlLink.click();
                        document.body.removeChild(dlLink);
                        $('.qrcode').html("");
                        alert("保存成功！路径:" + res);
                    } else {
                        alert("请选择保存文件夹！");
                    }
                })
            },

            /** Backup File
             * @method backupFile
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            backupFile(downloadAddress) {
                const {dialog} = require('electron').remote;
                const {ipcRenderer} = require('electron');
                ipcRenderer.on('tips', (event, person) => {
                });
                dialog.showOpenDialog({
                    defaultPath: '../Desktop',
                    properties: [
                        'openDirectory',
                    ],
                    filters: [
                        {name: 'All', extensions: ['*']},
                    ]
                }, function (res) {
                    if (res[0] != "") {
                        ipcRenderer.send('download', downloadAddress + "+" + res[0]);
                        /*var fs = require('fs');
                        fs.unlink(downloadAddress, function (err) {
                                 if (err) return console.log(err);
                                 console.log('文件删除成功');
                             });*/
                        alert("保存成功！路径:" + res);
                    } else {
                        alert("请选择保存文件夹！");
                    }
                })
            },
            /** New Submit
             * @method newSubmit
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            newSubmit() {
                this.$confirm('请您备份好私钥！', '提示', {
                    confirmButtonText: '已经备份',
                    cancelButtonText: '马上备份',
                    type: 'warning'
                }).then(() => {
                    if(localStorage.getItem('toUserInfo') != "1"){
                        this.$router.push({
                            path: '/wallet'
                        })
                    }else {
                        this.$router.push({
                            path: '/wallet/users/userInfo'
                        })
                    }
                }).catch(() => {

                });

            },
            /** New Reset
             * @method newReset
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            newReset() {
                this.$router.push({
                    path: '/wallet'
                })
            }
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");
    .new-account {
        width: 90%;
        height: 100%;
        margin:4% auto 0px;
        font-size: 14px;
        line-height: 1.6rem;
        .back {
            margin-left: 0px;
        }
        .new-account-top {
            width: 90%;
            height: 120px;
            margin: 25px auto;
            text-align: left;
            h1 {
                padding: 1.2rem 0;
                font-size: 16px;
                font-weight: 500;
            }
            h2 {
            }
            .new-account-key {
                width: 120%;
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
                .icon{
                    width: 30px;
                    height: 20px;
                    display: block;
                    float: left;
                    background-size: @bg-size;
                    background: @bg-image
                }
                .icon-eye{
                    background-position: -159px -46px;
                }
                .icon-eye-blocked{
                    background-position: -226px -77px;
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
                    .qrcode {
                        padding: 20% 0 0 0;
                    }
                }
            }
        }
        ul {
            width: 65%;
            height: 50%;
            margin: auto;
            margin-top: 2%;
            li {
                width: 42%;
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
            li:last-child {
            }
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
            .new-submit {
            }
            .new-reset {
                background-color: #181f2f;
                border-color: #658cc5;
            }
        }
    }
</style>