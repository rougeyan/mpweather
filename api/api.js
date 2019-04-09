const config = require('./apiconfig');
const util = require('../utils/util');
const QQMapWX = require('../lib/qqmap-wx-jssdk.min');

// 和风天气 默认参数
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


// -------------------和风天气服务 api---------------------------------
// 封装天气接口请求
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
 * option 格式为 {data:{具体参数}}
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

// -------------------微信原生 api---------------------------------

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

// 隐藏;
wxApi.hideLoading = ()=>{
  return new Promise((resolve)=>{
    wx.hideLoading()
    resolve();
  })
}
// 显示加载中
wxApi.showLoading = ()=>{
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title: '正在加载中',
      mask: true,
      success(){
        var msgres = "this is some Msg resolve"
        resolve(msgres)
      },
      fail(error){
        reject(error)
      }
    })

  })
}
// 设置storage(同步)
wxApi.setStorageSync = (key,value)=>{
  return new Promise((resolve,reject)=>{
    wx.setStorageSync({
      key: key,
      data: value,
      success:	function(){
        resolve(`set${key}into Storage success`);
      },
      fail:	function(){
        reject(`set${key}into Storage fail`)
      }
    })
  })
}

// 注意区分 getStorageInfoSync 和 getStorageSync 一个是填key筛选 一个是返回所有的stroage信息

// Sync只有一个参数 是string(key)  非sync的话参数 是object {key,succes,fail}

// 获取storage(同步)

// -------------------腾讯地图服务 api---------------------------------

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

// 这里要把这部分数据存入localStorage里面;
// 这里增加缓存操作
// 无须每次都执行请求节省流量;
qqmapApi.getCityList = ()=>{
  // 优先同步取缓存中的城市列表;
  let CITY_LIST = wx.getStorageSync('CITY_LIST');
  console.log(CITY_LIST);
  if(CITY_LIST){
    return Promise.resolve(CITY_LIST)
  }
  return new Promise((resolve, reject) => { 
    qqmapsdk.getCityList({
      success: function (res) {
        let citydata = util.sortCityList(res.result[1] || [])
        wx.setStorage({
          key: 'CITY_LIST',
          data: citydata //打印城市数据
        })
        resolve(res)
        // console.log('省份数据：', res.result[0]); //打印省份数据
        // console.log('城市数据：', res.result[1]); //打印城市数据
        // console.log('区县数据：', res.result[2]); //打印区县数据
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}


module.exports = {
  heWeatherApi,
  wxApi,
  qqmapApi
}