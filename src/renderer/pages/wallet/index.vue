<template>
	<div class="wallet">
		<div class="search">
			<div class="search-account fl">
				<label>{{$t("message.indexAccountAddress")}}:</label>
				<template>
					<el-select v-model="accountAddressValue" placeholder="" @change="accountAddressChecked">
						<el-option v-for="item in accountAddress" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<i class="icon-copy_icon copyBtn" :data-clipboard-text="this.accountAddressValue" @click="accountCopy"></i>
			<i class="icon-qr_icon" @click="accountCode"></i>
			<i class="icon-zhanghu_icon fr" @click="accountChoice"></i>
			<CodeBar v-show="codeShowOk"  v-on:codeShowOks="codeShowOks" ref="codeBar"></CodeBar>
		</div>
		<div class="wallet-hide" v-show="walletHide">
			<i :class="`icon ${keyShow ? 'icon-eye' : 'icon-eye-blocked'}`" @click="keyShow = !keyShow"></i>
		</div>
		<div class="wallet-tab cl">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane :label="$t('message.indexAccountHome')" name="first" >
					<el-table :data="accountData" :highlight-current-row="true">
						<el-table-column :label="$t('message.indexProperty')" min-width="20" align='center'>
							<template slot-scope="scope">
								<span>{{ scope.row.a_name }}</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.indexSum')" min-width="20" align='center'>
							<template slot-scope="scope">
								<input :type="keyShow ? 'text' : 'password'" :value= scope.row.a_allNo readonly="readonly">
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.indexUsable')" min-width="20" align='center'>
							<template slot-scope="scope">
								<input :type="keyShow ? 'text' : 'password'" :value= scope.row.a_canNo readonly="readonly">
							</template>
						</el-table-column>
						<el-table-column :label= "$t('message.indexLock')" min-width="20" align='center'>
							<template slot-scope="scope">
								<!--<router-link to='/wallet/index/freezeList'>-->
								<input :type="keyShow ? 'text' : 'password'" :value=scope.row.a_lockNo  readonly="readonly" title="点击查看详情">
							</template>
						</el-table-column>
						<el-table-column :label= "$t('message.operation')" align='center'>
							<template slot-scope="scope">
								<router-link to='/wallet/index/transfer' title='点击查看详情' >{{ scope.row.a_lockState == 1 ? '转账' : '下载子链' }}</router-link>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination layout="prev, pager, next":total="1000"></el-pagination>
				</el-tab-pane>
				<el-tab-pane :label= "$t('message.transactionRecord')" name="second" >
					<el-table :data="dealList" :highlight-current-row="true">
						<el-table-column
					      prop="tag"
					      :label= "$t('message.transactionType')"
					      width="150"
					      align='center'
					      :filters="[{ text: '转账', value: '转账' }, { text: '入账', value: '入账' }]"
					      :filter-method="filterTag"
					      filter-placement="bottom-end">
					      <template slot-scope="scope">
					        <el-tag
					          :type="scope.row.deal_type === '入账' ? 'primary' : 'success'"
					          close-transition>{{scope.row.deal_type}}</el-tag>
					      </template>
					    </el-table-column>
						<el-table-column label="txid" min-width="50" align='center'>
							<template slot-scope="scope">
								<router-link to='/wallet/index/dealInfo'>{{ scope.row.deal_txid }}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label= "$t('message.assetChange')" width="120" align='center'>
							<template slot-scope="scope">
								<span>{{ scope.row.deal_change }}</span >
							</template>
						</el-table-column>
						<el-table-column :label= "$t('message.state')" width="120" align='center'>
							<template slot-scope="scope">
								<span>{{ scope.row.deal_state }}</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.time')" width="120" align='center'>
							<template slot-scope="scope">
								<span>{{ scope.row.deal_time}}</span>
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
    import Clipboard from 'clipboard';
    import CodeBar from '@/components/CodeBar.vue';
    let clipboard = new Clipboard('.copyBtn');
	export default {
		data() {
			return {
				walletHide:true,
				keyShow:false,
                codeShowOk:false,
				accountAddress: [{
                    value: '12348',
                    label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
                    value: '1233',
                    label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
                    value: '1234',
                    label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}],
                accountAddressValue:localStorage.getItem('newAccountAddress'),
				accountData: [{
						a_name: 'NULS',
						a_allNo: '23265464',
						a_canNo: '4568613',
						a_lockNo: '58000',
						a_lockState: '1',
					}, {
						a_name: 'TNKS',
						a_allNo: '23265464',
						a_canNo: '4568613',
						a_lockNo: '58000',
						a_lockState: '1',
					},
					{
						a_name: 'LEMK',
						a_allNo: '23265464',
						a_canNo: '4568613',
						a_lockNo: '58000',
						a_lockState: '0',
					}
				],
				dealList: [{
						deal_type: '转账',
						deal_txid: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
						deal_change: '+5989NULS',
						deal_state: '1',
						deal_time: '2018-8-8'
					}, {
						deal_type: '转账',
						deal_txid: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
						deal_change: '-888NULS',
						deal_state: '0',
						deal_time: '2015-5-8'
					},
					{
						deal_type: '入账',
						deal_txid: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
						deal_change: '+89NULS',
						deal_state: '3',
						deal_time: '2018-8-8'
					}
				],
				activeName: 'first',
			}
		},
        components: {
            CodeBar
        },
		methods: {
            accountAddressChecked(value){
                console.log(value);
			},
			handleClick(tab, event) {
				this.walletHide = !this.walletHide;
				console.log(tab, event);
			},
			funUsers() {
				this.$router.push({
					path: '/wallet/userInfo'
				})
			},
			accountCopy() {
                this.$message({
                    message: '复制成功！',
                    type: 'success'
                });
			},
			accountCode() {
                this.$refs.codeBar.codeMaker(localStorage.getItem('newAccountAddress'));
                this.codeShowOk = !this.codeShowOk;
			},
            codeShowOks(){
                this.codeShowOk = false;
            },
			accountChoice() {
                this.$router.push({
                    path: '/wallet/users/userInfo'
                })
			},
			/*walletHide() {
				console.log('显示隐藏条内容')
			},*/
			filterTag(value, row) {
				return row.deal_type === value;
			},
			transfer() {
				this.$router.push({
					path: '/wallet/index/transfer'
				})
			},
			download() {
				console.log('下载子链')
			}
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
		.cell{
			input{
				border: none;
				width: 100%;
				background-color:#0b1422;
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
		.el-table__body tr.current-row>td {
			background: rgba(23, 32, 46, .75) !important;
		}
	}
	
	.el-table-filter {
		border: 1px solid #17202e;
		background-color: #17202e;
	}
</style>