<template>
    <div class="first-info">
        <Back :backTitle="backTitle" v-show="backOk"></Back>
        <div class="backOk" v-show="backOks"></div>
        <h2>创建或导入账户</h2>
        <ul>
            <li @click="newAccount">
                <span>{{$t("message.createNewAccount")}}</span>
                <label>{{$t("message.createNewAccountInfo")}}</label>
            </li>
            <li @click="importAccount">
                <span>{{$t("message.importAccount")}}</span>
                <label>{{$t("message.importAccountInfo")}}</label>
            </li>
        </ul>
    </div>
</template>

<script>
    import moment from 'moment';
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: '账户管理',
                backOk: localStorage.getItem('toUserInfo') === "1" ? true : false,
                backOks: localStorage.getItem('toUserInfo') === "1" ? false : true,
            }
        },
        components: {
            Back,
        },
        methods: {
            /** newAccount
             * @method newAccount
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            newAccount() {
                if (localStorage.getItem('userPass') == '') {
                    this.$confirm('对不起，您还没设置密码请先设置密码', '提示', {
                        confirmButtonText: '去设置密码',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            name: '/setPassword',
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '你取消了设置密码！'
                        });
                    });
                } else {
                    this.$prompt(this.$t('message.passWordTitle'), '', {
                        confirmButtonText: this.$t('message.confirmButtonText'),
                        cancelButtonText: this.$t('message.cancelButtonText'),
                        inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                        inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                        inputType: 'password'
                    }).then(({value}) => {
                        if (value === localStorage.getItem('userPass')) {
                            var password = localStorage.getItem('userPass');
                            localStorage.setItem('lockTime', moment().format('h:mm:ss'));
                            var param = '{"count":1,"password":"' + password + '"}';
                            this.$post('/account', param)
                                .then((response) => {
                                    if (response.success) {
                                        this.$message({
                                            type: 'success', message: this.$t('message.passWordSuccess')
                                        });
                                        localStorage.setItem('newAccountAddress', response.data[0]);
                                        this.$router.push({
                                            name: '/newAccount',
                                            params: {newOk: true, address: ''},
                                        })
                                    } else {
                                        this.$message({
                                            type: 'warning', message: "对不起！创建失败：" + response.msg
                                        });
                                    }
                                });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: this.$t('message.passWordWasincorrect')
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'warning',
                            message: this.$t('message.enterCance')
                        });
                    });
                }
            },
            /** importAccount
             * @method importAccount
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            importAccount() {
                if (localStorage.getItem('userPass') == '') {
                    this.$confirm('对不起，您还没设置密码请先设置密码', '提示', {
                        confirmButtonText: '去设置密码',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            name: '/setPassword',
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '你取消了设置密码！'
                        });
                    });
                } else {
                    this.$router.push({
                        path: '/firstInto/firstInfo/importAccount'
                    })
                }

            }
        }
    }
</script>
<style lang="less">
    .first-info {
        width: 100%;
        height: 100%;
        .backOk {
            height: 50px;
        }
        h2 {
            width: 200px;
            margin: auto;
            line-height: 22px;
            font-size: 16px;
            text-align: center;
        }
        ul {
            width: 60%;
            height: 50%;
            margin: 77px auto;

            li {
                width: 40%;
                height: 11rem;
                float: left;
                margin-right: 18%;
                border: 1px solid #1e314d;
                background-color: #181f2f;
                text-align: center;
                cursor: pointer;
                span {
                    display: block;
                    font-size: 16px;
                    line-height: 6rem;
                    font-weight: 500;
                }
                label {
                    display: block;
                    font-size: 12px;
                    padding: 0 1rem;
                    text-align: left;
                    color: #C1C5C9;
                }
            }
            li:hover {
                cursor: pointer;
                border-color: #658ec7;
            }
            li:last-child {
                margin-right: 0px;
            }
        }
    }
</style>