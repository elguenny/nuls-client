<template>
    <nav class="nav-top">
        <div class="logo fl"><img class="logo-img" src="../assets/logo.png"/></div>
        <ul>
            <li @click="to('home','0')" :class="[errorClass ,isActive===0 ? activeClass : '']"><i class="icon-home_icon"></i> <span>首页</span>
            </li>
            <li @click="to('wallet','1')" :class="[errorClass ,isActive===1 ? activeClass : '']"><i class="icon-page_icon"></i> <span>钱包</span></li>
            <li @click="to('consensus','2')" :class="[errorClass ,isActive===2 ? activeClass : '']"><i class="icon-consensus_icon"></i> <span>共识</span></li>
            <li @click="to('application','3')" :class="[errorClass ,isActive===3 ? activeClass : '']"><i class="icon-use_icon"></i> <span>应用</span></li>
            <li @click="to('more','4')" :class="[errorClass ,isActive===4 ? activeClass : '']"><i class="icon-more_icon"></i> <span>更多</span></li>
        </ul>
        <div class="top-icon fl">
            <el-badge :value="12" class="news fl">
                <i class="el-icon-bell" @click="news"></i>
            </el-badge>
            <i class="el-icon-setting" @click="toSetUp"></i>
            <SelecBar @select="selectLanguage" :selectedValue="projectName" :dataList="languageItem"
                      :widthData="widthData"></SelecBar>
            <i class="el-icon-minus minus-close fl" @click="toMinus"></i>
            <i class="el-icon-close minus-close fl " @click="toClose"></i>
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
    import SelecBar from './SelecBar.vue'
    import {jquery} from '@/assets/js/jquery.min.js'

    export default {
        data() {
            return {
                newsOk: false,
                current: 0,
                //languageItem
                languageItem: [{
                    key: "zh",
                    value: "static/img/Language-zh.png"
                },
                    {
                        key: "en",
                        value: "static/img/Language-en.png"
                    }],
                //select language initial info
                projectName: {
                    key: "zh",
                    value: "static/img/Language-zh.png"
                },
                //select language initial width
                widthData: "2rem",
                errorClass:'',
                activeClass:'active',
                isActive:0
            }
        },
        components: {
            SelecBar
        },
        mounted() {
            let _this = this;
            this.$i18n.locale = localStorage.getItem("language") == null ? "zh" : localStorage.getItem("language");
        },
        methods: {
            /**
             * method statement
             * @method selectLanguage
             * @return {string} select language type
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            selectLanguage() {
                this.$i18n.locale = this.projectName.key;
            },
            //菜单跳转
            to(url, index) {
                /*console.log(url + "====" + index);*/
                /* $(this).addClass("active").siblings().removeClass("active");*/
                /*this.current==true;*/
                $(this).addClass("active");
                if (url === "home") {
                    this.isActive = 0;
                    this.$router.push({
                        path: '/*',
                    })
                }
                if (url === "wallet") {
                    this.isActive = 1;
                    if (localStorage.getItem("fastUser") == "0" || localStorage.getItem("newAccountAddress") == null) {
                        this.$router.push({
                            name: '/setPassword',
                        })
                    } else {
                        this.$router.push({
                            path: '/wallet'
                        })
                    }
                }
                if (url === "consensus") {
                    this.isActive = 2;
                    this.$router.push({
                        name: '/consensus',
                    })
                }
                if (url === "application") {
                    this.isActive = 3;
                    this.$message({
                        type: 'info', message: "我们的工程师正专注研发，更多出色功能敬请期待！"
                    });
                }
                if (url === "more") {
                    this.isActive = 4;
                    this.$message({
                        type: 'info', message: "我们的工程师正专注研发，更多出色功能敬请期待！"
                    });
                }
            },
            /**
             * method statement
             * @method news
             * @author Wave
             * @date 2018-3-5
             * @version 1.0
             **/
            news() {
                /*this.newsOk = !this.newsOk*/
            },
            /**
             * method statement
             * @method toSetUp
             * @author Wave
             * @date 2018-3-5
             * @version 1.0
             **/
            toSetUp() {
                this.$router.push({
                    path: '/users/setPage'
                })
            },
            /**
             * method statement
             * @method toMinus
             * @author Wave
             * @date 2018-3-5
             * @version 1.0
             **/
            toMinus() {
                var ipc = require('electron').ipcRenderer;
                ipc.send('window-min');
            },
            /**
             * method statement
             * @method toClose
             * @author Wave
             * @date 2018-3-5
             * @version 1.0
             **/
            toClose() {
                console.log("toClose");
                var ipc = require('electron').ipcRenderer;
                ipc.send('window-close');
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
        background-color: #181f2f;
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
            width: 400px;
            height: @div-height;
            float: left;
            -webkit-app-region: no-drag;
            li {
                width: 80px;
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
            .news {
                width: 2rem;
            }
            i {
                font-size: 18px;
            }
            i:hover {
                cursor: pointer;
            }
            i.minus-close {
                margin-left: 65px;
                margin-top: 10px;
                color: #C1C5C9;
            }
            i.minus-close:last-child {
                margin-left: 10px;
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