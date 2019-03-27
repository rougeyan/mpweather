//index.js
//获取应用实例
// 全局共享API;
const app = getApp()
const config = app.globalData.config
const api = app.globalData.api
const indexPageSetData = require("./setData")

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 自定义数据列表;
    // 当下天气信息 [{对应城市},{}]
    textData: "数据没有被更新",
    // 初始化默认城市 作判定 是否允许定位; 不允许使用默认城市
    defaultCity:{

    },
    // presentWeather 里面的数据会被更新掉;
    // 而且这个不能写在data里面 应该被引入; 
    // 如localStorage
    // 应该读取
    presentWeather: [
      {
      },
    ],
    hourlyWeather:[],
    dailyWeather:[],
  },
  // 页面显示/切入前台时触发。
  onShow(){
    this.init()
  },
  // 初始化函数
  init(){
    var self = this;
    // 获取
    // 这里有优化的地方:建议使用async funcname{ await funcname(); await funcname2();}

    // 获取现在天气
    indexPageSetData.getNowWeather(self);
    // 获取逐步三小时天气
    indexPageSetData.getHourlyWeather(self);
    // 获取逐日天气
    indexPageSetData.getDailyWeather(self);
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e);
    // 设置全局globalDatauserInfo;
    app.globalData.userInfo = e.detail.userInfo
    // page设置setData属性;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 改变swiper的时候更新 location;
  changeSwiper: function(e){
    // changgeSwiper 之前
    // 这里已经添加到到列表里面;
    // 但是仍未更新;
    console.log(e);
    console.log("do changeSwiper");
  },
  tapswiperitem: function(e){
    console.log(e);
    console.log("do tapswiperitem");
  }
})
