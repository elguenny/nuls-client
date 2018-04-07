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
			//首页
			path: '*',
			name: '/home',
			component: resolve => require(['../../renderer/pages/index/Home.vue'], resolve)
		},
		{
            //设置钱包密码
            path: '/setPassword',
            name: '/setPassword',
            component: resolve => require(['../../renderer/pages/users/SetPassword.vue'], resolve),
		},
        {
            //修改钱包密码
            path: '/editorPassword',
            name: '/editorPassword',
            component: resolve => require(['../../renderer/pages/users/EditorPassword.vue'], resolve),
        },
		{
			path: '/firstInto/firstInfo',
			name: '首次进入',
			component: resolve => require(['../../renderer/pages/wallet/FirstInfo.vue'], resolve)
		},
		{
			path: '/firstInto/newAccount :newOk/:address',
			name: '/newAccount',
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
			path: '/users/setPassword',
			name: '设置密码',
			component: resolve => require(['../../renderer/pages/users/SetPassword.vue'], resolve)
		},
		{
			path: '/users/userLog',
			name: '用户日志',
			component: resolve => require(['../../renderer/pages/users/UserLog.vue'], resolve)
		},
		{
			path: '/wallet :language',
			name: '/wallet',
			component: resolve => require(['../../renderer/pages/wallet/Index.vue'], resolve)
		},
		{
			path: '/wallet/index/freezeList :address',
			name: '/freezeList',
			component: resolve => require(['../../renderer/pages/wallet/FreezeList.vue'], resolve)
		},
		{
			path: '/wallet/index/transfer :address',
			name: '/transfer',
			component: resolve => require(['../../renderer/pages/wallet/Transfer.vue'], resolve)
		},
		{
			path: '/wallet/index/dealInfo :hash',
			name: '/dealInfo',
			component: resolve => require(['../../renderer/pages/wallet/DealInfo.vue'], resolve)
		},
		{
			path: '/wallet/users/userInfo',
			name: '/userInfo',
			component: resolve => require(['../../renderer/pages/users/UserInfo.vue'], resolve)
		},
		{
			path: '/wallet/users/editAliasing :address',
			name: '/editAliasing',
			component: resolve => require(['../../renderer/pages/users/EditAliasing.vue'], resolve)
		},
		{
			path: '/users/setPage',
			name: '设置界面',
			component: resolve => require(['../../renderer/pages/users/SetPage.vue'], resolve)
		},
		{
			path: '/users/userAddressList',
			name: '通讯录',
			component: resolve => require(['../../renderer/pages/users/UserAddressList.vue'], resolve)
		},
		{
			//共识首页
			path: '/consensus :activeName' ,
			name: '/consensus',
			component: resolve => require(['../../renderer/pages/consensus/Index.vue'], resolve)

		}, 
		{
			path: '/consensus/myNode :agentAddress',
			name: '/myNode',
			component: resolve => require(['../../renderer/pages/consensus/MyNode.vue'], resolve)

		}, 
		{
			path: '/consensus/myNode/addNode :agentAddress/:agentId',
			name: '/addNode',
			component: resolve => require(['../../renderer/pages/consensus/AddNode.vue'], resolve)

		}, 
		{
			path: '/consensus/pledgeInfo',
			name: '抵押详情',
			component: resolve => require(['../../renderer/pages/consensus/PledgeInfo.vue'], resolve)
		},
		{
			path: '/consensus/newNode',
			name: '自建节点共识',
			component: resolve => require(['../../renderer/pages/consensus/NewNode.vue'], resolve)
		},
		{
			path: '/consensus/agencyNode',
			name: '/agencyNode',
			component: resolve => require(['../../renderer/pages/consensus/AgencyNode.vue'], resolve)
		},
		{
			path: '/consensus/nodeInfo',
			name: '/nodeInfo',
			component: resolve => require(['../../renderer/pages/consensus/NodeInfo.vue'], resolve)
		},
		{
			path: '/consensus/nodeInfo/allPledge :agentName',
			name: '/allPledge',
			component: resolve => require(['../../renderer/pages/consensus/AllPledge.vue'], resolve)
		},
		{
			path: '/consensus/nodeInfo/nodePage :address' ,
			name: '/nodePage',
			component: resolve => require(['../../renderer/pages/consensus/NodePage.vue'], resolve)
		}
		
		/*{
			path: '/consensus',
			name: '共识首页',
			component: resolve => require(['../../renderer/pages/consensus/Index.vue'], resolve),
			children:[{
				path: '/consensus/pledgeInfo',
				name: '抵押详情',
				component: resolve => require(['../../renderer/pages/consensus/PledgeInfo.vue'], resolve)
			}]
		}*/

	]
})

/**
 *  路由出口
 */
export default router