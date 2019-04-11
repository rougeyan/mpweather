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
    // 变相打开授权页;
    showOpenSettingBtn: false,
    // 自定义数据列表;
    // 当下天气信息 [{对应城市},{}]
    grettings: "",
    // 初始化默认城市 作判定 是否允许定位; 不允许使用默认城市
    cityList: {
      geo:{}, // 定位
      custMake:[] // 自定义城市
    },
    presentWeather: [], // array obj现在天气
    hourlyWeather: [], // array obj 现在小时天气
    dailyWeather: [], // array obj 逐日天气
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
    const geoStart = "定位中..";
    const geoEnd = "定位结束";
    let geoTips = "";
    await api.wxApi.showLoading(geoStart);

    await api.wxApi.getLocation(self)

    await api.wxApi.hideLoading();
  },
  //
  handleLocationSetting: function(){
    let self = this;
    wx.getSetting({
      success: function (res) {
        // 没有授权
        if (res.authSetting["scope.userLocation"]) {
          self.setData({
            showOpenSettingBtn:false
          })
        }
      },
      fail:function (err) {}
    })
  },
  //
  async updateItemCityWeahter(e) {
    // 点击索引
    let self = this;
    let clickCityIndex = e.target.dataset.cityindex
    //  String化坐标;
    let params = {
      data: {
        location: `${self.data.cityList.geo.latitude},${self.data.cityList.geo.longitude}`
      }
    };
    // 更新天气; 因为这里也
    // try {
      await api.wxApi.showLoading();
      await updateData.updateNowWeather(self, params);
      // 逆坐标
      await api.qqmapApi.reverseGeocoder(self.data.cityList.geo).then((res) => {
        // 更新某一项子key[{key}]
        let presentIndex = "presentWeather[" + 0 + "].location";
        this.setData({
          [presentIndex]: res.address
        })
      })
      await api.wxApi.hideLoading();
    // } catch (error) {
    //   throw new Error(error)
    // }
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
