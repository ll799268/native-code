/**
 * 链式调用（返回this即可）
 */
class CreateTeacher {
  constructor(ctx) {
    this.ctx = ctx
  }

  setAge() {
    this.ctx.age++
    return this
  }

  setName() {
    this.ctx.name = this.ctx.name + '后缀'
    return this
  }

  twoChange(callback) {
    this.ctx.age = callback()
    return this
  }
}

let LL = new CreateTeacher({ name: 'lili', age: 24 }).setAge().setName().twoChange(() => 50)
console.log(LL);