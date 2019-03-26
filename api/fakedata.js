// 假数据

// 现在天气
let nowWeatherResponse = {
  "HeWeather6": [
      {
          "basic": {
              "cid": "CN101280101", //地区／城市ID	
              "location": "广州", // 地区／城市名称
              "parent_city": "广州", // 该地区／城市的上级城市
              "admin_area": "广东", // 该地区／城市的上级城市
              "cnty": "中国", // 该地区／城市所属国家名称
              "lat": "23.12517738", // 地区／城市纬度
              "lon": "113.28063965", // 地区／城市经度
              "tz": "+8.00" // 该地区／城市所在时区
          },
          "update": {
              "loc": "2019-03-26 13:55",  // 	当地时间，24小时制，格式yyyy-MM-dd HH:mm	2017-10-25 12:34
              "utc": "2019-03-26 05:55"  // UTC时间，24小时制，格式yyyy-MM-dd HH:mm	2017-10-25 04:34
          },
          "status": "ok",  // 接口状态码;
          "now": {
              "cloud": "91",
              "cond_code": "101",  // 实况天气状况代码  
              "cond_txt": "多云",  // 实况天气状况描述
              "fl": "26",
              "hum": "71",
              "pcpn": "0.0",
              "pres": "1018",
              "tmp": "24",  // 温度，默认单位：摄氏度
              "vis": "9",
              "wind_deg": "146",
              "wind_dir": "东南风",
              "wind_sc": "1",
              "wind_spd": "4"
          }
      }
  ]
}
//

module.exports = {
  nowWeatherResponse
}