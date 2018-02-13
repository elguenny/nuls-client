import Vue from 'vue'
import VueRouter from 'vue-router'

/**
 *  加载模块
 */
Vue.use(VueRouter)
/**
 *  路由配置
 */
const router = new VueRouter({
	base: __dirname,
	likActiveClass: 'link-active',
	routes: [{
			path: '*',
			name: '首页',
			component: resolve => require(['../../renderer/pages/index/Home.vue'], resolve)
		},
		{
			path: '/firstInto',
			name: '设置密码',
			component: resolve => require(['../../renderer/pages/users/SetPassword.vue'], resolve)
		},
		{
			path: '/firstInto/firstInfo',
			name: '首次进入',
			component: resolve => require(['../../renderer/pages/wallet/FirstInfo.vue'], resolve)
		},
		{
			path: '/firstInto/firstInfo/newAccount',
			name: '新建账户',
			component: resolve => require(['../../renderer/pages/wallet/NewAccount.vue'], resolve)
		},
		{
			path: '/firstInto/firstInfo/importAccount',
			name: '导入账户',
			component: resolve => require(['../../renderer/pages/wallet/ImportAccount.vue'], resolve)
		},
		
		
		{
			path: '/firstInto/firstInfo/importKey',
			name: '明文私钥导入',
			component: resolve => require(['../../renderer/pages/wallet/ImportKey.vue'], resolve)
		},
		{
			path: '/firstInto/firstInfo/importCode',
			name: '二维码导入',
			component: resolve => require(['../../renderer/pages/wallet/ImportCode.vue'], resolve)
		},
		{
			path: '/firstInto/firstInfo/importNuls',
			name: 'NULS导入',
			component: resolve => require(['../../renderer/pages/wallet/ImportNuls.vue'], resolve)
		},
		
		
		{
			path: '/wallet',
			name: '设置密码',
			component: resolve => require(['../../renderer/pages/users/SetPassword.vue'], resolve)
		},
		{
			path: '/wallet/index',
			name: '钱包首页',
			component: resolve => require(['../../renderer/pages/wallet/Index.vue'], resolve)
		},
		{
			path: '/wallet/index/freezeList',
			name: '冻结列表',
			component: resolve => require(['../../renderer/pages/wallet/FreezeList.vue'], resolve)
		}, 
		{
			path: '/wallet/index/transfer',
			name: '转账',
			component: resolve => require(['../../renderer/pages/wallet/Transfer.vue'], resolve)
		},
		{
			path: '/wallet/index/dealInfo',
			name: '交易详情',
			component: resolve => require(['../../renderer/pages/wallet/DealInfo.vue'], resolve)
		},
		{
			path: '/wallet/users/userInfo',
			name: '账户信息',
			component: resolve => require(['../../renderer/pages/users/userInfo.vue'], resolve)
		},
		{
			path: '/wallet/users/editAliasing',
			name: '修改别名',
			component: resolve => require(['../../renderer/pages/users/EditAliasing.vue'], resolve)
		},


	]
})

/**
 *  路由出口
 */
export default router