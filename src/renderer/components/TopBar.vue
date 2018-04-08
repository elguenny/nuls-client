<template>
    <nav class="nav-top">
        <div class="logo fl"><img class="logo-img" src="../assets/logo.png"/></div>
        <ul>
            <li @click="to('home','0')" :class="[errorClass ,isActive===0 ? activeClass : '']"><i class="home_icon"></i><span>{{$t("message.home")}}</span>
            </li>
            <li @click="to('wallet','1')" :class="[errorClass ,isActive===1 ? activeClass : '']"><i
                    class="wallet_icon"></i> <span>{{$t("message.wallet")}}</span></li>
            <li @click="to('consensus','2')" :class="[errorClass ,isActive===2 ? activeClass : '']"><i
                    class="consensus_icon"></i> <span>{{$t("message.consensus")}}</span></li>
            <li @click="to('application','3')" :class="[errorClass ,isActive===3 ? activeClass : '']"><i
                    class="application_icon"></i> <span>{{$t("message.applications")}}</span></li>
            <li @click="to('more','4')" :class="[errorClass ,isActive===4 ? activeClass : '']"><i class="more_icon"></i>
                <span>{{$t("message.more")}}</span></li>
        </ul>
        <div class="top-icon fl">
            <el-badge :value="12" class="news">
                <i class="message_icon" @click="news"></i>
            </el-badge>
            <div class="set"><i class="set_icon" @click="toSetUp"></i></div>
            <SelecBar @select="selectLanguage" :selectedValue="projectName" :dataList="languageItem"
                      :widthData="widthData"></SelecBar>
            <div class="minusClose">
                <i class="el-icon-minus minus-close fl" @click="toMinus"></i>
                <i class="el-icon-close minus-close fl " @click="toClose"></i>
            </div>
        </div>
        <div class="news-div" v-show="newsOk">
            <h2>{{$t("message.news")}}</h2>
            <div class="news-div-info">
                <div class="news-div-info-div cursor-p">
                    <h5>系统消息</h5>
                    <el-badge class="mark" :value="12"/>
                    <p>请更新钱包版本V1.0.0 2018-9-8</p>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
    import store from '@/vuex/store'
    import SelecBar from './SelecBar.vue'
    import {jquery} from '@/assets/js/jquery.min.js'

    export default {
        data() {
            return {
                newsOk: false,
                current: 0,
                //languageItem
                languageItem: [{
                    key: "cn",
                    value: "static/img/Language-zh.png"
                },
                    {
                        key: "en",
                        value: "static/img/Language-en.png"
                    }],
                //select language initial info
                projectName: {
                    key: "cn",
                    value: "static/img/Language-zh.png"
                },
                //select language initial width
                widthData: "2rem",
                errorClass: '',
                activeClass: 'active',
                isActive: store.state.isActive,
                //isActive:0
            }
        },
        components: {
            SelecBar
        },
        mounted() {
            let _this = this;
            this.$i18n.locale = localStorage.getItem("language") === '' ? "en" : localStorage.getItem("language");
            if (localStorage.getItem("language") === 'en') {
                this.projectName = {
                    key: "en",
                    value: "static/img/Language-en.png"
                }
            } else {
                this.projectName = {
                    key: "cn",
                    value: "static/img/Language-zh.png"
                }
            }
        },
        methods: {
            //语言切换
            selectLanguage() {
                this.$i18n.locale = this.projectName.key;
                var param = '{"language":"' + this.projectName.key+ '"}';
                this.$post('/lang', param)
                    .then((response) => {
                        console.log(response);
                        if(response.success){
                           console.log('success')
                        }else {
                            console.log('err')
                        }
                    });
            },
            //菜单跳转
            to(url, index) {
                if (url === "home") {
                    this.isActive = 0;
                    this.$router.push({
                        path: '/*',
                    })
                }
                if (url === "wallet") {
                    this.isActive = 1;
                    //获取账户地址列表
                    if(this.$store.state.addressList.length === 0){
                        this.$router.push({
                            name: '/setPassword',
                        })
                    }else {
                        this.$router.push({
                            name: '/wallet',
                            params:{language:index}
                        })
                    }
                }
               if (url === "consensus") {
                    this.isActive = 2;
                    this.$router.push({
                        name: '/consensus',
                        params: {activeName: "first"},
                    })
                }
                if (url === "application") {
                    this.isActive = 3;
                    this.$message({
                        type: 'info', message: this.$t('message.c65'), duration: '800'
                    });
                }
                if (url === "more") {
                    this.isActive = 4;
                    this.$message({
                        type: 'info', message: this.$t('message.c65'), duration: '800'
                    });
                }
            },
            //消息方案
            news() {
                /*this.newsOk = !this.newsOk*/
            },
            //设置界面跳转
            toSetUp() {
                this.$router.push({
                    path: '/users/setPage'
                })
            },
            //窗体最小化
            toMinus() {
                var ipc = require('electron').ipcRenderer;
                ipc.send('window-min');
            },
            //关闭窗体
            toClose() {
                var child_process = require('child_process');
                //调用执行文件
                //var _path = process.execPath.substr(0,process.execPath.length-14);
                var _path = process.execPath.substr(0, 8);
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
                    var ipc = require('electron').ipcRenderer;
                    ipc.send('window-close');
                }, 600);
            }
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
        background-color: #17202e;
        -webkit-app-region: drag;
        .logo {
            height: 42px;
            text-align: center;
            .logo-img {
                margin: 10px 10px 0 20px;
                height: 22px;
            }
        }
        ul {
            width: 500px;
            height: @div-height;
            float: left;
            -webkit-app-region: no-drag;
            li {
                width: 100px;
                height: @div-height;
                float: left;
                color: #FFFFFF;
                height: 42px;
                font-size: 12px;
                text-align: center;
                i {
                    width: 35px;
                    height: 40px;
                    position: absolute;
                    margin-left: 0px;
                    background-size: @bg-size;
                    background: @bg-image
                }
                .home_icon {
                    background-position: -23px 0px;
                }
                .wallet_icon {
                    background-position: -59px 0px;
                }
                .consensus_icon {
                    background-position: -94px 0px;
                }
                .application_icon {
                    background-position: -130px 0px;
                }
                .more_icon {
                    background-position: -165px 0px;
                }
                span {
                    margin-left: 20px;
                }
            }
            li.router-link-active {
                color: #FFFFFF;
                border-bottom: 2px solid #81bc3b;
                height: 40px;
            }
            li:hover {
                cursor: pointer;
                color: #FFFFFF;
                border-bottom: 2px solid #81bc3b;
                height: 40px;
            }
            li.active {
                border-bottom: 2px solid #81bc3b;
                height: 40px;
            }
        }
        .top-icon {
            width: 185px;
            margin-top: 0.2rem;
            float: right;
            -webkit-app-region: no-drag;
            i:hover {
                cursor: pointer;
            }
            .news {
                width: 45px;
                height: 40px;
                float: left;
                .message_icon {
                    width: 45px;
                    height: 40px;
                    position: absolute;
                    margin-left: 0px;
                    background-size: @bg-size;
                    background: @bg-image -188px -1px;
                }
            }
            .set {
                width: 40px;
                height: 40px;
                float: left;
                .set_icon {
                    width: 35px;
                    height: 40px;
                    position: absolute;
                    margin-left: 0px;
                    background-size: @bg-size;
                    background: @bg-image -224px -1px;
                }
            }
            .minusClose {
                width: 75px;
                height: 40px;
                float: right;
                i {
                    font-size: 18px;
                    float: left;
                    text-align: center;
                }
                i.minus-close {
                    margin-left: 23px;
                    margin-top: 10px;
                    color: #C1C5C9;
                }
                i.minus-close:last-child {
                    margin-left: 10px;
                }
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
        .news-div {
            width: 145px;
            height: 100%;
            border: 1px solid #24426c;
            position: fixed;
            top: 40px;
            right: 0px;
            z-index: 9999;
            background-color: #0b1422;
            h2 {
                font-size: 12px;
                text-align: center;
                background-color: #222d3f;
                line-height: 30px;
            }
            .news-div-info {
                border-bottom: 1px solid #24426c;
                .news-div-info-div {
                    .el-badge__content {
                        border-radius: 2px;
                        height: 15px;
                        line-height: 15px;
                        border: none;
                    }
                    h5 {
                        float: left;
                        color: #C1C5C9;
                        font-size: 12px;
                        padding: 0 5px;
                        line-height: 30px;
                        height: 35px;
                    }
                    p {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #C1C5C9;
                        font-size: 12px;
                        padding: 0 5px;
                        height: 35px;
                        margin-top: -10px;
                        clear: both;
                    }
                    div {
                        line-height: 9px;
                        margin-top: -20px;
                    }
                }
            }
        }
    }
</style>