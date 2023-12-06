
class Instanceof {
  constructor () {
  }
  
  flag (l, r) {
    if (
      l === null ||
      l === undefined ||
      r === null ||
      r === undefined
    ) {
      return false
    }

    return l.__proto__ === r.prototype ||
      this.flag(l.__proto__, r)
  }
}

class Person {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
}
const user = new Person('ll', 26)
const myInstanceof = new Instanceof()

console.log(user instanceof Person);
console.log(myInstanceof.flag(user, Person));

console.log(myInstanceof.flag([1, 2, 3], Array))
console.log(myInstanceof.flag({ a: 1 }, Object))