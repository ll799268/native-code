

const PADDING = 'PADDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

/**
 * 模拟实现Promise
 * Promise利用三大手段解决回调地狱
 * 1、回调函数延迟绑定
 * 2、返回值穿透
 * 3、错误冒泡
 */
class MyPromise {
  constructor (executor) {
    this.status = PADDING

    this.value = ''
    this.reason = ''

    this.onFulfilledCallbacks = [] // 成功回调函数
    this.onRejectedCallbacks = [] // 失败回调函数
    
    const resolve = data => {
      if (this.status === PADDING) {
        this.value = data
        this.status = FULFILLED
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }

    const reject = reason => {
      if (this.status === PADDING) {
        this.reason = reason
        this.status = REJECTED
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected :
      reason => { throw new Error(reason instanceof Error ? reason.message : reason )} 

    const self = this

    return new MyPromise((resolve, reject) => {
      if (self.status === PADDING) {
        self.onFulfilledCallbacks.push(() => {
          try {
            setTimeout(() => {
              const result = onFulfilled(self.value)
              result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
            })
          } catch (e) {
            reject(e)
          }
        })
        self.onRejectedCallbacks.push(() => {
          try {
            setTimeout(() => {
              const result = onRejected(self.reason)
              result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
            })
          } catch (e) {
            reject(e)
          }
        })
      } else if (self.status === FULFILLED) {
        try {
          setTimeout(() => {
            const result = onFulfilled(self.value)
            result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      } else if (self.status === REJECTED) {
        try {
          setTimeout(() => {
            const result = onRejected(self.reason)
            result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      }
    })
  }

  catch (onRejected) {
    return this.then(null, onRejected)
  }

  static resolve (value) {
    if (value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise((resolve, reject) => resolve(value))
    }
  }

  static reject (reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  static all (promiseArr) {
    const len = promiseArr.length,
      values = new Array(len)
    let count = 0
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i< len; i++) {
        this.resolve(promiseArr[i]).then(
          val => {
            values[i] = val
            count++
            if (count === leg) resolve(values)
          },
          err => reject(err)
        )
      }
    })
  }

  static race (promiseArr) {
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach(p => {
        this.resolve(p).then(
          val => resolve(val),
          err => reject(err)
        )
      })
    })
  }
  
}
