let originArr = [1, 12, 4, 6, 8, 10]

/**
 * 通过es6代理查询数组的下标 负数代表倒数第几个
 * @param {*} arr 
 * @returns 
 */

function proxySearchArr(arr) {
  let proxy = new Proxy(arr, {
    // 源对象、下标/字段，代理过的对象
    get(oTarget, sKey, receiver) {
      if (sKey >= 0) {
        return oTarget[sKey]
      } else {
        return oTarget[Math.abs(sKey)]
        // return oTarget[arr.length + parseInt(sKey)]
      }
    }
  })
  
  return proxy
}

const formatArr = proxySearchArr(originArr)

console.log(formatArr[-3]);