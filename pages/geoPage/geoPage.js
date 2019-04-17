const app = getApp();
const api = app.globalData.api;
const util = app.globalData.util;
const geoSetData = require('./geoSetData');
// pages/geolocate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: [], // 城市列表
    letterSlideBar: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    searchResultSugList: [],
    switchSearchResult: false,
    barIndex: 0, // 侧边栏索引值;
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
    // 获取城市列表;
    api.qqmapApi.getCityList().then((res)=>{
      this.setData({
        cityList: res
      })
    });
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
  catchGeo: function(e){
    // 触摸定位位置
    wx.navigateBack({
      url: '../index/index?id=10086&hash=fromGeoPage'
    })
  },
  // 输入框(防抖功能) 并且 增加搜索;
  searchInputEvent: util.debounce(function(event){
    var self = this;
    let inputVal = event.detail.value;  // arguments[0] = event;
    
    geoSetData.setSearchResultSugList(self,inputVal);

  },1200),
  // 字母关联
  letterScroll: util.throttle(function () {
    // [NodesRef.boundingClientRect](https://developers.weixin.qq.com/miniprogram/dev/api/NodesRef.boundingClientRect.html?search-key=boundingClientRect)
    // 使用说明
    console.log("scroll");

    wx.createSelectorQuery().selectAll('.city-list-letter')  // 所有字母;
      .boundingClientRect((rects) => {
        // 添加节点的布局位置的查询请求
        let index = rects.findIndex((item) => {
          return item.top >= 0
        })
        if (index === -1) {
          index = rects.length
        }
        this.setIndex(index - 1)
      }).exec()

  }, 20),

  // 设置字母索引号
  setIndex (index) {
    if (this.data.barIndex === index) {
      return false
    } else {
      this.setData({
        barIndex: index
      })
    }
  },
})