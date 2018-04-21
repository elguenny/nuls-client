const IS_DEV = process.env.NODE_ENV !== 'production';
//Request url
export const API_ROOT = IS_DEV ? 'http://127.0.0.1:8001' : 'http://127.0.0.1:8001';
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

/**
 * 打开或关闭java程序
 * Open or close the Java program
 */
export function JavaFile(fileName) {
    //获取路径
    let _path = process.execPath.substr(0, process.execPath.length - 14);
    //let _path = process.execPath.substr(0, 8);
    let _name = ".bat";
    //判断操作系统
    if (navigator.userAgent.indexOf("Window") > 0) {
        console.log("Windows");
    } else if (navigator.userAgent.indexOf("Mac OS X") > 0) {
        console.log("Mac");
        _name = ".sh"
        //javaBat("../"+_path,"sh");
    } else if (navigator.userAgent.indexOf("Linux") > 0) {
        console.log("Linux");
    } else {
        console.log("NUll");
    }
    //执行java文件
    let child_process = require('child_process');
    child_process.execFile(_path + 'java\\bin\\' + fileName + _name, null, {cwd: _path + 'java\\bin\\'}, function (error) {
        //console.log(_path + 'java\\bin\\' + fileName + _name);
        sessionStorage.setItem("homeJava", "1");
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        else {
            console.log('Execute the java file');
        }
    });
}

