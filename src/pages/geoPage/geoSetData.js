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

      self.setData({
        searchResultSugList: sug,
        switchSearchResult: OPEN // 开发开关;
      })
      console.log(self.data.searchResultSugList);
    })
  })
}

module.exports = {
  setSearchResultSugList
}