import {BigNumber} from 'bignumber.js'
import copy from 'copy-to-clipboard'

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
/*export function copys(value) {
  copy(value);
}*/




/*
export default {
  getBalance:function (address) {
    return new Promise((resolve, reject) => {
      axios.get('/accountledger/balance/' + address)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
*/



