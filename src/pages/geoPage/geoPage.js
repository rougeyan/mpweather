const app = getApp();
const api = app.globalData.api;
const util = app.globalData.util;
const geoSetData = require('./geoSetData');
const regeneratorRuntime = require('../../lib/regenerator')
// pages/geolocate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: [], // 城市列表
    letterSlideBar: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'], // 基础字母
		searched: false, // 是否进行过搜索
    searchResultSugList: [], // 搜索结果列表
    switchSearchResult: false, // 是否显示搜索显示
    barIndex: 0, // 侧边栏索引值;
		focusSearchInput: false, // 搜索输入框焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options)
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
	// 触摸定位位置
  catchGeo: function(e){
    // wx.navigateBack({
    //   url: '../index/index?id=10086&hash=fromGeoPage'
    // })
  },
  // 输入框(防抖功能) 并且 增加搜索;
  searchInputEvent: util.debounce(function(event){
		console.log("debounce");
    var self = this;
    let inputVal = event.detail.value;  // arguments[0] = event;
    geoSetData.setSearchResultSugList(self,inputVal);
  },333),
  // 字母滚动关联
  letterScroll: util.throttle(function () {
    // [NodesRef.boundingClientRect](https://developers.weixin.qq.com/miniprogram/dev/api/NodesRef.boundingClientRect.html?search-key=boundingClientRect)
    // 使用说明
    wx.createSelectorQuery().selectAll('.city-list-letter').boundingClientRect((rects) => {
				// 添加节点的布局位置的查询请求
				// [Array​.prototype​.find​Index()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
				let index = rects.findIndex((item) => {
          return item.top >= 40;
				})
        if (index === -1) {
          index = 0;
				}
        this.setIndex(index-1)
			}).exec()

	}, 125),
	// 输入框对焦
	focusInputEvent:function(event){
		// console.log(event.detail);
		this.setData({
			focusSearchInput: true
		})
	},
	// 输入框失焦
	blurSearchInput:function(){
		this.setData({
			focusSearchInput: false,
			switchSearchResult: false
		})
	},
	// 点击模糊搜索结果
	searchResultTap: function (e) {
		var option = e.currentTarget.dataset.item;
	},
	// 具体城市点击
	tapCityItem: async function (e) {
		var option = e.currentTarget.dataset.item;
		const status = await this.checkTapCityStatus(option)
		await api.wxApi.saveUserCityIntoStorage(option,status)
	},

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
	// 检测该地区天气是否存在
	checkTapCityStatus(params){
		let {location,coordinate} = params;
		let locate ={
			latitude:location?location.lat:undefined || coordinate?coordinate.latitude:undefined,
			longitude:location?location.lng:undefined || coordinate?coordinate.longitude:undefined
		}
		return new Promise((resolve)=>{
			api.heWeatherApi.getNowWeather(locate).then(res=>{
				if(res.HeWeather6[0].status=="ok"){
					resolve(true)
				}else{
					resolve(false)
				}
			})
		})
	},
})
