# es6篇

## 1、扩展运算符

* 替换函数的apply()方法

  ```js
    const arr = [1, 0, 2]

    // before
    const min = Math.min(1, 0, 2)
    const min = Math.min.apply(this, arr)

    // now
    const min = Math.min(...arr) 
  ```

* 简化函数调用时传递实参的方式

  ```js
    const date = [2023, 11, 27]
    // before
    new Date(date[0], date[1], date[2])

    // now
    new Date(...date)
  ```

* 处理数组和字符串

  ```js
    // 数组
    // before
    const arr1 = [1, 2, 3]
    const arr2 = arr1.slice()       // 复制数组
    const arr3 = arr2.concat(arr1)  // 合并数组
    console.log(arr1)         // [1, 2, 3]
    console.log(arr2)         // [1, 2, 3]
    console.log(arr3)         // [1, 2, 3, 1, 2, 3]

    // now
    const arr2 = [...arr1]
    const arr3 = [...arr1, ...arr2]

    // 字符串
    const str = 'hello'
    // before
    str.split('') // ['h', 'e', 'l', 'l', 'o']

    // now
    [...str]
  ```

## 2、剩余参数

## 3、解构

## 4、模板字面量

## 5、对象字面量的扩展

* 简洁属性和方法
* 计算属性值

  ```js
    const obj = {
      name, // 标识符
      'age': age, // 字符串字面量
      [name + '2']: 'freedom', // 要计算的表达式
      [name + '3']() {
        return name
      }
    }
  ```

## 6、代码模块化

## 7、数字

* 进制
ES6不仅完善了数字的八进制形式，还补充了一种十六进制形式，并且添加了全新的二进制形式。下面的三个变量分别表示八进制、十六进制和二进制的10，注释中给出了该进制的另一种写法。

```js
  const octal = 0o12,      //或0O12
    hex = 0xa,         　//或0XA
    binary = 0b1010;     //或0B1010
```

注意，只有十进制才能表示小数

* Number  
ES6不仅增强了Number对象处理数字的精度，还扩展了它的数字运算能力
  * EPSILON 一个常量，表示1和大于1的最小值之间的差值：`2 ** -52`
  * MAX_SAFE_INTEGER 一个常量，标识js的安全整数上限: `2 ** 53 - 1`
  * MIN_SAFE_INTEGER 一个常量，标识js的安全整数上限: `-(2 ** 53 - 1)`
  * isFinite 判断一个数字是否是有限的，如果参数是NaN、Infinity、-Infinity或者非数字，都将返回false
  * isNaN 判断一个数字是否是NaN
  * isInteger 判断一个数字是否是整数，12和12.0都是整数
  * isSafeInteger 判断一个数组是否是安全整数

* Math
ES6为Math对象新增了6个三角函数、4个对数方法

## 8、字符串

* 解析字符串
  * includes
  * startsWith
  * endsWith  
  startsWith和endsWith第二个参数是可选值，固定开始检索位置

  ```js
    const code = 'My name is liliang'
    code.includes('name') // true
    code.startWith('name') // false
    code.endsWith('name') // false

    code.startWith('name', 3) // true
    code.endsWith('name', 7) // true
  ```

  * repeat  
  指定字符重复次数

  ```js
    'name'.repeat(2) // 'namename'
  ```

## 9、对象

* Object.is()

* Object.assign()

* 重复属性
在ES5的严格模式中，重复的属性名会引起语法错误。但ES6不会再做这个检查，当出现重复属性时，排在后面的同名属性将覆盖前面的，即属性值以后面的为准  

## 10、数组

* 静态方法

  * from()  
  伪数组转换为数组  

  * of()
  用于创建数组，它能接收任意个参数，返回值是由这些参数组成的新数组

  ```js
    Array.of(2);        //[2]
    Array(2);　　　　　  //[ , ]
  ```

* 原型方法

  * fill、copyWithin  
  fill()和copyWithin()两个方法都能接收3个参数  

  | 方法 | 第一个参数 | 第二个参数 | 第三个参数 |
  | :--: | :--: | :--: | :--: |
  | fill | value: 需要填充的值 | start: 起始位置 | end: 结束位置 |
  | copyWithin | target: 开始复制的位置 | start: 起始位置 | end: 结束位置 |

  * find、findIndex、keys、values、entries

## 11、函数

* 默认参数

* 函数属性

  * name

  ```js
    // 利用Function构造器创建的函数，它的名称是“”
    const fn = new Function('a', 'b', 'return a + b')
    fn.name // anonymous

    // 如果是用匿名函数表达式创建的函数，那么它的名称就是变量名；如果改用命名函数表达式创建，那么它的名称就是等号右侧的函数名称
    const fn = function() { }
    fn.name // fn
    const fn = function callback() { }
    fn.name // callback

    // 当用bind()方法绑定一个函数时，它的名称就会加“bound”前缀
    function fn() { }
    fn.bind(this).name // bound fn
  
    // 访问器属性包含写入方法和读取方法，它们的名称会分别加“set”和“get”前缀。注意，需要调用Object.getOwnPropertyDescriptor()才能引用这两个方法
    const obj = {
      get age() { },
      set age(value) { }
    }
    const descriptor = Object.getOwnPropertyDescriptor(obj, 'age') 
    descriptor.get.name // get age
    descriptor.set.name // set age

    // 如果对象的方法是用Symbol命名的，那么这个Symbol的描述就是它的名称
    const sym = Symbol('age')
    const obj = {
      [sym]: function() {}
    }
    obj[sym].name // [age]
  ```

* 块级函数

## 12、箭头函数和尾调用优化

