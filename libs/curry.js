/**
 * 函数柯里化
 * @param {*} fn 
 * @param {*} args 
 * @returns 
 */
function curry(fn, args = []) {
  return function () {
    // var newArgs = args.concat(Array.prototype.slice.call(arguments)) // 参数是伪数组，将其转换为数组
    const newArgs = [...args, ...arguments] // 参数是伪数组，将其转换为数组
    if (newArgs.length < fn.length) {
      curry.call(this, fn, newArgs)
    } else {
      fn.apply(this, newArgs)
    }
  }
}
