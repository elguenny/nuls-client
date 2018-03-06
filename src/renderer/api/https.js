import axios from 'axios';
import { Message } from 'element-ui';

axios.defaults.timeout = 5000;
/*axios.defaults.baseURL ='http://www.mocky.io/v2';*/
axios.defaults.baseURL ='http://localhost:8001/nuls';


//http request Interceptor
axios.interceptors.request.use(
  config => {
    // const token = getCookie('name'); attention needs to be introduced when using the cookie method and recommends js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response Interceptor
axios.interceptors.response.use(
  response => {
    if(response.data.errCode ==2){
      router.push({
        path:"/login",
        querry:{redirect:router.currentRoute.fullPath}//Which page to jump from
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)


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
              console.log(response);
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