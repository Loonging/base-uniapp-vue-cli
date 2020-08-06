import request from '../utils/http.js'
module.exports = {
  getMock: data => {
    return request('/api/middleData', 'GET', data)
  }
}
