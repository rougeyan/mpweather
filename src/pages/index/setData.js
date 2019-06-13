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
const OTHER = 'other';



// 更新现在天气
const updateNowWeather = (self,params,index = DEFAULT_INDEX)=>{
  let citysGeneral = util.cityIndexType(index,GENERAL); // 天气概况;
  let citysOther = util.cityIndexType(index,OTHER); // 天气概况;

	return api.heWeatherApi.getNowWeather(params.coordinate).then(res=>{
    let data = res.HeWeather6[0];
    let {now:{tmp,cond_txt,cond_code,fl,wind_dir,wind_spd,hum,pcpn,pres,vis},basic:{location,lat,lon},update:{loc},} = data;
    self.setData({
      // 设置天气概况
      [citysGeneral]: {
        tmp: tmp, // 温度
        locationText: params.locationText?params.locationText:location, // 城市定位
        cond_txt: cond_txt, // 天气状况
        cond_code: util.iconNumToString(cond_code), // 图标code
				update_time: util.formatterTime(loc,'hh:mm'), // 当地时间(最后更新时间)
				coordinate:{
					latitude: (params.coordinate&&params.coordinate.latitude)?params.coordinate.latitude:lat,
					longitude:(params.coordinate&&params.coordinate.longitude)?params.coordinate.longitude:lon
				} // 坐标;
      },
      [citysOther]:[{
        title:'体感温度',
        msg: `${fl}℃`
      },{
        title:'风',
        msg: `${wind_dir} ${(wind_spd*1000/3600).toFixed(2)}米/秒`
      },{
        title:'相对湿度',
        msg: `${hum}%`
      },{
        title:'降水量',
        msg: `${pcpn}毫米`
      },{
        title:'气压	',
        msg: `${pres}百帕`
      },{
        title:'能见度	',
        msg: `${vis}米`
      }]
    })
    /**
     * [promise.then](http://es6.ruanyifeng.com/#docs/function)
     * then 返回一个Promise 实例
     * return object 相当于 return new Promise((res)=>{
     *  res(object)
     * })
     */
    // 因为有可能这个人不没参数, 因此用默认的;
    return {
      latitude: (params&&params.latitude)?params.latitude:lat,
      longitude:(params&&params.longitude)?params.longitude:lon
    }
  })
}
// 逐日三小时天气
const updateHourlyWeather = (self,params,index = DEFAULT_INDEX)=>{
  return api.heWeatherApi.getHourlyWeather(params.coordinate).then((res) => {
		var citysHourly = util.cityIndexType(index,HOURLY);
    let arr = res.HeWeather6[0].hourly;
    let filterArr = arr.map((currentValue)=>{
      return {
        time:util.transferTime(currentValue.time), // 时间
        cond_code: util.iconNumToString(currentValue.cond_code), // 天气状况代
        cond_txt: currentValue.cond_txt, // 天气状况代(中文)
        tmp: currentValue.tmp, // 温度
        rainpop: ((currentValue.cond_code>=300 && currentValue.cond_code<= 406) && currentValue.pop>=20)?`${Math.round(currentValue.pop/10)*10}%`:'' // 降水概率
      }
    })
    self.setData({
      [citysHourly]: filterArr
		});
    return
  })
}
// 逐日天气
const updateDailyWeather =(self, params,index = DEFAULT_INDEX)=>{
  return api.heWeatherApi.getDailyWeather(params.coordinate).then((res) => {
		var citysDaily = util.cityIndexType(index,DAILY);
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
        cond_code_d:util.iconNumToString(cur.cond_code_d), //白天天气状况代码  //100
        cond_code_n:util.iconNumToString(cur.cond_code_n), //晚间天气状况代码  //100
        cond_txt_d:cur.cond_txt_d, //白天天气状况描述  //晴
        cond_txt_n:cur.cond_txt_n, //晚间天气状况描述  //晴
        // wind_deg:cur.wind_deg, //风向360角度  //310
        // wind_dir:cur.wind_dir, //风向  //西北风
        // wind_sc:cur.wind_sc, //风力  //1-2
        // wind_spd:cur.wind_spd, //风速，公里/小时  //14
        // hum:cur.hum, //相对湿度  //37
        // pcpn:cur.pcpn, //降水量  //0
        rainpop:((cur.cond_code_d>=300 && cur.cond_code_d<= 406) && cur.pop>=20)?`${Math.round(cur.pop/10)*10}%`:'', //降水概率  //0
        // pres:cur.pres, //大气压强  //1018
        // uv_index:cur.uv_index, //紫外线强度指数  //3
        // vis:cur.vis, //能见度，单位：公里  //10
      }
    })
    self.setData({
      [citysDaily]: filterArr
		});
		return
  })
}

module.exports = {
  updateNowWeather,
  updateHourlyWeather,
  updateDailyWeather,
}
