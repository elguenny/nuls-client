const IS_DEV = process.env.NODE_ENV !== 'production';
let host = window.location.host; //获取地址和端口
//Request url
export const API_ROOT = IS_DEV ? 'http://127.0.0.1:6001/api/' : 'http://'+host+'/api/';
//Request response time
export const API_TIME = IS_DEV ? '6000' : '8000';

/**
 * 浮点数减法运算
 * Execute the float subtraction
 */
export function FloatSub (arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 = r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(8)
}



