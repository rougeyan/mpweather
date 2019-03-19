const config = require('./apiconfig');

// 默认参数(若不授权默认显示天气参数)
const defaultParams = {
  key: config.weatherKey,
  location: 'guangzhou',
  lang: 'zh-cn',
  unit: 'm'
}

// weather api (天气接口)
let heWeatherApi ={};
// 天气请求
function weatherPromiseRequest(option){
  // 解构
  let {url,data,header,method,dataType,responseType,success,fail,complete} = option;

  return new Promise((resolve,reject)=>{
    wx.request({
      "url": url,
      "header": header ? header : {"content-type": "application/json"},
      "method": method ? method : 'GET',
      // 这里 解构 /否则不传参;
      "data": data? {
        ...defaultParams
      }:{
        ...defaultParams,
        ...data
      },
      "dataType": dataType ? dataType : "json",
      "responseType" : responseType ? responseType : "text",
      // 这里resolve 读不到;
      "success": success ? success : (res) => {resolve(res.data)},
      "fail": fail ? fail : (err) => {
        reject(err)
        // 此处应有 请求失败弹窗;
      },
      "complete": complete ? complete : ()=>{},
    })
  })
}

// 获取现在天气
heWeatherApi.getNowWeather = (option)=>{
  return weatherPromiseRequest({
    ...option,
    url: config.nowWeatherUrl
  })
}
// 逐日天气
heWeatherApi.getDailyWeather = (option)=>{
  return weatherPromiseRequest({
    ...option,
    url: config.dailyWeatherUrl
  })
}

// 逐三小时天气
heWeatherApi.getHourlyWeather = (option)=>{
  return weatherPromiseRequest({
    ...option,
    url: config.hourlyWeatherUrl
  })
}

heWeatherApi.getLifestyle = (option) =>{
  return weatherPromiseRequest({
    url: config.lifestyleUrl
  })
}

module.exports = {
  heWeatherApi
}

// address api(定位接口)
