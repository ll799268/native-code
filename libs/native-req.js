class Request {
  constructor () {
    this.xhr = new XMLHttpRequest()
  }

  get (url, fn) {
    const xhr = this.xhr
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function () {
      xhr.readyState === 4 && fn(xhr.responseText)
    }
    xhr.send()
  }

  post (url, data, fn) {
    const xhr = this.xhr
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function () {
      xhr.readyState === 4 && fn(xhr.responseText)
    }
    xhr.send(data)
  }
}

export default Request


// import Request from './libs/nativeReq.js'

// function fn () {
//   const request = new Request()
//   request.get('https://recordapi.bszyo.com/api/information', res => {
//     const result = JSON.parse(res).data
//     console.log(result);
//   })
// }

// fn()