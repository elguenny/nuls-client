import {fetch, post, put} from './https'

//account
/**
 * 查询账户资产 Get account assets
 * @param address
 * @returns {Promise}
 */
export const getAccountAssets = (address) => fetch('/account/assets/' + address);

/**
 * 查询账户私钥 Query the private key of the account
 * @param address
 * @returns {Promise}
 */
export const postAccountKey = (address) => post('/account/prikey/' + address);

/**
 * 获取设置别名手续 Get the formalities for setting alias
 * @param address
 * @returns {Promise}
 */
export const getFeeAlias = (params) => fetch('/account/alias/fee?' + params);

/**
 *  查询账户列表 Get account list
 * @param address
 * @param params
 * @returns {Promise}
 */
export const getAccountList = (address,params) => fetch('/account' +address, params);




/**
 * 查询全网共识总体信息  Get the whole network consensus infomation
 * @returns {Promise}
 */
export const getConsensus = () => fetch('consensus');

/**
 * 根据用户地址获取用户交易列表 Get account Txlist a address
 * @param address
 * @param params
 * @returns {Promise}
 */
export const getAccountTxList = (address,params) => fetch('/accountledger/tx/list/' + address,params);


