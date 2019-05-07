const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const WeekDay = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']

// 过滤日期
const formatWeatherTime = n =>{
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

// 天气参数obj转为string
const locationParamsToString = (obj)=>{
  // 非空判判定
  if(JSON.stringify(obj) == "{}" ||obj ==""){
    return undefined
  }else{
    return {
      data: {
        location: `${obj.latitude},${obj.longitude}`
      }
    }
  }
}


module.exports = {
  formatTime: formatTime,
  getGreetings: getGreetings,
  throttle: throttle,
  debounce,debounce,
  formatWeatherTime: formatWeatherTime,
  sortCityList: sortCityList,
	locationParamsToString: locationParamsToString,
	WeekDay: WeekDay
}

