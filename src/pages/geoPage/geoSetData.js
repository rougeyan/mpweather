const app = getApp();
const api = app.globalData.api
const util = app.globalData.util

// 打开搜索列表变量
const OPEN = true;
const CLOSE = false;

const setSearchResultSugList = (self,params)=>{

  // 空字符串关闭城市列表;
  if(!params){
    self.setData({
      switchSearchResult: CLOSE
    })
    return Promise.resolve()
  }

  return new Promise((resolve)=>{
    api.qqmapApi.getSuggestion(params).then(res=>{
			if(res.data.length ===0){

			}
			let sug = res.data.map(cur =>{
				return {
					title: cur.title,
          id: cur.id,
          addr: cur.address,
          city: cur.city,
					district: cur.district,
					coordinate :{
						latitude: cur.location.lat,
						longitude: cur.location.lng
					}
				}
			})
      self.setData({
        searchResultSugList: sug,
				switchSearchResult: OPEN, // pop开关;
				searched: true
      })
    })
  })
}

module.exports = {
  setSearchResultSugList
}
