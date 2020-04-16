//require('es6-pmomise').polyfill()
import router from "../../router";

require("es6-promise").polyfill()
import axios from 'axios'
import Qs from 'qs'
var failMsg = "登陆信息过期，请重新登陆";
//跨域
axios.defaults.withCredentials = true
axios.defaults.timeout = 20000
//axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'

var sysConfig = require('@/assets/js/sysConfig')

// 请求之前拦截
axios.interceptors.request.use(config => {
  // 判断token
  if (localStorage.Authorization) {
    config.headers.Authorization = sysConfig.accessTokenPre + localStorage.getItem(sysConfig.accessTokenKey);
    config.headers.refresh_jwt = sysConfig.accessTokenPre + localStorage.getItem(sysConfig.refreshTokenKey);
  }
  return config
},error =>{
  return Promise.reject(error)
})

// http response 拦截器
axios.interceptors.response.use(
  response => {
    var  tempData = response.data;
    console.log('tempData大苏打')
    console.log(tempData)
    //未登陆，登陆过期
    if(tempData.state === '401'){
      localStorage.removeItem(sysConfig.accessTokenKey);
      router.replace("/login")
      return;
      //已经登陆，但是token超时，后端自动刷新token
    }else if(tempData.state === '202'){
      //1、保存后端返回的token
      localStorage.setItem(sysConfig.accessTokenKey,tempData.accessToken);
      localStorage.setItem(sysConfig.refreshTokenKey,tempData.refreshToken);
      //2、重新请求数据


    }else {
      return response
    }

  },
  err => {
    /*if ((err.response.data.message.indexOf(failMsg)) !== -1) {
      /!*
      switch (err.response.status) {
        case 401:
          let config = err.config;
          /!*用vuex删除token
          *因为刷新token的接口和登录接口一样
          *用basic认证和表单提交的方式
          *需要区别于普通接口调用*!/
          store.dispatch('DelToken');
          //判断是否已经刷新过token
          if (!config.isRetryRequest) {
            return getRefreshToken()
              .then(function (res) {
                let data = res.data;
                //用vuex重新设置基本信息
                store.dispatch('UserLogin', {
                  username: store.state.currentUser.UserName,
                  token: data.access_token,
                  refresh_token: data.refresh_token
                });
                //修改flag
                config.isRetryRequest = true;
                //修改原请求的token
                let authToken = store.state.currentUser.UserToken;
                config.headers.Authorization = `Bearer ` + authToken;
                /!*这边不需要baseURL是因为会重新请求url
                *url中已经包含baseURL的部分了
                *如果不修改成空字符串，会变成'api/api/xxxx'的情况*!/
                config.baseURL = '';
                //重新请求
                return axios(config);
              })
              .catch(function () {
                //刷新token失败只能跳转到登录页重新登录
                store.dispatch('UserLogout');
                router.replace({
                  path: 'login',
                  query: {redirect: router.currentRoute.fullPath}
                });
                throw err;
              });
          }
          break;
      }*!/
    }
    else{
      Message.error({
        message: '加载超时'
      })
    }*/
    return Promise.reject(err)
  }
);



export default {
  //get请求
  requestGet (url, params = {}) {
   /* return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })*/
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        transformRequest: [function (data) {
          // 对 data 进行任意转换处理
          return Qs.stringify(data)
        }],
        url: url,
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })

    })
  },
  //get请求不带参数
  requestQuickGet (url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        //成功用resolve回调函数接参
        resolve(res.data)
      }).catch(error => {
        //失败用reject回调函数接参
        reject(error)
      })
    })
  },
  //post请求
  requestPost (url, params) {
   return new Promise((resolve, reject) => {
     axios({
       method: 'post',
       transformRequest: [function (data) {
         // 对 data 进行任意转换处理
         return Qs.stringify(data)
       }],
       url: url,
       data: params
     }).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })

    })
  },
  //post请求
  requestPostForm (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(res => {
        resolve(res.data)//注意res是axios封装的对象，res.data才是服务端返回的信息
      }).catch(error => {
        reject(error)
      })
    })
  },
  //put请求
  requestPut (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //delete请求
  requestDelete (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
// axios默认配置
//axios.defaults.timeout = 5000;          // 超时时间
//axios.defaults.baseURL = apiURL.apiUrl;  // 默认地址
//**整理数据格式**
/*axios.defaults.transformRequest = function (data) {
  data = Qs.stringify(data);
  return data;
};*/
