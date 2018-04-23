const IS_DEV = process.env.NODE_ENV !== 'production';
//Request url
export const API_ROOT = IS_DEV ? 'http://192.168.1.103:8001' : 'http://127.0.0.1:8001';
//Request response time
export const API_TIME = IS_DEV ? '4000' : '5000';

/**
 * 浮点数加法运算
 * Execute the float addition
 */
export function FloatAdd(arg1, arg2) {
    let r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

/**
 * 浮点数减法运算
 * Execute the float subtraction
 */
export function FloatSub(arg1, arg2) {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 = r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(8);
}

/**
 * 浮点数乘法运算
 * Execute the float multiplication
 */
export function FloatMul(arg1, arg2) {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(8);
}


