import {BigNumber} from 'bignumber.js'
import copy from 'copy-to-clipboard'
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
 * 10的N 次方
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Power(arg) {
  let newPower = new BigNumber(10);
  return newPower.pow(arg);
}

/**
 * 除法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Division(nu,arg) {
  let newDiv = new BigNumber(nu);
  return newDiv.div(arg);
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
 * html转码
 * @param str
 * @returns {s}
 */
export function htmlEncodeByRegExp(str){
  let s = "";
  if(str.length === 0) return "";
  s = str.replace(/&/g,"&amp;");
  s = s.replace(/</g,"&lt;");
  s = s.replace(/>/g,"&gt;");
  s = s.replace(/ /g,"&nbsp;");
  s = s.replace(/[\n\r]/g,'&nbsp;');
  s = s.replace(/\'/g,"&#39;");
  s = s.replace(/\"/g,"&quot;");
  return s;
}

/**
 * html解码
 * @param str
 * @returns {s}
 */
export function htmlDecodeByRegExp(str){
  let s = "";
  if(str.length === 0) return "";
  s = str.replace(/&amp;/g,"&");
  s = s.replace(/&lt;/g,"<");
  s = s.replace(/&gt;/g,">");
  s = s.replace(/&nbsp;/g," ");
  s = s.replace(/&#39;/g,"\'");
  s = s.replace(/&quot;/g,"\"");
  return s;
}

/**
 * 交易动态参数是否必填项是否全部有值
 * @param array
 * @returns {arg}
 */
export function allParams(array) {
  //console.log(array);
  let arg = {success: true, params: ''};
  for (let i of array) {
    //判断是否有值
    if (i.value) {
      //判断是否有数组参数
      if(i.types){
        arg.params += i.value + ',';
      }else {
        arg.params += '"' + i.value + '",';
      }
    } else {
      arg.params += '"",';
    }
    //判断必填是否有值
    if (i.required) {
      if (i.value) {
        arg.success = true;
      } else {
        arg.success = false
      }
    }
  }
  //去掉最后一个逗号
  if (arg.params.length > 0) {
    arg.params = arg.params.substr(0, arg.params.length - 1);
  }
  return arg
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




