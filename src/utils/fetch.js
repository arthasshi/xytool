import axios from 'axios'
// import router from '../router'
import bus from '../utils/EventBus'

// function setContentTypeIfUnset (headers, value) {
//   headers['Content-Type'] = value
// }

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API,
  timeout: 5000,
  withCredentials: true
  // headers:{"Authorization":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJoZWFkaW1nIjoiaHR0cDovL3FuLmRkYmVzLmNvbS9Ga3l4cjEwT0d3aHVYMEZaTjVRdG1LUXdCZjVBIiwidXNlck5hbWUiOiLogL_nkKoiLCJleHAiOjE1MjQ5ODMxMDYsInVzZXJJZCI6IjMzNDRhZWQwNjBiNDQ3MDE4NzFjN2RmMDg3NTNlNzE5IiwiaWF0IjoxNTI0ODk2NzA2fQ.f-oFNnvJ1N9J_omtyIPfz3-4sH85l4V34Wk-Sh1Ap1CvkkGwxh51_CcZ32mGCGRAxidYGf8dNX7G0Xwxixd86A"}
  //   transformRequest:(data,headers)=>{
  //     if(data){
  //       setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
  //       // let keys2 = Object.keys(data);
  //       // return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&'));
  //         setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
  //         return JSON.stringify(data);
  //     }
  // }

  // headers:{'Content-Type':'application/json;charset=utf-8'},
  // headers:{'Content-Type':'application/json;charset=utf-8'},
  // transformRequest: [function (data,headers) {
  //   // 对 data 进行任意转换处理
  //   setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
  //   return JSON.stringify(data);
  // }],
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent

  bus.$emit('handleLoading', true)
  return config
}, error => {
  console.log(error) // for debug
})
// respone拦截器
service.interceptors.response.use(
  response => {
    bus.$emit('handleLoading', false)

    /*
      这个项目里，后台的数据返回，code=1 代表正确
      code= -1代表错误；
      code= 3401 代表没有权限
      code = 1115代表密码错误
      所以有了下面的if判断
      然后会根据不同的情况 弹出不同的提示
     */
    if (response.status == 200) {
      console.log(response.data)
      return response.data
    } else {
      return Promise.reject(response)
    }
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    bus.$emit('handleLoading', false)

    bus.$emit('loading-msg', { type: 'error', data: '请求出错' })
    return Promise.reject(error)
  }
)
// const toLogin = () => {
//   // store.commit('REMOVE_ALL_COOKIES')
//   bus.$emit('mainMsg')
// }

export default service
