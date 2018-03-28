import axios from 'axios';

axios.defaults.timeout = 9000;
axios.defaults.baseURL = 'http://192.168.1.233:8001';
/*axios.defaults.baseURL = 'http://127.0.0.1:8001';*/
axios.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * 封装get方法
 * Encapsulation get method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params})
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                //reject(err)
                reject("网络异常")
            })
    })
}

/**
 * 封装post请求
 * Encapsulation post method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * Encapsulation patch method
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装 put 请求
 *  Encapsulation put method
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}