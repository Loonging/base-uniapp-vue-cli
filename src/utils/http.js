const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://xjrm.ngrok.do-it.cn'

const showToast = (title) => {
  uni.showToast({
    title: title,
    icon: 'none'
  })
}
const showModal = (content) => {
  uni.showModal({
    title: '网络请求失败',
    content: content,
    showCancel: false,
    success: function (res) {
      return
    }
  })
}
/** 请求接口
 * @method http
 * @param {String} url 接口地址
 * @param {Object} data 接口参数
 * @param {Object} option 接口配置信息，可选
 * @return {Object} Promise
 */
const http = (url, data = {}, option = {}) => {
  const hideLoading = option.hideLoading || false // 是否显示 loading
  const hideMsg = option.hideMsg || false // 是否隐藏错误提示
  const method = option.method && (option.method.toUpperCase() || 'GET')	//	小写转大写
  const header = option.header || { 'content-type': 'application/x-www-form-urlencoded' }
  let token = '' // 登录鉴权获得的 token
  uni.getStorage({
    key: 'token',
    success: (ress) => {
      token = ress.data
    }
  })
  if (!hideLoading) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: method, // 默认 post 请求
      header: {
        'Authorization': token,
        ...header
      },
      data: data,
      success: res => { // 服务器成功返回的回调函数
        if (!hideLoading) uni.hideLoading()
        if (res.statusCode === 200) {
          const result = res.data
          if (result.code === 0) {
            resolve(result)
            return
          }
          reject(result.errmsg)
          if (!hideMsg) showModal(result.msg)
        } else { // 返回值非 200，强制显示提示信息
          showToast('[' + res.statusCode + '] 系统处理失败')
          reject('[' + res.statusCode + '] 系统处理失败')
        }
      },
      fail: (err) => { // 接口调用失败的回调函数
        if (!hideLoading) uni.hideLoading()
        if (err.errMsg !== 'request:fail abort') {
          showToast('连接超时，请检查您的网络。')
          reject('连接超时，请检查您的网络。')
        }
      }
    })
  })
}
export default http
