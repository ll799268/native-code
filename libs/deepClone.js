/**
 * 深度克隆(不包含日期、正则)
 * @param {*} origin 
 * @param {*} target 
 */
function deepClone(origin, target) {
  var tar = target || {},
    toStr = Object.prototype.toString,
    arrType = '[object Array]'

  for (var k in origin) {
    if (origin.hasOwnProperty(k)) {
      if (typeof origin[k] === 'object' && origin[k] !== null) {
        tar[k] = toStr.call(origin[k]) === arrType ? [] : {}
        deepClone(origin[k], tar[k])
      } else {
        tar[k] = origin[k]
      }
    }
  }

  return tar
}

// 深拷贝(有些引用类型不生效)

// const newArr = JSON.parse(JSON.stringify(arr))
// const newArr = arr.splice(0)
// const newArr = Object.create(arr)