let originArr = [1, 12, 4, 6, 8, 10]

function proxySearchArr(arr) {
  let proxy = new Proxy(arr, {
    // 源对象、下标/字段，代理过的对象
    get(oTarget, sKey, receiver) {
      console.log(receiver);
      if (sKey >= 0) {
        return oTarget[sKey]
      } else {
        return oTarget[Math.abs(sKey)]
      }
    }
  })
  
  return proxy
}

const formatArr = proxySearchArr(originArr)

console.log(formatArr[-1]);