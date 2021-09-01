var flag = true

var obj = {
  a: 1,
  ...(flag && { b: 2 })
}

console.log(obj);