//index.js
//获取应用实例
const app = getApp()
const config = app.globalData.config
const api = app.globalData.api

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cityList:[
      {
        location: 'beijing', 
      },{
        location: 'guangzhou', 
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(this);
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
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // api
    api.heWeatherApi.getNowWeather().then((res)=>{
      console.log(this);
    })
    api.heWeatherApi.getDailyWeather().then((res)=>{
      console.log(res)
    })
  },

  getUserInfo: function(e) {
    console.log(e)
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
    console.log(e);
  },
  tapswiperitem: function(e){
    console.log(e);
  }

})
