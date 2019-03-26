//index.js
//获取应用实例
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
      // {
      //   tmp: 'N/A', // 温度
      //   lat: "",  // 纬度
      //   lon: "", // 经度
      //   location: '', // 城市定位
      //   cond_txt: '', // 天气状况
      //   // condIconUrl: `${COND_ICON_BASE_URL}/999.png`, // 天气图标
      //   loc: '' // 当地时间(最后更新时间)
      // },
      {
        tmp: '12', // 温度
        lat: "案发时的",  // 纬度
        lon: "asfdsa ", // 经度
        location: '北京朝阳区', // 城市定位
        cond_txt: 'asdf ', // 天气状况
        // condIconUrl: `${COND_ICON_BASE_URL}/999.png`, // 天气图标
        loc: '' // 当地时间(最后更新时间)
      },
      {
        tmp: '32', // 温度
        lat: "asdf ",  // 纬度
        lon: "a1111", // 经度
        location: '广州', // 城市定位
        cond_txt: '2222', // 天气状况
        // condIconUrl: `${COND_ICON_BASE_URL}/999.png`, // 天气图标
        loc: '3333' // 当地时间(最后更新时间)
      }
    ],
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
    // setData 和api 请求合并成同一块, 否则 过度分离;
    api.heWeatherApi.getNowWeather().then((res)=>{
      console.log(res);
      // set Data
    })
    // 获取现在天气
    api.heWeatherApi.getDailyWeather().then((res)=>{
      console.log(res);
    })
  },

  setDataFoRcity(){
    var self = this; // 保存调用对象self
    // // 第一次更新数据;
    // indexPageSetData.updateDataForCity(self);
    // // 第二次更新数据;
    // setTimeout(() => {
    //   indexPageSetData.updataElseData(self);
    // }, 3000);
    indexPageSetData.updateCityDaTA(self);
    console.log(this.data.presentWeather)
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
