
/**
 * 字符串转换为数组
 * @param {*} str 
 * @returns 
 */
function strFormatArr(str) {
  // return str.split('')
  // return [...str]
  return Array.from(str)
}
var str = 'abc'
var arr = strFormatArr(str)