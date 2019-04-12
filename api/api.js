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
  // 判定参数
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
wxApi.getLocation = (self) => {
  const cityGeo = 'cityList.geo';
  // // 初始化的最后一次定位数据;
  // // if(getLatestRecord && !!getLatestRecord){
  // //   let LATEST_LOCATE = wx.getStorageSync('LATEST_LOCATE');
  // //   if(JSON.stringify(LATEST_LOCATE) !== "{}"){
  // //     self.setData({
  // //       [cityGeo]: latestGeo
  // //     })
  // //     return Promise.resolve(LATEST_LOCATE)
  // //   }
  // // }
  return new Promise((resolve)=>{
    wx.getLocation({
      type: 'gcj02',
      // altitude: true,
      success (res) {
        let latestGeo = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        self.setData({
          [cityGeo]: latestGeo
        })
        // 存最后一次定位数据;
        wx.setStorage({
          key: 'LATEST_LOCATE',
          data: latestGeo //打印城市数据
        })
        resolve(true)
      },
      fail (err) {
        self.setData({
          showOpenSettingBtn:true
        })
        resolve(false);
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
wxApi.showLoading = (text)=>{
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title: text?text:'正在加载中',
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
        latitude: option.latitude || option.lat,
        longitude: option.longitude || option.lon
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

// 缓存搜索
qqmapApi.getCityList = ()=>{
  // 优先同步取缓存中的城市列表;
  let CITY_LIST = wx.getStorageSync('CITY_LIST');
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

qqmapApi.getSuggestion = (value)=>{
  return new Promise((resolve, reject) => { 
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) {//搜索成功后的回调
        resolve()
        // var sug = [];
        // for (var i = 0; i < res.data.length; i++) {
        //   sug.push({ // 获取返回结果，放到sug数组中
        //     title: res.data[i].title,
        //     id: res.data[i].id,
        //     addr: res.data[i].address,
        //     city: res.data[i].city,
        //     district: res.data[i].district,
        //     latitude: res.data[i].location.lat,
        //     longitude: res.data[i].location.lng
        //   });
        // }
        // _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
        //   suggestion: sug
        // });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  }) 
}


module.exports = {
  heWeatherApi,
  wxApi,
  qqmapApi,
  weatherDefaultParams
}