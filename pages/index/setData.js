// 因为页面太多setData的话 导致js太长, 次js只作setData操作

// 引入API 模块
// const api = app.globalData.api
const app = getApp()
const api = app.globalData.api
// 通过cond_code 反馈cnName;
// function(code){
//   let cur = config.bgImgList.find((item) => {
//     return item.codes.includes(parseInt(code))
//   })
// }

// 更新现在天气
function getNowWeather(self) {
  var presentIndex = "presentWeather[" + 0 + "]"
  api.heWeatherApi.getNowWeather().then((res) => {
    let data = res.HeWeather6[0]
    self.setData({
      [presentIndex]: {
        tmp: data.now.tmp, // 温度
        lat: data.basic.lat, // 纬度
        lon: data.basic.lon, // 经度
        location: data.basic.location, // 城市定位
        cond_txt: data.now.cond_txt, // 天气状况
        cond_code: data.now.cond_code,
        update_time: data.update.loc // 当地时间(最后更新时间)
      }
    })
  })
}
// 逐日三小时天气
function getHourlyWeather(self) {
  api.heWeatherApi.getHourlyWeather().then((res) => {
    let arr = res.HeWeather6[0].hourly;
    console.log(arr);
    var filterDateARR = [];
    // 过滤数据
    // 待优化;
    for (var i = 0; i < arr.length; i++) {
      var obj = {};
      obj.time = arr[i].time;
      obj.cond_code = arr[i].cond_code; // 天气状况代 
      obj.cond_txt = arr[i].cond_txt; // 天气状况代(中文)
      obj.tmp = arr[i].tmp; // 温度
      obj.pop = arr[i].pop; // 降水概率
      filterDateARR.push(obj)
    }
    self.setData({
      hourlyWeather: filterDateARR
    });
    console.log(self.data.hourlyWeather);
  })
}



// 更新未来逐日天气
function getDailyWeather(self, index) {
  api.heWeatherApi.getDailyWeather().then((res) => {
    let arr = res.HeWeather6[0].daily_forecast;
    var filterDateARR = [];
    // 过滤数据
    // 待优化;
    for (var i = 0; i < arr.length; i++) {
      var obj = {};
      obj.date = arr[i].date //预报日期  //2013-12-30
      obj.sr = arr[i].sr //日出时间  //07:36
      obj.ss = arr[i].ss //日落时间  //16:58
      obj.mr = arr[i].mr //月升时间  //04:47
      obj.ms = arr[i].ms //月落时间  //14:59
      obj.tmp_max = arr[i].tmp_max //最高温度  //4
      obj.tmp_min = arr[i].tmp_min //最低温度  //-5
      obj.cond_code_d = arr[i].cond_code_d //白天天气状况代码  //100
      obj.cond_code_n = arr[i].cond_code_n //晚间天气状况代码  //100
      obj.cond_txt_d = arr[i].cond_txt_d //白天天气状况描述  //晴
      obj.cond_txt_n = arr[i].cond_txt_n //晚间天气状况描述  //晴
      obj.wind_deg = arr[i].wind_deg //风向360角度  //310
      obj.wind_dir = arr[i].wind_dir //风向  //西北风
      obj.wind_sc = arr[i].wind_sc //风力  //1-2
      obj.wind_spd = arr[i].wind_spd //风速，公里/小时  //14
      obj.hum = arr[i].hum //相对湿度  //37
      obj.pcpn = arr[i].pcpn //降水量  //0
      obj.pop = arr[i].pop //降水概率  //0
      obj.pres = arr[i].pres //大气压强  //1018
      obj.uv_index = arr[i].uv_index //紫外线强度指数  //3
      obj.vis = arr[i].vis //能见度，单位：公里  //10
      filterDateARR.push(obj)
    }
    self.setData({
      dailyWeather: filterDateARR
    });
  })
}

// 更新
function updateDataForCity(self) {
  self.setData({
    textData: "数据已被更新"
  })
}
// 
function updataElseData(self) {
  self.setData({
    textData: "数据第二次已被更新"
  })
}

// 更新城市的某一项: 数据[{},{第二项数据被更新掉},{}]
/**
 * 
 * @param { page对象 } self 
 * @param { 修改的index } index 
 */
function updateCityDaTA(self, index) {
  // 这里只更新 城市的某一项:
  // 参考 : https://www.cnblogs.com/Mrrabbit/p/7680934.html
  var presentIndex = "presentWeather[" + 0 + "]"
  self.setData({
    [presentIndex]: {
      tmp: '99', // 温度
      lat: "1234", // 纬度
      lon: "2134123", // 经度
      location: '数组子项更新', // 城市定位
      cond_txt: '什么鬼', // 天气状况
      // condIconUrl: `${COND_ICON_BASE_URL}/999.png`, // 天气图标
      loc: '' // 当地时间(最后更新时间)
    },
  })
}

module.exports = {
  // updateDataForCity,
  // updataElseData,
  // updateCityDaTA,
  getNowWeather,
  getHourlyWeather,
  getDailyWeather
}