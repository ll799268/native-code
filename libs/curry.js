const curry = (fn, arg = []) => {
  return () => {
    const newArg = [...arg, arguments]
    newArg.length < fn.length ? fn.apply(this, newArg) :  curry.call(this, fn, newArg)
  }
}

const add = arr => arr.reduce((prev, cur) => prev + cur, 0)

const sum = add([1, 2, 3])

console.log(sum);