//index.js
//获取应用实例
// 全局共享API;
const app = getApp()
const api = app.globalData.api
const util = app.globalData.util
const updateData = require("./setData")
const regeneratorRuntime = require('../../lib/regenerator')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 自定义数据列表;
    // 当下天气信息 [{对应城市},{}]
    grettings: "",
    // 初始化默认城市 作判定 是否允许定位; 不允许使用默认城市
    location: [],
    defaultCity: {}, // 若不授权的情况下 只取默认城市同时不给选
    presentWeather: [], // 现在天气
    hourlyWeather: [], // 现在小时天气
    dailyWeather: [], // 逐日天气
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
    this.init()
    // 格式化问候语
    this.setData({
      grettings: util.getGreetings()
    })
  },
  // 初始化函数
  async init() {
    var self = this;
    // 这里每一个都是new Promise 实例;
    // 实例之间resolve / reject 不能传递;
    // 做一个事件55分钟的时间限制; 在storage中;
    await api.wxApi.showLoading();
    // 当前天气
    await updateData.updateNowWeather(self);
    // 获取逐步三小时天气
    await updateData.updateHourlyWeather(self);
    // 获取逐日天气
    await updateData.updateDailyWeather(self);
    
    await api.wxApi.hideLoading();
  },
  //事件处理函数
  bindViewTap: function () {
    // 可以设置id;以及hash值;
    wx.navigateTo({
      url: '../locatePage/locatePage?id=10086&hash=fromFirstPage'
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
  getLocation() {
    api.wxApi.getLocation().then((res) => {
      this.setData({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        }
      })
    }, err => {
      console.log(err)
      // 若用户设置授权失败后
      // 此代码调用允许用户手动操作全选
      wx.openSetting({
        success(res) {
          console.log(res)
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
        },
        fail(res) {
          console.log(res);
        }
      })
    })
  },
  //
  async updateWeahter() {
    var self = this;
    //  String化坐标;
    var params = {
      data: {
        location: `${self.data.location.latitude},${self.data.location.longitude}`
      }
    };
    // 更新天气; 因为这里也
    try {
      await api.wxApi.showLoading();
      await updateData.updateNowWeather(self, params);
      // 逆坐标
      await api.qqmapApi.reverseGeocoder(self.data.location).then((res) => {
        // 更新某一项子key[{key}]
        var presentIndex = "presentWeather[" + 0 + "].location";
        this.setData({
          [presentIndex]: res.address
        })
      })
      await api.wxApi.hideLoading();
    } catch (error) {
      throw new Error(error)
    }
    // reverseGeoCoder 应该是只更新一次;
    // 或者
    // 逆地址一次;

    // 这里是有bug的 因为执行先后顺序的问题 往往是 qqmap 先返回 然后 NowWeather 后返回 因此先更新了 地图的location 再更新了天气接口的 location;

    //所以是有问题的;
      
    
  },
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
