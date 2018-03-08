import axios from 'axios';

axios.defaults.timeout = 5000;
/*axios.defaults.baseURL ='http://www.mocky.io/v2';*/
axios.defaults.baseURL ='http://localhost:8001/nuls';
axios.defaults.headers.post['Content-Type']='application/json';

/**
 * 封装get方法
 * Encapsulation get method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
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
 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
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

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
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

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}