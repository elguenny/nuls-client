<template>
    <div id="app"
         v-loading="loadingHome"
         :element-loading-text="this.$t('message.c132')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 1)">
        <!--top start -->
        <Top></Top>
        <!--top end -->
        <transition>
            <router-view></router-view>
        </transition>
        <!--bottom start -->
        <Bottom v-show="bottomOk"></Bottom>
        <!--bottom end -->
        <el-dialog title="Language" :visible.sync="selectedValueVisible" top="35vh" :show-close="false"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="form">
                <el-form-item label="Language:" :label-width="formLabelWidth">
                    <el-select v-model="form.region">
                        <el-option label="English" value="en"></el-option>
                        <el-option label="简体中文" value="cn"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="selectedValue" style="margin-right: 0px; width: 250px">OK</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Top from './components/TopBar.vue'
    import Bottom from './components/BottomBar.vue'

    export default {
        name: 'app',
        data() {
            return {
                //全局加载
                loadingHome: true,
                bottomOk: false,
                selectedValueVisible: false,
                form: {
                    region: 'en',
                },
                formLabelWidth: '100px'
            }
        },
        components: {
            Top,
            Bottom
        },
        created() {
            let appSet = setInterval(() => {
                this.getBottromInfo();
                //判断是否连接到后台程序
                if (sessionStorage.getItem('homeJava') === '1') {
                    //用户是否选择语言
                    if (localStorage.hasOwnProperty("language")) {
                        this.loadingHome = false;
                        this.bottomOk = true;
                        clearInterval(appSet);
                    } else {
                        this.selectedValueVisible = true;
                        clearInterval(appSet);
                    }
                }
            }, 3000);
        },
        methods: {
            selectedValue() {
                this.$i18n.locale = this.form.region;
                this.loadingHome = false;
                this.bottomOk = true;
                localStorage.setItem("language", this.form.region);
                this.selectedValueVisible = false;
            },
            //根据账户地址获取资产列表
            getBottromInfo() {
                this.$fetch('/sys/version')
                    .then((response) => {
                        sessionStorage.setItem("homeJava", "1")
                    }).catch((reject) => {
                    sessionStorage.setItem("homeJava", "0")
                });
            },
        }
    }
</script>
<style lang="less">
    .el-dialog__title {
        color: #0c1323;
    }
</style>