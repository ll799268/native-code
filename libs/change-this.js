Function.prototype.myCall = function (ctx) {
  ctx = ctx ? Object(ctx) : globalThis
  ctx.fn = this // this 临时挂载方法上

  var args = []

  // 剩余参数，从第二个开始
  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }

  // eval执行字符串函数，赋值给一个函数返回出去
  var result = eval('ctx.fn(' + args + ')')

  delete ctx.fn
  return result
}

Function.prototype.myApply = function (ctx, args) {
  ctx = ctx ? Object(ctx) : globalThis
  ctx.fn = this

  var result = null

  if (args[1]) {
    result = ctx.fn(...arguments[1])
  } else {
    result = ctx.fn()
  }

  delete ctx.fn
  return result
}


Function.prototype.myBind = function (context) {
  var args = [...arguments].slice(1),
    fn = this
    
  return function () {
    fn.apply(context, args.concat(...arguments))
  }
}