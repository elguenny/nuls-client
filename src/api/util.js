import {BigNumber} from 'bignumber.js'
import copy from 'copy-to-clipboard'
import store from '@/vuex/store.js'
import {getAccountList} from '@/api/httpData.js'

/**
 * 左移八位
 * Execute the float addition
 * @param arg
 * @returns {BigNumber}
 */
export function LeftShiftEight(arg) {
  let left8 = new BigNumber(0.00000001);
  return left8.times(arg);
}

/**
 * 右移八位
 * Execute the float addition
 * @param arg
 * @returns {BigNumber}
 */
export function RightShiftEight(arg) {
  let right8 = new BigNumber(100000000);
  return right8.times(arg);
}

/**
 * 复制 copy
 * @param value
 */
export const copys = (value) => copy(value);

/**
 * 根据不同时区显示时间
 * @param time
 * @returns {*}
 */
export function getLocalTime(time) {
  if (typeof time !== 'number') return;
  let d = new Date();
  let offset = d.getTimezoneOffset() * 60000;
  let localUtc = new Date().getTimezoneOffset() / 60;
  let utcTime;
  if (localUtc > 0) {
    utcTime = time - offset;
  } else {
    utcTime = time + offset;
  }
  let localTime = utcTime + 3600000 * Math.abs(localUtc);
  return new Date(localTime);
}

/**
 * 获取用户列表 设置用户信息
 * @returns {Promise<any>}
 */
export function accountList() {
  return new Promise((resolve) => getAccountList()
    .then((response) => {
      //console.log(response);
      if (response.success) {
        if (response.data.list.length !== 0) {
          if (localStorage.getItem('newAccountAddress') === '') {
            localStorage.setItem('newAccountAddress', response.data.list[0].address);
            localStorage.setItem('addressAlias', response.data.list[0].alias);
            localStorage.setItem('addressRemark', response.data.list[0].remark);
            localStorage.setItem('encrypted', response.data.list[0].encrypted);
          }
        } else {
          localStorage.setItem('newAccountAddress', '');
          localStorage.setItem('addressAlias', '');
          localStorage.setItem('addressRemark', '');
        }
        resolve({success: true, list: response.data.list})
      } else {
        resolve({success: false, list: response.data.list})
      }
    }).catch((reject) => {
      console.log(reject);
      localStorage.setItem('newAccountAddress', '');
      localStorage.setItem('addressAlias', '');
      localStorage.setItem('addressRemark', '');
      resolve({success: false, reject: reject})
    })
  )
}