由于不能作为构造函数，因此也就没有元属性（new.target）和原型（prototype属性）  
函数体内不存在arguments、super和this，即没有为它们绑定值  
当需要包含多个参数时，它们的名称不可重复  

## 13、Map、Set

## 14、迭代器  

ES6将迭代器和生成器内置到语言中，不仅简化了数据处理和集合操作，还弥补了for、while等普通循环的不足，例如难以遍历无穷集合或自定义的树结构等  

* 可迭代对象

```js
  const arr = ['a', 'b']
  const iterator = arr[Symbol.iterator]()
  iterator.next() // {value: 'a', done: false}
  iterator.next() // {value: 'b', done: false}
  iterator.next() // {value: undefined, done: true}
```

* for-of  
这是ES6新增的一种循环语句，当要遍历一个可迭代对象时，会先通过它的Symbol.iterator属性得到默认迭代器，再调用迭代器的next()方法，读取IteratorResult的value属性的值并赋给for-of语句中声明的变量，如此反复，直到done属性为true时才终止遍历。而和其它循环语句一样，for-of循环也能通过跳转语句return、break和continue提前终止。

* 字符串  
字符串虽然是基础类型，但它能被隐式的封装成String对象，而String含有默认迭代器，因此可以进行for-of循环  

```js
  // error
  const str = '向𠮳'        // str.length的值为3
  for (let i = 0; i < str.length; i++) {
    console.log(str[i])
  }

  // right
  for (let value of str) {
    console.log(value)
  }
```

## 15、生成器

根据ES6制订的标准自定义迭代器实现起来比较复杂，因此ES6又引入了生成器的概念，生成器（Generator）是一个能直接创建并返回迭代器的特殊函数，可将其赋给可迭代对象的Symbol.iterator属性。与普通函数不同，生成器不仅可以暂停函数内部的执行（即维护内部的状态），在声明时还需要包含一个星号（*），并且拥有next()、return()和throw()三个迭代器方法

## 16、类和类的继承

## 17、Promise

## 18、代理

ES6引入代理（Proxy）地目的是拦截对象的内置操作，注入自定义的逻辑，改变对象的默认行为。也就是说，将某些JavaScript内部的操作暴露了出来，给予开发人员更多的权限。这其实是一种元编程（metaprogramming）的能力，即把代码看成数据，对代码进行编程，改变代码的行为

* 陷阱  
构造函数Proxy()有两个参数，其中target是要用代理封装的目标对象，handler也是一个对象，它的方法被称为陷阱（trap），用于指定拦截后的行为  

| 陷阱 | 拦截 | 返回值 |
| :--: | :--: | :--: |
| get | 读取属性 | 任意值 |
| set | 设置属性 | 布尔值 |
| has | in运算符 | 布尔值 |
| deleteProperty | delete运算符 | 布尔值 |
| getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor() | 属性描述符对象 |
| defineProperty | Object.defineProperty() | 布尔值 |
| preventExtensions | Object.preventExtensions() | 布尔值 |
| isExtensible | Object.isExtensible() | 布尔值 |
| getPrototypeOf | Object.getPrototypeOf()、`__proto__` ，Object.prototype.isPrototypeOf() instanceof | 对象 |
| setPrototypeOf | Object.setPrototypeOf() | 布尔值 |
| apply | Function.prototype.apply()、call() | 任意值 |
| construct | new运算符作用于构造函数 | 对象 |
| ownKeys | Object.getOwnPropertyNames()、Object.keys()、Object.getOwnPropertySymbols()、for in循环 | 数组 |

* 撤销代理  
Proxy.revocable()方法能够创建一个可撤销的代理，它能接收两个参数，其含义与构造函数Proxy()中的相同，但返回值是一个对象，包含两个属性，如下所列  
1.proxy：新生成的Proxy实例  
2.revoke：撤销函数，它没有参数，能把与它一起生成的Proxy实例撤销掉  

## 19、反射

反射（Reflect）向外界暴露了一些底层操作的默认行为，它是一个没有构造函数的内置对象，类似于Math对象，其所有方法都是静态的。代理中的每个陷阱都会对应一个同名的反射方法（例如Reflect.set()、Reflect.ownKeys()等），而每个反射方法又都会关联到对应代理所拦截的行为（例如in运算符、Object.defineProperty()等），这样就能保证某个操作的默认行为可随时被访问到。

* 参数的检验更为严格，Object的getPrototypeOf()、isExtensible()等方法会将非对象的参数自动转换成相应的对象（例如字符串转换成String对象，如下代码所示），而关联的反射方法却不会这么做，它会直接抛出类型错误

```js
  Object.getPrototypeOf('ll') === String.prototype // true
  Reflect.getPrototypeOf('ll') // 类型错误
```

* 更合理的返回值，Object.setPrototypeOf()会返回它的第一个参数，而Reflect的同名方法会返回一个布尔值，后者能更直观的反馈设置是否成功，两个方法的对比如下所示

```js
  const obj = {}
  Object.setPrototypeOf(obj, String) === obj // true
  Reflect.setPrototypeOf(obj, String) // true
```

* 用方法替代运算符，反射能以调用方法的形式完成`new、in、delete`等运算符的功能，在下面的示例中，先使用运算符，再给出对应的反射方法

```js
  function func() { }
  new func()
  Reflect.construct(func, [])

  const people = {
    name: 'll'
  }
  'll' in people
  Reflect.has(people, 'll')

  delete people['ll']
  Reflect.deleteProperty(people, 'll')
```

* 避免冗长的方法调用，以apply()方法为例，如下所示

```js
  Function.prototype.apply.call(Math.ceil, null, [2.5])
  Reflect.apply(Math.ceil, null, [2.5])
```
