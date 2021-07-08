// 状态
const STATUS = {
  FULFILLED: 'resolved',
  REJECTED: 'rejected',
  PENDING: 'pending'
}


/**
 * 发布者订阅模式（简单可以调用）
 */
class myPromise {
  constructor(executor) {
    this.status = STATUS.PENDING

    this.value = undefined // 成功的数据
    this.reason = undefined  // 失败的原因

    this.onResolvedCallbacks = [] // 成功回调队列
    this.onRejectedCallbacks = [] // 失败回调队列

    let resolve = val => {
      // 状态不可逆，只有是PENDING时，才可以改变状态
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.RESOLVED
        this.value = val

        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    let reject = reason => {
      // 状态不可逆，只有是PENDING时，才可以改变状态
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
        
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    // 错误处理
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }

  }

  // 实例的公共方法
  then(onFulfilled, onRejected) {
    if (this.status === STATUS.FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === STATUS.REJECTED) {
      onRejected(this.reason)
    }
    if (this.status === STATUS.PENDING) {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }

}

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  },1000);
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  }
)