// 因为页面太多setData的话 导致js太长, 次js只作setData操作

// 引入API 模块
const api = app.globalData.api

function updateNowWeather(self){
  api.heWeatherApi.getNowWeather().then((res)=>{
    // setData() 操作
    self.setData({
      textData: "数据已被更新"
    })
  })

}

// 更新
function updateDataForCity(self){
  self.setData({
    textData: "数据已被更新"
  })
}
// 
function updataElseData(self){
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
function updateCityDaTA(self,index){
  // 这里只更新 城市的某一项:
  // 参考 : https://www.cnblogs.com/Mrrabbit/p/7680934.html
  var presentIndex = "presentWeather["+0+"]"
  self.setData({
    [presentIndex]:{
      tmp: '99', // 温度
      lat: "1234",  // 纬度
      lon: "2134123", // 经度
      location: '数组子项更新', // 城市定位
      cond_txt: '什么鬼', // 天气状况
      // condIconUrl: `${COND_ICON_BASE_URL}/999.png`, // 天气图标
      loc: '' // 当地时间(最后更新时间)
    },
  })
}

module.exports = {
  updateDataForCity,
  updataElseData,
  updateCityDaTA
}