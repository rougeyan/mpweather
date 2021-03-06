const config = require('./apiconfig');
const util = require('../utils/util');
const QQMapWX = require('../lib/qqmap-wx-jssdk.min');
const regeneratorRuntime = require('../lib/regenerator')

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


// 天气参数obj转为string
const heWeatherCoordinatePram = (opt)=>{
  // 非空判判定
  if(!opt && JSON.stringify(opt) !== '{}'){
    return {}
  }else{
    return{
        location: `${opt.latitude},${opt.longitude}`
      }
  }
}
// 实时天气
heWeatherApi.getNowWeather = (option)=>{
  return requestPromisefy({
    url: config.nowWeatherUrl,
    data: {
      ...weatherDefaultParams,
      ...heWeatherCoordinatePram(option)
    },
  })
}

// 逐三小时天气
heWeatherApi.getHourlyWeather = (option)=>{
  return requestPromisefy({
    url: config.hourlyWeatherUrl,
    data: {
      ...weatherDefaultParams,
      ...heWeatherCoordinatePram(option)
    },
  })
}

// 逐日天气
heWeatherApi.getDailyWeather = (option)=>{
  return requestPromisefy({
    url: config.dailyWeatherUrl,
    data: {
      ...weatherDefaultParams,
      ...heWeatherCoordinatePram(option)
    },
  })
}

// 获取生活方式;
heWeatherApi.getLifestyle = (option) =>{
  return requestPromisefy({
    url: config.lifestyleUrl,
    data: {
      ...weatherDefaultParams,
      ...heWeatherCoordinatePram(option)
    },
  })
}

// -------------------微信原生 api---------------------------------


// 获取定位坐标并且转换逆坐标;
wxApi.getLocation = async (self) => {
	// 获取定位坐标
	const latestLocateCoor = await wxlocation(self);
	// 逆坐标
	const cityfullName = await qqmapApi.reverseGeocoder(latestLocateCoor);;
	// setData
	await successGetLocateName(latestLocateCoor,cityfullName,self);

	return Promise.resolve()
}

function wxlocation(self){
	return new Promise((resolve)=>{
    wx.getLocation({
      type: 'gcj02',
      // altitude: true,
      success (res) {
        let latestCoordinate = {
          latitude: res.latitude,
          longitude: res.longitude
				}
				// 更新Data
				const citys = util.cityIndexType(0,'general.coordinate'); // 必定是第一个;
        self.setData({
          [citys]: latestCoordinate
				})
        // {latitude: 23.15792, longitude: 113.27324}
				// 存最后一次定位数据到USER_CITYS;
				// 同时 只有定位才进行逆坐标

				// 设置 USER_CITYS
        resolve(latestCoordinate)
      },
      fail (err) {
        // 定位未被授权
        wx.setStorageSync('userLocationAllow',false)
        self.setData({
          renderOpenSettingBtn:true
        })
        resolve();
      }
    })
  })

}
function successGetLocateName(coordinate,name,self){
	return new Promise((resolve,reject)=>{
		let uc = wx.getStorageSync('USER_CITYS')
		if(uc && uc[0]){
			uc[0].fullname = name;
			uc[0].location = coordinate;
		}else{
			throw new Error("未初始化 USER_CITYS")
		}
		// 定位已经授权
		wx.setStorageSync('userLocationAllow',true);

		const locationText = util.cityIndexType(0,'general.locationText'); // 必定是第一个;
        self.setData({
          [locationText]: name
				})
		wx.setStorage({
			key: 'USER_CITYS',
			data: uc
		})
		resolve()
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

// 储存用户的
wxApi.saveUserCityIntoStorage = (citydata,status)=>{
	if(!status){
		wx.showToast({
			title: '添加失败,暂时无法获取该地区天气',
			icon: 'none',
			duration: 2000
		})
		return
	}
	let {fullname,location,addr,coordinate} = citydata;
	let obj = {
		fullname: fullname || addr,
		location:{
			latitude:location?location.lat:undefined || coordinate?coordinate.latitude:undefined,
			longitude:location?location.lng:undefined || coordinate?coordinate.longitude:undefined
		}
	}
	let storageCitylist = wx.getStorageSync('USER_CITYS');
	// 存储用户的城市;
	if(storageCitylist instanceof Array){
		// 这里需要判定是否重复添加;
		let repeat = false;
		storageCitylist.map((cur)=>{
			if(!repeat && cur.fullname == obj.fullname){
				repeat = true;
			}
		})
		if (!repeat){
			storageCitylist.push(obj)
		}else{
			wx.showToast({
				title: '请勿重复添加',
				icon: 'none',
				mask: true,
				duration: 2000
			})
			return
		}
	}else{
		storageCitylist = [];
		storageCitylist.push(obj)
	}
	// 存储用户城市列表
	wx.setStorage({
		key:'USER_CITYS',
		data: storageCitylist
	})

	setTimeout(() => {
		wx.navigateBack({
			url: `../index/index`
		})
	}, 0);
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
        resolve(res.result.address)
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
