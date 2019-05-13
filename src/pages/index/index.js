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
		citys:[{
			general:{}, // 概况
			hourly:[],// 逐3小时
      daily:[], // 逐日
      other:[], // 其他信息(如湿度,降水量等)
		}],
		latestCoordinate: wx.getStorageSync('LATEST_COORDINATE'), // Object
    userCityList: [], // 用户的城市列表
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
    // 然后Dom 一句操作完的数据渲染;
    // 也就是说 DOM 的某些条件渲染wx:if="{{condition}}"" condition 的判定逻辑可以放在onLoad 里面执行去setData
    // 类似vue的create的生命周期;
		this.getUserLocationAllow();
		// 判定是否有
		// api.wxApi.saveUserCityIntoStorage({
		// 	fullname: !latestCoordinate?'上次定位':'北京',
		// 	location: latestCoordinate
		// })
  },
  // 页面显示/切入前台时触发。
  onShow() {
    // 格式化问候语;
    this.setData({
      grettings: util.getGreetings()
    })
    // 初始化;
    this.init()
	},
	getUserInfo: function (e) {
    console.log(e);
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
	// 取定位授权
  getUserLocationAllow(){
    const USERLOCATIONALLOW = wx.getStorageSync('userLocationAllow');
    if(!USERLOCATIONALLOW && typeof(USERLOCATIONALLOW) !="boolean"){
      // undefined 默认都是
      // 第一次问也不知道是否被授权了 因为授权的操作不在这个getUserLocationAllow上;
      this.setData({
        renderOpenSettingBtn: false
      })
    }else{
      // boolen状态下取反;
      this.setData({
        renderOpenSettingBtn: !USERLOCATIONALLOW
      })
    }
	},
	// 获取单个城市的所有天气内容default(0)
	async getCityItemWeather(index){
		let self = this;
    await api.wxApi.showLoading();
    // 初始化天气
    const initCoordinate = await setData.updateNowWeather(self, self.data.latestCoordinate,index);
		// 获取逐步三小时天气 和获取逐日天气(这两个请求可以并行;)
		await Promise.all([
			setData.toReverseGeocoder(self, initCoordinate,index),
			setData.updateHourlyWeather(self, self.data.latestCoordinate,index),
			setData.updateDailyWeather(self, self.data.latestCoordinate,index)]);

    await api.wxApi.hideLoading();
	},
  // 导航至添加更多城市
  toCityListPage: function () {
    // 可以设置id;以及hash值;
    wx.navigateTo({
      url: '../geoPage/geoPage?id=10086&hash=fromFirstPage'
    })
  },
  // 获取用户定位;
  async geoLocation() {
    let self = this;
    const geoTips = "定位中..";
    await api.wxApi.showLoading(geoTips);

    const lock = await api.wxApi.getLocation(self);

    await this.updateLocateWeahter(lock);

    await api.wxApi.hideLoading();
  },
  // 更新定位城市信息
  async updateLocateWeahter(lock,idx=0) {
    // 点击索引
    let self = this;
    // let clickCityIndex = e.target.dataset.cityindex;
    let coordinate = self.data.citys[idx].general.coordinate
    if (!lock) {
      return Promise.resolve();
    }

    const params = await setData.updateNowWeather(self, coordinate);
    // 逆坐标
    // 更新 3小时天气&& 逐日天气
    await Promise.all([
			setData.toReverseGeocoder(self, params),setData.updateHourlyWeather(self, coordinate),
			setData.updateDailyWeather(self, coordinate)])
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
    // 这里优先取city-item请求的data;
  },
})
