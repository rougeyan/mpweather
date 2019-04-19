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

/**
 * [一个通用request的封装](https://developers.weixin.qq.com/community/develop/article/doc/000cac14f44e70059368f3c1b5bc13)
 */
// 判定状态码;
function isHttpSuccess(status) {
  return status >= 200 && status < 300 || status === 304;
}
/**
 * promise请求
 * 参数：参考wx.request
 * 返回值：[promise]res
 */
function requestPromisefy(options = {}) {
  const {
    success,
    fail,
  } = options;
  // success 之作resolve操作;
  // 所有success 的操作都放再.then(res=>{
  //  // 这里, 什么setData 什么resolve;
  // 但是我需要使用 resolve;, 这里已经被resolve了, 所以return Promise.resolve()
  // 我需要在then里面 resolve
  // })
  return new Promise((res, rej) => {
    wx.request(Object.assign(
      {},
      options,
      {
        success(r) {
          const isSuccess = isHttpSuccess(r.statusCode);
          if (isSuccess) {  // 成功的请求状态
            res(r.data);
          } else {
            rej({
              msg: `网络错误:${r.statusCode}`,
              status: r.statusCode,
              detail: r
            });
          }
        },
        fail: rej,
      },
    ));
  });
}

// -------------------和风天气服务 api---------------------------------

// 实时天气
heWeatherApi.getNowWeather = (option)=>{
  return requestPromisefy({
    url: config.nowWeatherUrl,
    data: {
      ...weatherDefaultParams,
      ...option
    },
  })
}

// 逐三小时天气
heWeatherApi.getHourlyWeather = (option)=>{
  return requestPromisefy({
    url: config.hourlyWeatherUrl,
    data: {
      ...weatherDefaultParams,
      ...option,
    },
  })
}

// 逐日天气
heWeatherApi.getDailyWeather = (option)=>{
  return requestPromisefy({
    url: config.dailyWeatherUrl,
    data: {
      ...weatherDefaultParams,
      ...option
    },
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
        // 定位已经授权
        wx.setStorageSync('userLocation',true);
        resolve(true)
      },
      fail (err) {
        // 定位未被授权
        wx.setStorageSync('userLocation',false)
        self.setData({
          renderOpenSettingBtn:true
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
        resolve(citydata)
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

// 搜索建议
qqmapApi.getSuggestion = (value)=>{
  value = !value?"广州":value
  return new Promise((resolve, reject) => { 
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) {//搜索成功后的回调
        resolve(res)
      },
      fail: function(error) {
      },
      complete: function(res) {
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