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
    // 变相打开授权页;
    showOpenSettingBtn: false,
    // 自定义数据列表;
    // 当下天气信息 [{对应城市},{}]
    grettings: "",
    // 初始化默认城市 作判定 是否允许定位; 不允许使用默认城市
    cityList: {
      geo: {}, // 定位
      custMake: [] // 自定义城市
    },
    presentWeather: [], // [{城市1(必须定位);城市2;城市3}] 当前城市列表;
    hourlyWeather: [], // [] 现在小时天气
    dailyWeather: [], // [] 逐日天气
  },
  onLoad: function () {
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
  // 初始化函数
  async init() {
    let self = this;
    // 已经有缓存的情况下;
    let latestLocated = wx.getStorageSync('LATEST_LOCATE');

    if(latestLocated){
      latestLocated = JSON.stringify(latestLocated) == "{}" ||latestLocated ==""?undefined:util.locationParamsToString(latestLocated);
    }
    
    await api.wxApi.showLoading();
    // 初始化天气
    const latestGeo = await setData.updateNowWeather(self,latestLocated);
    // 逆坐标
    await setData.toReverseGeocoder(self,latestGeo);
    // 获取逐步三小时天气
    await setData.updateHourlyWeather(self,latestLocated);
    // 获取逐日天气
    await setData.updateDailyWeather(self,latestLocated);

    await api.wxApi.hideLoading();
  },
  //事件处理函数
  bindViewTap: function () {
    // 可以设置id;以及hash值;
    wx.navigateTo({
      url: '../geoPage/geoPage?id=10086&hash=fromFirstPage'
    })
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

  // 获取用户定位;
  async geoLocation() {
    let self = this;
    const geoTips = "定位中..";
    await api.wxApi.showLoading(geoTips);

    const lock = await api.wxApi.getLocation(self);
    
    await this.updateItemCityWeahter(lock);

    await api.wxApi.hideLoading();
  },
  // 点击title独立城市
  async updateItemCityWeahter(lock) {
    // 点击索引
    let self = this;
    // let clickCityIndex = e.target.dataset.cityindex;
    // 天气入参
    let stringGeo = util.locationParamsToString(self.data.cityList.geo);

    if(!lock){
      return Promise.resolve();
    }

    const params = await setData.updateNowWeather(self,stringGeo);
    // 逆坐标
    await setData.toReverseGeocoder(self, params);
    // 更新小时天气
    await setData.updateHourlyWeather(self, stringGeo);
    // 获取逐日天气
    await setData.updateDailyWeather(self, stringGeo);
  },

  // 处理定位;
  handleLocationSetting: function () {
    let self = this;
    wx.getSetting({
      success: function (res) {
        // 没有授权
        if (res.authSetting["scope.userLocation"]) {
          self.setData({
            showOpenSettingBtn: false
          })
        }
      },
      fail: function (err) { }
    })
  },
  //

  // 改变swiper的时候更新 location;
  changeSwiper: function (e) {
    // changgeSwiper 之前
    // 这里已经添加到到列表里面;
    // 但是仍未更新;
    // console.log(e);
    // console.log("do changeSwiper");
  },
  tapswiperitem: function (e) {
    // console.log(e);
    // console.log("do tapswiperitem");
  }
})
