<template>
    <div class="first-info">
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
    import axios from 'axios';
    export default {
        data() {
            return {}
        },
        methods: {
            /** newAccount
             * @method newAccount
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            newAccount() {
                this.$prompt(this.$t('message.passWordTitle'), '', {
                    confirmButtonText: this.$t('message.confirmButtonText'),
                    cancelButtonText: this.$t('message.cancelButtonText'),
                    inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                    inputErrorMessage:this.$t('message.walletPassWordEmpty')
                }).then(({value}) => {
                   if(value ===  localStorage.getItem('userPass')){
                       var password=localStorage.getItem("userPass");
                       var param = '{"count":1,"password":"'+password+'"}';
                       this.$post('/account',param)
                           .then((response) => {
                               if(response.success){
                                   this.$message({
                                       type: 'success', message: this.$t('message.passWordSuccess')
                                   });
                                   localStorage.setItem('newAccountAddress', response.data[0]);
                                   this.$router.push({
                                       path: '/firstInto/firstInfo/newAccount'
                                   })
                               }else {

                                   this.$message({
                                       type: 'warning', message:this.$t('message.passWordFailed')
                                   });
                               }
                           });
                    }else {
                       this.$message({
                           type: 'success',
                           message: this.$t('message.passWordWasincorrect')
                       });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.enterCance')
                    });
                });
            },
            /** importAccount
             * @method importAccount
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            importAccount() {
                this.$router.push({
                    path: '/firstInto/firstInfo/importAccount'
                })
            }
        }
    }
</script>
<style lang="less">
    .first-info {
        width: 100%;
        height: 100%;
        ul {
            width: 60%;
            height: 50%;
            margin: auto;
            margin-top: 140px;
            li {
                width: 40%;
                height: 11rem;
                float: left;
                margin-right: 18%;
                border: 1px solid #658cc5;
                background-color: #181f2f;
                text-align: center;
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
                }
            }
            li:last-child {
                margin-right: 0px;
            }
        }
    }
</style>