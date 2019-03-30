const config = require('./apiconfig');
const QQMapWX = require('../lib/qqmap-wx-jssdk.min');

// 天气 默认参数
const weatherDefaultParams = {
  key: config.weatherKey,
  location: 'beijing',
  lang: 'zh-cn',
  unit: 'm'
}
// weather api (天气接口)
let heWeatherApi ={};
// 微信 api
let wxApi ={};
// qqmap api
let qqmapApi ={};

// 天气接口请求
function weatherPromiseRequest(option){
  // 解构 (依据wx.request接口)
  let {url,data,header,method,dataType,responseType,success,fail,complete} = option;
  return new Promise((resolve,reject)=>{
    wx.request({
      "url": url,
      "header": header ? header : {"content-type": "application/json"},
      "method": method ? method : 'GET',
      // 这里 解构 /否则不传参;
      "data": data?Object.assign(weatherDefaultParams,data):weatherDefaultParams,
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
/**
 * 因为 封装了weatherPromiseRequest
 * option 格式为{data:{具体参数}}
 *  例子: 本质就是传正个
 *  wx.request(obj)
 *  obj = {
 *   data:{
 *     location: 'beijing', 
 *     lang: 'zh-cn', 
 *     unit: 'm'
 *   }
 *  }
 */
// 现时天气
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

// 获取生活方式;
heWeatherApi.getLifestyle = (option) =>{
  return weatherPromiseRequest({
    url: config.lifestyleUrl
  })
}

// 获取定位坐标
wxApi.getLocation = ()=>{
  return new Promise((resolve, reject)=>{
    wx.getLocation({
      type: 'gcj02',
      // altitude: true,
      success (res) {
        // 同时调用所有接口
        resolve(res)
      },
      fail (err) {
        reject(err)
      }
    })
  })

}

// 实例化qqmap 
var qqmapsdk;
// 实例化API核心类
qqmapsdk = new QQMapWX({
  key: config.qqMapKey,
});

// 逆地址 坐标->描述
qqmapApi.reverseGeocoder = (option) => {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: option.latitude,
        longitude: option.longitude
      },
      success (res) {
        console.log(res);
        resolve(res.result)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}


module.exports = {
  heWeatherApi,
  wxApi,
  qqmapApi
}