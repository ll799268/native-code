/**
 * 函数柯里化
 * @param {*} fn 
 * @param {*} args 
 * @returns 
 */
function curry(fn, args = []) {
  return function () {
    var newArgs = args.concat(Array.prototype.slice.call(arguments))
    if (newArgs.length < fn.length) {
      return curry.call(this, fn, newArgs)
    } else {
      return fn.apply(this, newArgs)
    }
  }
}