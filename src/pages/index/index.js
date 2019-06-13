//index.js
//获取应用实例
// 全局共享API;
const app = getApp()
const api = app.globalData.api
const util = app.globalData.util
const setData = require("./setData")
const regeneratorRuntime = require('../../lib/regenerator')

Page({
  data: {
		userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
		// 渲染权限按钮
    renderOpenSettingBtn: false,
    // 当下天气信息 [{对应城市},{}]
		grettings: "定位中...",
		// 时间
		time:{
			weekday: util.WeekDay[new Date().getDay()]
		},
		// 页面渲染信息
		citys:[],
    userCityList: wx.getStorageSync('USER_CITYS'), // 用户的城市列表(上层数据)
  },
  onLoad: function () {
		var self = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // onLoad 的操作一般都是对渲染数据进行操作;
    // 此时未有DOM 依据操作完的数据渲染;
    // 也就是说 DOM 的某些条件渲染wx:if="{{condition}}"" condition 的判定逻辑可以放在onLoad 里面执行去setData
		// 类似vue的create的生命周期;

		// 判定定位权限 => set Render 内容;
		this.getUserLocationAllow();

		// 初始化USER_CITYS;
		this.initUserCity();
	},
	// 取定位授权
  getUserLocationAllow(){
    const USER_LOCATION_ALLOW = wx.getStorageSync('userLocationAllow');
    if(!USER_LOCATION_ALLOW && typeof(USER_LOCATION_ALLOW) !="boolean"){
      // undefined 默认都是
      // 第一次问也不知道是否被授权了 因为授权的操作不在这个getUserLocationAllow上;
      this.setData({
        renderOpenSettingBtn: false
      })
    }else{
      // boolen状态下取反;
      this.setData({
        renderOpenSettingBtn: !USER_LOCATION_ALLOW
      })
    }
	},

	// 第一次初始化USER_CITYS
	initUserCity(){
		if(!this.data.userCityList){
			const INIT_USERCITYS = [{
				fullname : "北京市东城区东长安街14号",
				location : {latitude: 39.90498734, longitude: 116.4052887}
			}]
			wx.setStorageSync('USER_CITYS',INIT_USERCITYS);
			this.syncDataUserCitys();
		}
	},

	// ------------ onLoad前函数 ------------

	// 页面显示/切入前台时触发。
  onShow() {
		var self = this;
    // 格式化问候语;
    this.setData({
      grettings: util.getGreetings()
		})
		//  重新获取userCitysList 因为data 在onshow的情况下不会再被修改;
		this.setData({
			userCityList:wx.getStorageSync('USER_CITYS')
		},function(){
			//  同步citys和 userCityList
			self.syncDataUserCitys();
			// 初始化;
			self.init()
		})
	},
	getUserInfo: function (e) {
    // console.log(e);
    // 设置全局globalDatauserInfo;
    app.globalData.userInfo = e.detail.userInfo
    // page设置setData属性;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 初始化
  init() {
		this.getCityItemWeather();
	},
	// 获取单个城市的所有天气内容
	async getCityItemWeather(index=0){
		let self = this;
		// 初始化天气
		await api.wxApi.showLoading();

		// const initCoordinate = await setData.updateNowWeather(self, self.data.latestCoordinate,index);

		// 获取即时天气,逐三小时天气 和 逐日天气
		await Promise.all([
			setData.updateNowWeather(self, self.data.citys[index]['general'],index),
			setData.updateHourlyWeather(self, self.data.citys[index]['general'],index),
			setData.updateDailyWeather(self, self.data.citys[index]['general'],index)]);
		await api.wxApi.hideLoading();
	},
  // 导航至添加更多城市
  toCityListPage: function () {
    // 可以设置id;以及hash值;
    wx.navigateTo({
      url: '../cityList/cityList?id=10086&hash=fromFirstPage'
    })
  },
  // 获取用户定位;
  async geoLocation() {
    let self = this;
    const geoTips = "定位中..";

		await api.wxApi.showLoading(geoTips);

    await api.wxApi.getLocation(self);

    await self.getCityItemWeather(0);

		await api.wxApi.hideLoading();
	},

	// 同步用户城市到citys;
	syncDataUserCitys: function(){
		let self = this;
		let citysData = this.data.citys;
		let usercitysData = this.data.userCityList;
		// 增加的情况
		if(usercitysData && usercitysData.length>0 && usercitysData.length >= citysData.length){
			usercitysData.map((cur,idx)=>{
				let {fullname,location} = cur;
				if(!citysData[idx]){
					citysData.push({
						general:{
							locationText:fullname,
							coordinate:location
						},
						hourly:[],
						daily:[],
						other:[]
					})
				}
			})
		}else if(usercitysData && usercitysData.length>0 && usercitysData.length <citysData.length){
			// 删除的情况
			citysData.splice(citysData.length-1,citysData.length-usercitysData.length)
		}
		this.setData({
			citys:citysData
		})
	},
  // 开放数据 - 打开设页
  openSetting: function () {
		let self = this;
    wx.getSetting({
      success: function (res) {
        // 没有授权
        if (!!res.authSetting["scope.userLocation"]) {
          self.setData({
						renderOpenSettingBtn: false
          },()=>{
						// 这里设置是setData 的回调函数
						// bug 在微信端可以 但是在手机端不能自动再请求一次;
						// self.geoLocation()
					});
        }
      },
      fail: function (err) { }
    })
  },
  // 改变swiper的时候更新
  changeSwiper: function (e) {
		let cur = e.detail.current;
		this.getCityItemWeather(cur);
  },
})
