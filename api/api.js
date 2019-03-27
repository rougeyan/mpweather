const config = require('./apiconfig');
const FAKEDATA = require('./fakedata')

// 默认参数(若不授权默认显示天气参数)
const defaultParams = {
  key: config.weatherKey,
  location: 'guangzhou',
  lang: 'zh-cn',
  unit: 'm'
}

// weather api (天气接口)
let heWeatherApi ={};

let fakeHourly = {
  "HeWeather6": [
      {
          "basic": {
              "cid": "CN101010100",
              "location": "北京",
              "parent_city": "北京",
              "admin_area": "北京",
              "cnty": "中国",
              "lat": "39.90498734",
              "lon": "116.40528870",
              "tz": "8.0"
          },
          "hourly": [
              {
                  "cloud": "8",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "84",
                  "pop": "0",
                  "pres": "1018",
                  "time": "2017-10-27 01:00",
                  "tmp": "8",
                  "wind_deg": "49",
                  "wind_dir": "东北风",
                  "wind_sc": "微风",
                  "wind_spd": "2"
              },
              {
                  "cloud": "8",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "81",
                  "pop": "0",
                  "pres": "1018",
                  "time": "2017-10-27 04:00",
                  "tmp": "8",
                  "wind_deg": "29",
                  "wind_dir": "东北风",
                  "wind_sc": "微风",
                  "wind_spd": "2"
              },
              {
                  "cloud": "6",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "95",
                  "pop": "0",
                  "pres": "1019",
                  "time": "2017-10-27 07:00",
                  "tmp": "8",
                  "wind_deg": "37",
                  "wind_dir": "东北风",
                  "wind_sc": "微风",
                  "wind_spd": "2"
              },
              {
                  "cloud": "2",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "75",
                  "pop": "0",
                  "pres": "1018",
                  "time": "2017-10-27 10:00",
                  "tmp": "14",
                  "wind_deg": "108",
                  "wind_dir": "东南风",
                  "wind_sc": "微风",
                  "wind_spd": "3"
              },
              {
                  "cloud": "0",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "62",
                  "pop": "0",
                  "pres": "1016",
                  "time": "2017-10-27 13:00",
                  "tmp": "16",
                  "wind_deg": "158",
                  "wind_dir": "东南风",
                  "wind_sc": "微风",
                  "wind_spd": "6"
              },
              {
                  "cloud": "0",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "73",
                  "pop": "0",
                  "pres": "1016",
                  "time": "2017-10-27 16:00",
                  "tmp": "15",
                  "wind_deg": "162",
                  "wind_dir": "东南风",
                  "wind_sc": "微风",
                  "wind_spd": "6"
              },
              {
                  "cloud": "3",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "92",
                  "pop": "0",
                  "pres": "1018",
                  "time": "2017-10-27 19:00",
                  "tmp": "13",
                  "wind_deg": "206",
                  "wind_dir": "西南风",
                  "wind_sc": "微风",
                  "wind_spd": "4"
              },
              {
                  "cloud": "19",
                  "cond_code": "100",
                  "cond_txt": "晴",
                  "hum": "96",
                  "pop": "0",
                  "pres": "1019",
                  "time": "2017-10-27 22:00",
                  "tmp": "13",
                  "wind_deg": "212",
                  "wind_dir": "西南风",
                  "wind_sc": "微风",
                  "wind_spd": "1"
              }
          ],
          "status": "ok",
          "update": {
              "loc": "2017-10-26 23:09",
              "utc": "2017-10-26 15:09"
          }
      }
  ]
}

let fakerDaily = {
  "HeWeather6": [
      {
          "basic": {
              "cid": "CN101010100",
              "location": "北京",
              "parent_city": "北京",
              "admin_area": "北京",
              "cnty": "中国",
              "lat": "39.90498734",
              "lon": "116.40528870",
              "tz": "8.0"
          },
          "daily_forecast": [
              {
                  "cond_code_d": "103",
                  "cond_code_n": "101",
                  "cond_txt_d": "晴间多云",
                  "cond_txt_n": "多云",
                  "date": "2017-10-26",
                  "hum": "57",
                  "pcpn": "0.0",
                  "pop": "0",
                  "pres": "1020",
                  "tmp_max": "16",
                  "tmp_min": "8",
                  "uv_index": "3",
                  "vis": "16",
                  "wind_deg": "0",
                  "wind_dir": "无持续风向",
                  "wind_sc": "微风",
                  "wind_spd": "5"
              },
              {
                  "cond_code_d": "101",
                  "cond_code_n": "501",
                  "cond_txt_d": "多云",
                  "cond_txt_n": "雾",
                  "date": "2017-10-27",
                  "hum": "56",
                  "pcpn": "0.0",
                  "pop": "0",
                  "pres": "1018",
                  "tmp_max": "18",
                  "tmp_min": "9",
                  "uv_index": "3",
                  "vis": "20",
                  "wind_deg": "187",
                  "wind_dir": "南风",
                  "wind_sc": "微风",
                  "wind_spd": "6"
              },
              {
                  "cond_code_d": "101",
                  "cond_code_n": "101",
                  "cond_txt_d": "多云",
                  "cond_txt_n": "多云",
                  "date": "2017-10-28",
                  "hum": "26",
                  "pcpn": "0.0",
                  "pop": "0",
                  "pres": "1029",
                  "tmp_max": "17",
                  "tmp_min": "5",
                  "uv_index": "2",
                  "vis": "20",
                  "wind_deg": "2",
                  "wind_dir": "北风",
                  "wind_sc": "3-4",
                  "wind_spd": "19"
              }
          ],
          "status": "ok",
          "update": {
              "loc": "2017-10-26 23:09",
              "utc": "2017-10-26 15:09"
          }
      }
  ]
}
// 天气请求
function weatherPromiseRequest(option){
  // 解构 (依据wx.request接口)
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
  // // 返回假数据
  // return new Promise((resolve,reject)=>{
  //   console.log("resolve nowWeatherResponse");
  //   resolve(FAKEDATA.nowWeatherResponse)
  // })
  // 真实请求
  return weatherPromiseRequest({
    ...option,
    url: config.nowWeatherUrl
  })
}
// 逐日天气
heWeatherApi.getDailyWeather = (option)=>{
    // 返回假数据
  return new Promise((resolve,reject)=>{
    resolve(fakerDaily)
  })
  // return weatherPromiseRequest({
  //   ...option,
  //   url: config.dailyWeatherUrl
  // })
}

// 逐三小时天气
heWeatherApi.getHourlyWeather = (option)=>{
    return new Promise((resolve,reject)=>{
    resolve(fakeHourly)
  })
  // return weatherPromiseRequest({
  //   ...option,
  //   url: config.hourlyWeatherUrl
  // })
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
