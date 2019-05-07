// 引入API 模块
// const api = app.globalData.api
const app = getApp();
const api = app.globalData.api
const util = app.globalData.util
// 其他参数;
const DEFAULT_INDEX = 0;
const GENERAL = 'general';
const DAILY = 'daily';
const HOURLY = 'hourly';
const LOCATION = 'location';


const cityIndexType = function(index,type){
	var parmasReady = arguments.length ===2;
	if (parmasReady){
		return `citys[${index}].${type}`
	}else{
		throw new Error('参数有误')
	}
}
// 更新现在天气
const updateNowWeather = (self,params,index = DEFAULT_INDEX)=>{
  let citys = cityIndexType(index,GENERAL); // 天气概况;
  let cityListIndex = index==0?"cityList.geo":"cityList.custMake["+index+"]."
  return api.heWeatherApi.getNowWeather(params).then(res=>{
    let data = res.HeWeather6[0];
    let {now:{tmp,cond_txt,cond_code},basic:{location,lat,lon},update:{loc}} = data;
    self.setData({
      // 设置天气概况
      [citys]: {
        tmp: tmp, // 温度
        locationText: location, // 城市定位
        cond_txt: cond_txt, // 天气状况
        cond_code: cond_code, // 图标code
				update_time: util.formatWeatherTime(loc), // 当地时间(最后更新时间)
				coordinate:{
					longitude:lon,
					latitude: lat
				} // 坐标;
			},
    })
    /**
     * [promise.then](http://es6.ruanyifeng.com/#docs/function)
     * then 返回一个Promise 实例
     * return object 相当于 return new Promise((res)=>{
     *  res(object)
     * })
     */
    return location
  })
}
// 逐日三小时天气
const updateHourlyWeather = (self,params,index = DEFAULT_INDEX)=>{
  return api.heWeatherApi.getHourlyWeather(params).then((res) => {
		var citys = cityIndexType(index,HOURLY);
    let arr = res.HeWeather6[0].hourly;
    let filterArr = arr.map((currentValue)=>{
      return {
        time:util.formatWeatherTime(currentValue.time), // 时间
        cond_code: currentValue.cond_code, // 天气状况代
        cond_txt: currentValue.cond_txt, // 天气状况代(中文)
        tmp: currentValue.tmp, // 温度
        rainpop: currentValue.pop>0?`${currentValue.pop}%`:'' // 降水概率
      }
    })
    self.setData({
      [citys]: filterArr
		});
    return
  })
}
// 逐日天气
const updateDailyWeather =(self, params,index = DEFAULT_INDEX)=>{
  return api.heWeatherApi.getDailyWeather(params).then((res) => {
		var citys = cityIndexType(index,DAILY);
		let arr = res.HeWeather6[0].daily_forecast;
    let filterArr = arr.map(function (cur) {
      return {
        date:util.WeekDay[new Date(cur.date).getDay()], //预报日期  //2013-12-30
        // sr:cur.sr, //日出时间  //07:36
        // ss:cur.ss, //日落时间  //16:58
        // mr:cur.mr, //月升时间  //04:47
        // ms:cur.ms, //月落时间  //14:59
        tmp_max:cur.tmp_max, //最高温度  //4
        tmp_min:cur.tmp_min, //最低温度  //-5
        cond_code_d:cur.cond_code_d, //白天天气状况代码  //100
        cond_code_n:cur.cond_code_n, //晚间天气状况代码  //100
        cond_txt_d:cur.cond_txt_d, //白天天气状况描述  //晴
        cond_txt_n:cur.cond_txt_n, //晚间天气状况描述  //晴
        // wind_deg:cur.wind_deg, //风向360角度  //310
        // wind_dir:cur.wind_dir, //风向  //西北风
        // wind_sc:cur.wind_sc, //风力  //1-2
        // wind_spd:cur.wind_spd, //风速，公里/小时  //14
        // hum:cur.hum, //相对湿度  //37
        // pcpn:cur.pcpn, //降水量  //0
        rainpop:cur.pop>0?`${cur.pop}%`:'', //降水概率  //0
        // pres:cur.pres, //大气压强  //1018
        // uv_index:cur.uv_index, //紫外线强度指数  //3
        // vis:cur.vis, //能见度，单位：公里  //10
      }
    })
    self.setData({
      [citys]: filterArr
		});
		return
  })
}
// 逆坐标(只会存在定位的时候转换逆坐标)
const toReverseGeocoder = (self,params,index = DEFAULT_INDEX) =>{
  return api.qqmapApi.reverseGeocoder(params).then((res) => {
		let citys = cityIndexType(index,LOCATION);
    self.setData({
      [citys]: res.address
    })
  })
}

module.exports = {
  updateNowWeather,
  updateHourlyWeather,
  updateDailyWeather,
  toReverseGeocoder,
}
