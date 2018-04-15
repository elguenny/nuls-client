<template>
    <div class="wallet">
        <div class="search">
            <div class="account-top">
                <label>{{$t("message.indexAccountAddress")}}</label>
                <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
            </div>
            <div class="wallet-i">
                <i class="copy_icon copyBtn cursor-p" :data-clipboard-text="accountAddressValue"
                   @click="accountCopy"></i>
                <i class="qr_icon cursor-p" @click="accountCode"></i>
                <i class="zhanghu_icon fr cursor-p" @click="accountChoice"></i>
            </div>
            <CodeBar v-show="codeShowOk" v-on:codeShowOks="codeShowOks" ref="codeBar"></CodeBar>
        </div>
        <div class="wallet-hide" v-show="walletHide">
            <i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="toKeyShow"
               class="cursor-p"></i>
        </div>
        <div class="wallet-tab cl">
            <el-tabs v-model="activeName" @tab-click="handleClick" @dblclick="tab-clicks">
                <el-tab-pane :label="$t('message.indexAccountHome')" name="first">
                    <el-table :data="accountData">
                        <el-table-column :label="$t('message.indexProperty')" width="60" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.asset }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexSum')" width="150" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'"
                                       :value=(scope.row.balance*0.00000001).toFixed(8)
                                       readonly="readonly">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexUsable')" width="150" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'"
                                       :value=(scope.row.usable*0.00000001).toFixed(8)
                                       readonly="readonly">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexLock')" width="150" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'"
                                       :value=(scope.row.locked*0.00000001).toFixed(8)
                                       readonly="readonly" class="cursor-p text-d"
                                       @click="toLocked(accountAddressValue)">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.operation')" align='center'>
                            <template slot-scope="scope">
                                <span class="cursor-p text-d" @click="toTransfer(accountAddressValue)">{{$t("message.transfer")}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<el-pagination layout="prev, pager, next":total="1000 "></el-pagination>-->
                </el-tab-pane>
                <el-tab-pane :label="$t('message.transactionRecord')" name="second">
                    <el-table :data="dealList">
                        <el-table-column
                                prop="tag"
                                :label="$t('message.transactionType')"
                                width="110"
                                align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.type }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="txid" min-width="195" align='center'>
                            <template slot-scope="scope">
								<span @click="toTxid(scope.row.hash)" class="cursor-p text-d overflow">
									{{ scope.row.hashs }}
								</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.assetChange')" width="138" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.values }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.state')" width="85" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.status == '1' ? $t('message.confirmed'):$t('message.confirming') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.time')" width="145" align='center'>
                            <template slot-scope="scope">
                                <span>{{scope.row.times}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination layout="prev, pager, next" :page-size="9" :total=this.totalAll class="cb"
                                   v-show="totalAllOk = this.totalAll>8 ?true:false"
                                   @current-change="txIdConsensusSize"></el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import CodeBar from '@/components/CodeBar.vue';
    import AccountAddressBar from '@/components/AccountAddressBar.vue';
    import copy from 'copy-to-clipboard';
    import moment from 'moment';

    export default {
        data() {
            return {
                loading: true,
                walletHide: true,
                keyShow: false,
                codeShowOk: false,
                locale: localStorage.getItem('language'),
                accountAddress: [],
                accountAddressValue: localStorage.getItem('newAccountAddress'),
                accountData: [],
                dealList: [],
                activeName: localStorage.getItem('walletActiveName') === '' ? "first" : localStorage.getItem('walletActiveName'),
                tabName: 'first',
                totalAll: 0,
            }
        },
        components: {
            CodeBar,
            AccountAddressBar,
        },
        created() {
            //判断显示隐藏数字
            if (localStorage.getItem("keyShow") === 'true') {
                this.keyShow = true
            } else {
                this.keyShow = false
            }
            this.getAccountAssets("/account/assets/" + this.accountAddressValue);
            //判断用户选择的语言
            let language = localStorage.getItem('language');
            setInterval(() => {
                if (language !== localStorage.getItem('language')) {
                    language = localStorage.getItem('language');
                    this.getAccountTxList('/tx/list/', {
                        "address": this.accountAddressValue,
                        "pageSize": 9,
                        "pageNumber": 1
                    });
                } else {
                    language = localStorage.getItem('language');
                }
            }, 1000);

            //切换交易记录tab
            if (this.activeName === 'second') {
                this.getAccountTxList('/tx/list/', {
                    "address": this.accountAddressValue,
                    "pageSize": 9,
                    "pageNumber": 1
                });
            }
        },
        methods: {
            //根据账户地址获取资产列表
            getAccountAssets(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.accountData = response.data;
                        }
                    });
            },
            //根据用户地址获取用户交易列表
            getAccountTxList(url, param) {
                this.$fetch(url, param)
                    .then((response) => {
                        //console.log(param);
                        //console.log(response.data.list);
                        if (response.data != null) {
                            this.totalAll = response.data.total;
                            if (response.data.list.length > 0) {
                                this.dealList = response.data.list;
                                //this.$store.commit("setAccountTxList",response.data.list);
                                for (let i = 0; i < response.data.list.length; i++) {
                                    let length = this.dealList[i].hash.length;
                                    this.dealList[i].hashs = this.dealList[i].hash.substr(0, 10) + '...' + this.dealList[i].hash.substr(length - 10);
                                    this.dealList[i].type = this.switchTyep(response.data.list[i].type);
                                    this.dealList[i].values = (response.data.list[i].value * 0.00000001).toFixed(8);
                                    this.dealList[i].times = moment(response.data.list[i].time).format('YYYY-MM-DD hh:mm:ss');
                                }
                            } else {
                                this.dealList = [];
                            }
                        } else {
                            this.dealList = [];
                        }
                    });
            },
            //交易列表分页
            txIdConsensusSize(events) {
                this.getAccountTxList('/tx/list/', {
                    "address": this.accountAddressValue,
                    "pageSize": 9,
                    "pageNumber": events
                });
            },
            //获取下拉选择地址
            chenckAccountAddress(chenckAddress) {
                //console.log(chenckAddress)
                this.accountAddressValue = chenckAddress;
                if (this.activeName === "first") {
                    this.getAccountAssets("/account/assets/" + chenckAddress);
                } else {
                    this.getAccountTxList('/tx/list/', {"address": chenckAddress, "pageSize": 9, "pageNumber": 1});
                }
            },
            //查询交易类型
            switchTyep(type) {
                switch (type) {
                    case 1:
                        return this.$t('message.c118');
                        break;
                    case 2:
                        return this.$t('message.c119');
                        break;
                    case 3:
                        return this.$t('message.c120');
                        break;
                    case 4:
                        return this.$t('message.c121');
                        break;
                    case 5:
                        return this.$t('message.c122');
                        break;
                    case 11:
                        return this.$t('message.c123');
                        break;
                    case 90:
                        return this.$t('message.c124');
                        break;
                    case 91:
                        return this.$t('message.c125');
                        break;
                    case 92:
                        return this.$t('message.c126');
                        break;
                    case 93:
                        return this.$t('message.c127');
                        break;
                    case 94:
                        return this.$t('message.c128');
                        break;

                }
            },
            //tab切换
            handleClick(tab, event) {
                this.tabName = tab.name;
                if (tab.name !== "first") {
                    this.activeName = "second";
                    this.walletHide = false;
                    let params = {"address": this.accountAddressValue, "pageSize": 9, "pageNumber": 1};
                    this.getAccountTxList('/tx/list/', params);
                } else {
                    localStorage.setItem('walletActiveName', tab.name);
                    this.walletHide = true;
                    this.getAccountAssets("/account/assets/" + this.accountAddressValue);
                }
            },
            //复制功能
            accountCopy() {
                copy(this.accountAddressValue);
                this.$message({
                    message: this.$t('message.c129'),
                    type: 'success'
                });
            },
            //二维码显示
            accountCode() {
                this.$refs.codeBar.codeMaker(localStorage.getItem('newAccountAddress'));
                this.codeShowOk = !this.codeShowOk;
            },
            codeShowOks() {
                this.codeShowOk = false;
            },
            //账户管理跳转
            accountChoice() {
                localStorage.setItem('toUserInfo', '1');
                this.$router.push({
                    path: '/wallet/users/userInfo'
                })
            },
            //金额显示隐藏
            toKeyShow() {
                if (this.keyShow) {
                    localStorage.setItem("keyShow", false);
                    this.keyShow = false;
                } else {
                    localStorage.setItem("keyShow", true);
                    this.keyShow = true;
                }
            },
            //toTxid跳转
            toTxid(txId) {
                localStorage.setItem('walletActiveName', 'second');
                this.$router.push({
                    name: '/dealInfo',
                    params: {hash: txId},
                })
            },
            //toLocked 跳转冻结列表
            toLocked(address) {
                this.$router.push({
                    name: '/freezeList',
                    params: {address: address},
                })
            },
            //跳转转账
            toTransfer(address) {
                if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
                    this.$router.push({
                        name: '/transfer',
                        params: {address: address},
                    })
                }else {
                    this.$message({
                        message: this.$t('message.c133'),
                    });
                }
            },

        },
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .wallet {
        width: 86%;
        margin: 2rem auto;
        .account-top {
            margin: 0;
            float: left;
            .el-input__suffix {
                right: -15px;
            }
        }
        .search {
            height: 2.6rem;
            .search-account {
                width: 523px;
                .lable-title {
                    font-size: 14px;
                    margin-left: 17px;
                }
                .el-input__suffix {
                    margin-top: 0;
                }
                .el-input__inner {
                    border: 1px solid #658ec7;
                }
                .el-select .el-input .el-select__caret {
                    font-size: 1rem;
                }
            }
            .wallet-i {
                height: 30px;
                width: 183px;
                float: right;
                i {
                    width: 30px;
                    height: 20px;
                    display: block;
                    float: left;
                    background-size: @bg-size;
                    background: @bg-image
                }
                .copy_icon {
                    background-position: -198px -46px;
                }
                .qr_icon {
                    background-position: -235px -44px;
                }
                .zhanghu_icon {
                    background-position: -265px -46px;
                    float: right;
                }
            }
        }
        .wallet-hide {
            right: 7%;
            top: 133px;
            position: fixed;
            z-index: 800;
            .icon {
                width: 30px;
                height: 20px;
                display: block;
                float: left;
                background-size: @bg-size;
                background: @bg-image
            }
            .icon-eye {
                background-position: -159px -46px;
            }
            .icon-eye-blocked {
                background-position: -226px -77px;
            }
            .el-icon-view {
                font-size: 1rem;
            }
        }
        .cell {
            input {
                border: none;
                width: 100%;
                background-color: #0b1422;
                text-align: center;
            }
        }
        .wallet-tab {
            .el-tabs__item {
                color: #FFFFFF;
            }
            .el-tabs__item.is-active {
                color: #FFFFFF;
            }
            .el-tabs__nav-wrap::after {
                background: rgba(87, 107, 139, 0.1);
            }
        }
        .el-select {
            width: 400px;
        }

    }

    .el-table-filter {
        border: 1px solid #17202e;
        background-color: #17202e;
    }

    .el-select-dropdown__list {
        width: 413px;
    }

    .el-popper[x-placement^=bottom] .popper__arrow {
        display: none;
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: rgba(87, 107, 139, 0.2);
        .cell {
            input {
                background: rgba(87, 107, 139, 0);
            }
        }
    }
</style>