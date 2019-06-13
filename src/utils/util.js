const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatterTime = (date,fmt)=>{
	date = new Date(date.replace(/-/g,"/"));
	var o = {
		"M+" : date.getMonth() + 1,
		"d+" : date.getDate(),
		"h+" : date.getHours(),
		"m+" : date.getMinutes(),
		"s+" : date.getSeconds(),
		"q+" : Math.floor((date.getMonth() + 3) / 3),
		"S" : date.getMilliseconds()
		};
		if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const WeekDay = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']

// data => 01时
const transferTime = n =>{
  return `${!!n?n.toString().split(" ")[1].split(":")[0]:""}时`;
}

// 节流;
const throttle = function(fn, delay) {
  let lastTime = 0
  return function () {
    let nowTime = Date.now()
    if (nowTime - lastTime > delay || !lastTime) {
      fn.apply(this, arguments)
      lastTime = nowTime
    }
  }
}

// 防抖
const debounce = function(fun, delay) {
  return function (args) {
      //获取函数的作用域和变量
      let that = this
      let _args = args
      //每次事件被触发，都会清除当前的timeer，然后重写设置超时调用
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
          fun.call(that, _args)
      }, delay)
  }
}

// 格式化问候语
const getGreetings = () => {
  let h = new Date().getHours()
  let w = ''
  if (h > 0 && h <= 2) {
    w = '！凌晨了，尽快休息。'
  } else if (h > 5 && h <= 9) {
    w = '！早上好'
  } else if (h > 9 && h <= 11) {
    w = '！上午好'
  } else if (h > 11 && h <= 13) {
    w = '！中午好'
  } else if (h > 13 && h <= 17) {
    w = '！下午好'
  } else if (h > 17 && h <= 19) {
    w = '！傍晚好'
  } else if (h > 20 && h <= 22) {
    w = '！晚上好'
  } else if (h > 22) {
    w = '！深夜了，注意休息。'
  }
  return `${w}`
}

// 城市排序
const sortCityList = (data) => {
  if (!Array.isArray(data)) {
    return []
  }

  let d = data.reduce((pre, cur) => {
    let { pinyin, ...attr } = cur
    pre.push({
      initial: pinyin.join('').toUpperCase(),
      ...attr // 把其余所有的可遍历的遍历出来;
    })
    return pre
  }, [])

  d.sort((a, b) => {
    return (a.initial > b.initial) ? 1 : -1
  })

  return d
}

const iconNumToString =(code)=>{
  let strobj= {
    sunny: [100,900],
    cloudy: [101,102,103],
    overcast: [104],
    windy: [200,202,203,204],
    calm: [201,901,999],
    storm: [205,206,207,208,209,210,211,212,213],
    rain: [300,302,305,309,399],
    hail: [304],
    moderate_rain: [306,314,315],
    heavy_rain: [301,303,307,308,310,311,312,316,317,318],
    freezing_rain: [313,404,405,406],
    light_snow: [400,408],
    moderate_snow: [401,407,409,499],
    heavy_snow: [402,403,409,410],
    dust: [503,504,507,508],
    haze: [500,501,502,509,510,511,512,513,514,515]
  }
  let str = "";
  for (var key in strobj) {
    if(!str.length){
      strobj[key].forEach(cur => {
        if(cur == code){
          str = key
        }
      });
    }
  }
  return `icon-${str}`
}

const cityIndexType = function(index,type){
	var parmasReady = arguments.length ===2;
	if (parmasReady){
		return `citys[${index}].${type}`
	}else{
		throw new Error('参数有误')
	}
}

module.exports = {
  formatTime: formatTime,
  getGreetings: getGreetings,
  throttle: throttle,
  debounce:debounce,
  transferTime: transferTime,
  sortCityList: sortCityList,
  WeekDay: WeekDay,
  cityIndexType:cityIndexType,
	iconNumToString:iconNumToString,
	formatterTime:formatterTime
}

