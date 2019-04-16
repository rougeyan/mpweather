const app = getApp()
const api = app.globalData.api
const util = app.globalData.util
// pages/geolocate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: [], // 城市列表
    letterSlideBar: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    api.qqmapApi.getCityList().then((res)=>{
      this.setData({
        cityList: res
      })
    });
    api.qqmapApi.getSuggestion().then((res)=>{
      var sug = [];
      for (var i = 0; i < res.data.length; i++) {
        sug.push({ // 获取返回结果，放到sug数组中
          title: res.data[i].title,
          id: res.data[i].id,
          addr: res.data[i].address,
          city: res.data[i].city,
          district: res.data[i].district,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng
        });
      }
      console.log(sug);
      self.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
        suggestion: sug
      });
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapCityItem: function(e){
    console.log(e)
    // 触摸后 添加到 userCityList
  },
  searchInputEvent: util.debounce(function(event){
    // 使用防抖
    // arguments[0] = event;
    let val = event.detail.value;
    console.log(val);
  },1200)
})