import axios from 'axios'
import * as config from '../config.js'

axios.defaults.timeout = config.API_TIME;
axios.defaults.baseURL = config.API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

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
}


