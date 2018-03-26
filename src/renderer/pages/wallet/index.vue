<template>
    <div class="wallet">
        <div class="search">
            <div class="search-account fl">
                <label class="lable-title">{{$t("message.indexAccountAddress")}}</label>
                <template>
                    <el-select v-model="accountAddressValue" placeholder="请选择账户地址" @change="accountAddressChecked">
                        <el-option v-for="item in accountAddress" :key="item.address"
                                   :label="item.address + item.alias == null ? '('+item.alias+')' : '' "
                                   :value="item.address">
                        </el-option>
                    </el-select>
                </template>
            </div>
            <i class="icon-copy_icon copyBtn cursor-p" :data-clipboard-text="accountAddressValue" @click="accountCopy"></i>
            <i class="icon-qr_icon cursor-p" @click="accountCode"></i>
            <i class="icon-zhanghu_icon fr cursor-p" @click="accountChoice"></i>
            <CodeBar v-show="codeShowOk" v-on:codeShowOks="codeShowOks" ref="codeBar"></CodeBar>
        </div>
        <div class="wallet-hide" v-show="walletHide">
            <i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="keyShow = !keyShow" class="cursor-p"></i>
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
                                <input :type="keyShow ? 'text' : 'password'" :value=(scope.row.balance*0.00000001).toFixed(8)
                                       readonly="readonly">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexUsable')" width="150" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'" :value=(scope.row.usable*0.00000001).toFixed(8)
                                       readonly="readonly">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.indexLock')" width="150" align='center'>
                            <template slot-scope="scope">
                                <input :type="keyShow ? 'text' : 'password'" :value= (scope.row.locked*0.00000001).toFixed(8)
                                       readonly="readonly" class="cursor-p text-d"
                                       @click="toLocked(accountAddressValue)">
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.operation')" align='center'>
                            <template slot-scope="scope">
                                <span class="cursor-p text-d" @click="toTransfer(accountAddressValue)">{{$t("message.transfer")}}</span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column :label= "$t('message.operation')" align='center'>
                            <template slot-scope="scope">
                                <router-link to='/wallet/index/transfer' title='点击查看详情' >
                                {{ scope.row.locked == 1 ? '转账' : '下载子链' }}
                                </router-link>
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
                                width="110"
                                align='center'>
                                <!--:filters="[{ text: '转账', value: '转账' }, { text: '入账', value: '入账' }]"
                                :filter-method="filterTag"
                                filter-placement="bottom-end"-->
                            <template slot-scope="scope">
                                <span>{{ scope.row.type }}</span>
                               <!-- <el-tag
                                        :type="scope.row.transferType == '-1' ? 'primary' : 'success'"
                                        close-transition>{{scope.row.transferType == '-1' ? $t('message.rollOut'):$t('message.rollIn')}}
                                </el-tag>-->
                            </template>
                        </el-table-column>
                        <el-table-column label="txid" width="238" align='center'>
                            <template slot-scope="scope">
								<span @click="toTxid(scope.row.hash)" class="cursor-p text-d overflow">
									{{ scope.row.hash }}
								</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.assetChange')" width="112" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.values }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.state')" width="80" align='center'>
                            <template slot-scope="scope">
                                <span>{{ scope.row.status =='1' ? $t('message.confirmed'):$t('message.confirming') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.time')" width="148" align='center'>
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
                objType:[
                    {"tx1":"tx1","value":"共识奖励"},
                    {"tx2":"tx2","value":"转账交易"},
                    {"tx3":"tx3","value":"锁仓交易"},
                    {"tx4":"tx4","value":"解锁交易"},
                    {"tx5":"tx5","value":"零钱换整"},
                    {"tx11":"tx11","value":"设置别名"},
                    {"tx90":"tx90","value":"注册共识"},
                    {"tx91":"tx91","value":"加入共识"},
                    {"tx92":"tx92","value":"退出共识"},
                    {"tx93":"tx93","value":"黄牌惩罚"},
                    {"tx94":"tx94","value":"红牌惩罚"}
                ],
            }
        },
        components: {
            CodeBar
        },
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
            this.getAccountAssets("/account/assets/" + this.accountAddressValue);
        },
        methods: {
            //获取账户地址列表
            getaccountAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if(response.success){
                            this.accountAddress = response.data;
                        }else {
                            console.log("获取账户地址失败！");
                            return;
                        }

                    });
            },
            //根据账户地址获取资产列表
            getAccountAssets(api) {
                this.$fetch(api)
                    .then((response) => {
                        if(response.success){
                            this.accountData = response.data;
                        }
                    });
            },
            //根据用户地址获取用户交易列表
            getAccountTxList(api, param) {
                this.$fetch(api, param)
                    .then((response) => {
                        console.log(response);
                        if(response.data != null){
                            if(response.data.list.length > 0){
                                this.dealList = response.data.list;
                                for (var i = 0; i < response.data.list.length; i++) {
                                    this.dealList[i].type = this.objType[response.data.list[i].type].value;
                                    this.dealList[i].values = response.data.list[i].value * response.data.list[i].transferType * 0.00000001;
                                    this.dealList[i].times = moment(response.data.list[i].time).format('YYYY-MM-DD hh:mm:ss');
                                }
                            }else {
                                this.dealList=[];
                            }
                        }else {
                            this.dealList=[];
                        }
                    });
            },

            //地址选择
            accountAddressChecked(value) {
                localStorage.setItem('newAccountAddress',value);
                this.getAccountAssets("/account/assets/" + value);
            },
            //tab切换
            handleClick(tab, event) {
                if(tab.name !== "first"){
                    this.walletHide = false;
                    let params = {"address": this.accountAddressValue,"pageSize":5,"pageNumber":1};
                    this.getAccountTxList('/tx/list/', params);
                }else {
                    this.walletHide = true;
                    this.getAccountAssets("/account/assets/" + this.accountAddressValue);
                }
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
                localStorage.setItem('toUserInfo','1');
                this.$router.push({
                    path: '/wallet/users/userInfo'
                })
            },
            filterTag(value, row) {
                return row.deal_type === value;
            },
            //toTxid跳转
            toTxid(txId) {
                //this.activeName='second';
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
                this.$router.push({
                    name: '/transfer',
                    params: {address: address},
                })
            },

        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .wallet {
        width: 86%;
        margin: 2rem auto;
        .search {
            height: 2.6rem;
            .search-account {
                width: 523px;
                .lable-title{
                    font-size: 14px;
                    margin-left: 17px;
                }
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
                margin-left: 10px;
            }
        }
        .wallet-hide {
            right: 7%;
            top: 133px;
            position: fixed;
            z-index: 800;
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
            width: 370px;
            margin-left: 15px;
        }

    }

    .el-table-filter {
        border: 1px solid #17202e;
        background-color: #17202e;
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: rgba(87, 107, 139, 0.2);
        .cell {
            input {
                background: rgba(87, 107, 139,0);
            }
        }
    }
</style>