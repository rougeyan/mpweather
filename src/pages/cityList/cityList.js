// pages/cityList/cityList.js
const app = getApp();
const api = app.globalData.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
		userCityList:[],
		delBtnWidth: 120,
		isScroll: true, // 是否禁止纵向滑动;
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
		// 请求;
		this.getAllCityTmp().then(res=>{
			self.setData({
				userCityList:res
			})
    })
	},
	// 获取所有城市温度
	getAllCityTmp (){
		var list = wx.getStorageSync('USER_CITYS');
		if(!list ||  !list.length){
			return Promise.resolve([])
		}
		return Promise.all(list.map((item,idx)=>{
			return new Promise((resolve)=>{
				api.heWeatherApi.getNowWeather(item.location).then(res=>{
					let {tmp} = res.HeWeather6[0].now;
					tmp?list[idx]["tmp"] = tmp:list[idx]["tmp"] = "/";
					list[idx]["right"] = 0;
					resolve(item)
				})
			})
		}))
	},
	// 删除左滑
	touchStart:function(e){
		if(e.currentTarget.dataset.index ===0){
			return
		}
		let touch = e.touches[0];
		this.setData({
			startX: touch.clientX,
		})
	},
	touchMove:function(e){
		let touch = e.touches[0];
		let item = this.data.userCityList[e.currentTarget.dataset.index]
		let disX = this.data.startX - touch.clientX;
		let right = `userCityList[${e.currentTarget.dataset.index}].right`

		if(item.right == this.data.delBtnWidth || e.currentTarget.dataset.index ===0){
			return
		}
		if(disX >=20){
			// 超过问题;
			if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
			}
			this.setData({
        [right]: disX
      })
		}else {
      this.setData({
        [right]: 0
      })
    }
	},
	touchEnd:function(e){
		// 首个不允许删除
		if(e.currentTarget.dataset.index ===0){
			return
		}
		let item = this.data.userCityList[e.currentTarget.dataset.index];
		let right = `userCityList[${e.currentTarget.dataset.index}].right`
    if (item.right >= this.data.delBtnWidth/2) {
      this.setData({
        [right]: this.data.delBtnWidth
      })
    } else {
      this.setData({
        [right]: 0
      })
    }
	},
	// 删除城市
	deleteCity: function(e){
		var self = this;
		let item = this.data.userCityList;
		[e.currentTarget.dataset.index];
		let index = e.currentTarget.dataset.index;
		// console.log(index);
		let originalArr = wx.getStorageSync('USER_CITYS');
		let dataOrginal = this.data.userCityList;
		// 删除对应元素; 会改变原来数组;
		originalArr.splice(e.currentTarget.dataset.index,1);
		dataOrginal.splice(e.currentTarget.dataset.index,1);

		this.setData({
			userCityList:dataOrginal
		})
		wx.setStorage({
			key:'USER_CITYS',
			data:originalArr
		})
	},
	addCity: function(){
		wx.navigateTo({
      url: '../geoPage/geoPage?id=10086&hash=fromFirstPage'
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

  }
})
