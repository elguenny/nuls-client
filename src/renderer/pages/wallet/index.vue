<template>
    <div class="wallet">
        <div class="search">
            <div class="search-account fl">
                <label>{{$t("message.indexAccountAddress")}}:</label>
                <template>
                    <el-select v-model="accountAddressValue" placeholder="请选择账户地址" @change="accountAddressChecked">
                        <el-option v-for="item in accountAddress" :key="item.address"
                                   :label="item.address + item.alias == null ? '('+item.alias+')' : '' " :value="item.address">
                        </el-option>
                    </el-select>
                </template>
            </div>
            <i class="icon-copy_icon copyBtn" :data-clipboard-text="accountAddressValue" @click="accountCopy"></i>
            <i class="icon-qr_icon" @click="accountCode"></i>
            <i class="icon-zhanghu_icon fr" @click="accountChoice"></i>
            <CodeBar v-show="codeShowOk" v-on:codeShowOks="codeShowOks" ref="codeBar"></CodeBar>
        </div>
        <div class="wallet-hide" v-show="walletHide">
            <i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="keyShow = !keyShow"></i>
        </div>
        <div class="wallet-tab cl">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('message.indexAccountHome')" name="first">
                    <el-table :data="accountData">
                        <el-table-column :label="$t('message.indexProperty')" min-width="30" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.asset }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexSum')" min-width="80" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'" :value=scope.row.balance*0.00000001
                                       readonly="readonly">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexUsable')" min-width="80" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'" :value=scope.row.usable*0.00000001
                                       readonly="readonly">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexLock')" min-width="80" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'" :value=scope.row.locked*0.00000001
                                       readonly="readonly" title="点击查看详情" class="cursor-p text-d" @click="toLocked(accountAddressValue)">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.operation')" align='center'>
                            <template slot-scope="scope">
                                <span class="cursor-p text-d" @click="toTransfer(accountAddressValue)">转账</span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column :label= "$t('message.operation')" align='center'>
                            <template slot-scope="scope">
                                <router-link to='/wallet/index/transfer' title='点击查看详情' >{{ scope.row.locked == 1 ? '转账' : '下载子链' }}</router-link>
                            </template>
                        </el-table-column>-->
                    </el-table>
                    <!--<el-pagination layout="prev, pager, next":total="1000 "></el-pagination>-->
                </el-tab-pane>
                <el-tab-pane :label="$t('message.transactionRecord')" name="second">
                    <el-table :data="dealList">
                        <el-table-column
                                prop="tag"
                                :label="$t('message.transactionType')"
                                min-width="30"
                                align='center'
                                :filters="[{ text: '转账', value: '转账' }, { text: '入账', value: '入账' }]"
                                :filter-method="filterTag"
                                filter-placement="bottom-end">
                            <template slot-scope="scope">
                                <el-tag
                                        :type="scope.row.transferType == '-1' ? 'primary' : 'success'"
                                        close-transition>{{scope.row.transferType == '-1' ? '转入':'转出'}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="txid" align='center'>
                            <template slot-scope="scope">
								<span @click="toTxid(scope.row.hash)" class="cursor-p text-d overflow">
									{{ scope.row.hash }}
								</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.assetChange')" min-width="30" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.values }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.state')" min-width="20" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.status =='1' ? '已确认':'待确认' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.time')" min-width="40" align='center'>
                            <template slot-scope="scope">
                                <span>{{scope.row.times}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<el-pagination background layout="prev, pager, next" :total="1000">
                    </el-pagination>-->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import CodeBar from '@/components/CodeBar.vue';
    import copy from 'copy-to-clipboard';
    import moment from 'moment';
    export default {
        data() {
            return {
                walletHide: true,
                keyShow: false,
                codeShowOk: false,
                accountAddress: [],
                accountAddressValue: localStorage.getItem('newAccountAddress'),
                accountData: [],
                dealList: [],
                activeName: 'first',
            }
        },
        components: {
            CodeBar
        },
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
            this.getAccountAssets("/account/assets/" + this.accountAddressValue);
            let params = {"address": this.accountAddressValue};
            this.getAccountTxList('/tx/address/list/', params);
        },
        methods: {
            //获取账户地址列表
            getaccountAddress(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.accountAddress = response.data;
                    });
            },
            //根据账户地址获取资产列表
            getAccountAssets(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.accountData = response.data;
                    });
            },
            //根据用户地址获取用户交易列表
            getAccountTxList(api, param) {
                this.$fetch(api, param)
                    .then((response) => {
                        this.dealList = response.data;
                       if (response.data.length != undefined) {
                           for (var i = 0; i < response.data.length; i++) {
                                this.dealList[i].values = response.data[i].value * response.data[i].transferType*0.00000001;
                                this.dealList[i].times = moment(response.data[i].time).format('YYYY-MM-DD hh:mm:ss');
                            }
                        } else {
                           this.dealList=''
                        }
                    });
            },
            //地址选择
            accountAddressChecked(value) {
                this.getAccountAssets("/account/assets/" + value);
                let params = {"address": value};
                this.getAccountTxList("/tx/address/list/", params);
                //console.log(value);
            },
            //tab切换
            handleClick(tab, event) {
                this.walletHide = !this.walletHide;
                console.log(tab, event);
            },
            //复制功能
            accountCopy() {
                copy(this.accountAddressValue);
                this.$message({
                    message: '复制成功！',
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
                this.$router.push({
                    path: '/wallet/users/userInfo'
                })
            },
            filterTag(value, row) {
                return row.deal_type === value;
            },
            //toTxid跳转
            toTxid(txId) {
                this.$router.push({
                    name: '/dealInfo',
                    params:{hash:txId},
                })
            },
            //toLocked 跳转冻结列表
            toLocked(address){
                this.$router.push({
                    name: '/freezeList',
                    params:{address:address},
                })
            },
            //跳转转账
            toTransfer(address) {
                this.$router.push({
                    name: '/transfer',
                    params:{address:address},
                })
            },

        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .wallet {
        width: 90%;
        margin: auto;
        margin-top: 2rem;
        .search {
            height: 2.6rem;
            .search-account {
                width: 80%;
                .el-input__suffix {
                    margin-top: 0px;
                }
                .el-input__inner {
                    border: 1px solid #658ec7;
                }
                .el-select .el-input .el-select__caret {
                    font-size: 1rem;
                }
            }
            .icon-copy_icon,
            .icon-qr_icon {
                margin-left: 1rem;
            }
        }
        .wallet-hide {
            right: 5%;
            top: 133px;
            position: fixed;
            z-index: 1020;
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
                background-color: #24426c;
            }
        }
        .el-select {
            width: 76%;
        }

    }

    .el-table-filter {
        border: 1px solid #17202e;
        background-color: #17202e;
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: rgba(87, 107, 139, 0.1);
        .cell {
            input {
                background: rgba(87, 107, 139, 0.1);
            }
        }
    }
</style>