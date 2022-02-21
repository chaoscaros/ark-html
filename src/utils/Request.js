import axios from 'axios'
// import qs from 'qs'


//接口请求判断拦截
// 创建axios实例---axios请求接口封装拦截
// 实例对象
const service = axios.create({
  baseURL: "", // api的base_url
  // timeout: 30000, // 请求超时时间  
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
})
service.defaults.withCredentials = true//跨域请求设置 axios代码中配置withCredentials为true以便可以携带cookie

// request请求拦截器
service.interceptors.request.use(config => {

  // let plotItem = JSON.parse(sessionStorage.getItem('plotItem'))
  //responseType: 'blob'  导出
  let paramsData = config.method == 'get' ? config.params : config.data

  var params = {} // 创建form对象
  for (var key of Object.keys(paramsData)) {
    let value = paramsData[key]
    if(value == '' || value == undefined){
      params[key] = null
    }
    if (value || value == null || value === 0 || value === '0') {
      params[key] = value // 通过append向form对象添加数据 
    }
  }
  if (config.method == 'get') {
    config.params = params
    //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    // config.params = qs.stringify(params, { arrayFormat: 'repeat' })
  }
  else {
    // config.data = qs.stringify(params)
    // config.data = paramsData
    config.data = params
  }
  return config
}, error => {
  // Do something with request error
  //console.log(error) // for debug
  return Promise.reject(error)
})

// respone返回拦截器
service.interceptors.response.use(
  response => {
    /**
    * returnStatus为0是有异常，未传入参数；为1 表示成功；为2 用户未登录
    */
    const res = response.data
    if (res.x_token) {//x_token如有值，取最新
      setToken(res.x_token);//每次请求接口都重设x_token           
    }
    if (response.config.responseType) {//下载文件流
      return res
    }
    else if (res.code != 200) {//请求失败FAIL
      console.log(res)
    }
    return res
  },
  error => {// 请求超时时间
    return Promise.reject(error)
  }
)
export default service
