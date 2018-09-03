import Vue from 'vue'
import VueRouter from 'vue-router'

/**
 *  加载模块
 */
Vue.use(VueRouter);
/**
 *  路由配置
 */
const router = new VueRouter({
  /*mode: 'history',*/
  base: __dirname,
  likActiveClass: 'link-active',
  routes: [
    {
      //首页
      path: '*',
      name: '/home',
      component: resolve => require(['@/pages/index/Home.vue'], resolve)
    },
    {
      //空路由
      path: '/empty :url',
      name: '/empty',
      component: resolve => require(['@/pages/users/empty.vue'], resolve),
    },
    {
      //设置钱包密码
      path: '/users/setPassword :address/:backInfo',
      name: '/setPassword',
      component: resolve => require(['@/pages/users/SetPassword.vue'], resolve),
    },
    {
      //修改钱包密码
      path: '/users/editorPassword :address/:backInfo',
      name: '/editorPassword',
      component: resolve => require(['@/pages/users/EditorPassword.vue'], resolve),
    },
    {
      path: '/firstInfo/firstInfo',
      name: '/firstInfo',
      component: resolve => require(['@/pages/wallet/FirstInfo.vue'], resolve)
    },
    {
      path: '/firstInto/newAccount :newOk/:address',
      name: '/newAccount',
      component: resolve => require(['@/pages/wallet/NewAccount.vue'], resolve)
    },
    {
      path: '/firstInto/firstInfo/importAccount',
      name: '/importAccount',
      component: resolve => require(['@/pages/wallet/ImportAccount.vue'], resolve)
    },

    {
      path: '/firstInto/firstInfo/importKey',
      name: '/importKey',
      component: resolve => require(['@/pages/wallet/ImportKey.vue'], resolve)
    },
    {
      path: '/firstInto/firstInfo/importCode',
      name: '/importCode',
      component: resolve => require(['@/pages/wallet/ImportCode.vue'], resolve)
    },
    {
      path: '/firstInto/firstInfo/importNuls',
      name: 'importNuls',
      component: resolve => require(['@/pages/wallet/ImportNuls.vue'], resolve)
    },
    {
      path: '/users/userLog',
      name: '/userLog',
      component: resolve => require(['@/pages/users/UserLog.vue'], resolve)
    },
    {
      path: '/wallet',
      name: '/wallet',
      component: resolve => require(['@/pages/wallet/Index.vue'], resolve),
      meta: {
        keepAlive: false,
      }
    },
    {
      path: '/wallet/index/freezeList :address',
      name: '/freezeList',
      component: resolve => require(['@/pages/wallet/FreezeList.vue'], resolve)
    },
    {
      path: '/wallet/index/transfer',
      name: 'transfer',
      component: resolve => require(['@/pages/wallet/Transfer.vue'], resolve)
    },
    {
      path: '/wallet/deallist',
      name: 'deallist',
      component: resolve => require(['@/pages/wallet/DealList.vue'], resolve)
    },
    {
      path: '/wallet/index/dealInfo',
      name: 'dealInfo',
      component: resolve => require(['@/pages/wallet/DealInfo.vue'], resolve)
    },
    {
      path: '/wallet/users/userInfo',
      name: '/userInfo',
      component: resolve => require(['@/pages/users/UserInfo.vue'], resolve)
    },
    {
      path: '/wallet/users/editAliasing',
      name: 'editAliasing',
      component: resolve => require(['@/pages/users/EditAliasing.vue'], resolve)
    },
    {
      path: '/users/setPage',
      name: '/setPage',
      component: resolve => require(['@/pages/users/SetPage.vue'], resolve)
    },
    {
      path: '/users/UpdatedVersion',
      name: '/updatedVersion',
      component: resolve => require(['@/pages/users/UpdatedVersion.vue'], resolve)
    },
    {
      path: '/users/userAddressList',
      name: '/userAddressList',
      component: resolve => require(['@/pages/users/UserAddressList.vue'], resolve)
    },
    {
      //共识首页
      path: '/consensus',
      name: '/consensus',
      component: resolve => require(['@/pages/consensus/Index.vue'], resolve),
      meta: {
        keepAlive: false,
      }
    },
    {
      path: '/consensus/myNode',
      name: '/myNode',
      component: resolve => require(['@/pages/consensus/MyNode.vue'], resolve)

    },
    {
      path: '/consensus/myNode/addNode',
      name: '/addNode',
      component: resolve => require(['@/pages/consensus/AddNode.vue'], resolve)

    },
    {
      path: '/consensus/pledgeInfo',
      name: '/pledgeInfo',
      component: resolve => require(['@/pages/consensus/PledgeInfo.vue'], resolve)
    },
    {
      path: '/consensus/newNode',
      name: '/newNode',
      component: resolve => require(['@/pages/consensus/NewNode.vue'], resolve)
    },
    {
      path: '/consensus/agencyNode',
      name: '/agencyNode',
      component: resolve => require(['@/pages/consensus/AgencyNode.vue'], resolve),
      meta: {
        keepAlive: true,
      }
    },
    {
      path: '/consensus/nodeInfo',
      name: '/nodeInfo',
      component: resolve => require(['@/pages/consensus/NodeInfo.vue'], resolve),
      meta: {
        keepAlive: false,
      }
    },
    {
      path: '/consensus/nodePage',
      name: '/nodePage',
      component: resolve => require(['@/pages/consensus/NodePage.vue'], resolve)
    },
    {
      path: '/consensus/allPledge',
      name: '/allPledge',
      component: resolve => require(['@/pages/consensus/AllPledge.vue'], resolve)
    },
    {
      path: '/contract',
      name: 'contract',
      component: resolve => require(['@/pages/contract/Index.vue'], resolve)
    },
    {
      path: '/contract/contractInfo',
      name: 'contractInfo',
      component: resolve => require(['@/pages/contract/ContractInfo.vue'], resolve)
    },
  ]
});
/**
 *  路由出口
 */
export default router
