
/**
 * 函数柯里化
 * @param {Function} fn 执行函数
 * @param {Array} arg 参数
 * @returns 
 */
const curry = (fn, arg = []) => {
  const _this = this;
  return function () {
    const newArgs = [...arg, ...arguments];
    if (fn.length > newArgs.length) {
      return curry.call(_this, fn, newArgs);
    }
    return fn.apply(_this, newArgs);
  }
}

const sum = curry((a, b, c) => a + b + c)

console.log(sum(1, 2, 3));
console.log(sum(1, 2)(3));
console.log(sum(1)(2)(3));