## 原生篇

### 1、判断引用数据类型方法（内置 API、对象的 toString 方法、原型）
```js
  xx instanceof Type
  Object.prototype.toString.call(xx) === '[object Type]'
  xx.__proto__ === Type.prototype
  xx.constructor === Type
```

### 2、闭包
* 概念：
  在js中变量的作用域属于函数作用域, 在函数执行完后,作用域就会被清理,内存也会随之被回收,但是由于闭包函数是建立在函数内部的子函数, 由于其可访问上级作用域,即使上级函数执行完, 作用域也不会随之销毁, 这时的子函数(也就是闭包),便拥有了访问上级作用域中变量的权限,即使上级函数执行完后作用域内的值也不会被销毁
* 缺点：内存消耗很大，容易导致内存泄漏

### 3、设计模式
创建型模式(5)，工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式
结构型模式(7)，适配器模式、装饰器模式、代理模式、外观模式桥接模式、组合模式、享元模式
行为型模式(11)，策略模式、模板方法模式、观察者模式、选代子模式、責任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式

* 单例模式 （singleton 挂在window执行, 用来减少重复创建对象）
* 工厂模式（factory 用来解耦）
* 观察者模式 （observer 用来收发消息）
* 策略模式（strategy 用来定义算法）
* 发布者订阅模式（vue）
* 装饰器模式（骨架 -> 装修）
* 建造者模式（建造者模式主要用于“分步骤构建一个复杂的对象”，在这其中“分步骤”是一个稳定的算法，而复杂对象的各个部分则经常变化，其优点是：建造者模式的“加工工艺”是暴露的，这样使得建造者模式更加灵活，并且建造者模式解耦了组装过程和创建具体部件，使得我们不用去关心每个部件是如何组装的。）

### 4、栈和堆的区别
* 栈（stack） 先进后出
  由编译器自动分配和释放，存放函数的参数值、局部变量的值等。
  基本数据类型存储的地方

* 堆（heap）
  一般由程序员分配和释放，若程序员不释放，程序结束时可能由OS回收。
  堆（数据结构）可以被看成一棵树，如堆排序。
  引用数据类型存储的地方

### 5、输入 url 发生了什么
+ DNS域名解析
  客户端收到你输入的域名地址后，它首先去找本地的hosts文件，检查在该文件中是否有相应的域名、IP对应关系，如果有，则向其IP地址发送请求
  如果没有，再去找DNS服务器。
+ 建立TCP连接（三次握手）
+ 发送HTTP请求
+ 服务器处理请求
+ 返回响应结果
+ 关闭TCP连接（四次挥手）
+ 浏览器解析HTML
  浏览器通过解析HTML，生成DOM树，解析CSS，生成CSSOM树，然后通过DOM树和CSSPOM树生成渲染树。渲染树与DOM树不同，渲染树中并没有head、display为none等不必显示的节点。
+ 浏览器布局渲染
  根据渲染树布局，计算CSS样式，即每个节点在页面中的大小和位置等几何信息。HTML默认是流式布局的，CSS和js会打破这种布局，改变DOM的外观样式以及大小和位置。最后浏览器绘制各个节点，将页面展示给用户。

  replaint：屏幕的一部分重画，不影响整体布局，比如某个CSS的背景色变了，但元素的几何尺寸和位置不变。
  reflow：意味着元素的几何尺寸变了，需要重新计算渲染树。

### 6、宏任务、微任务
* 宏任务：宏任务可以被理解为每次"执行栈"中所执行的代码，而浏览器会在每次宏任务执行结束后，在下一个宏任务执行开始前，对页面进行渲染，而宏任务包括：
  * script(整体代码)
  * setTimeout
  * setInterval
  * I/O
  * UI交互事件
  * postMessage
  * MessageChannel
  * setImmediate
  * UI rendering
* 微任务,可以理解是在当前"执行栈"中的任务执行结束后立即执行的任务。而且早于页面渲染和取任务队列中的任务。微任务包括：
  * Promise.then
  * Object.observe
  * MutationObserver(监视对DOM树所做更改的能力)  
    MutationObserver是H5新增的属性，用于监听DOM修改时间，能够监听到节点的属性、文本内容、子节点等的改动，是一个功能强大的利器
  * process.nextTick

执行机制：
  + 执行一个宏任务（栈中没有就从事件队列中获取）
  + 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
  + 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
  + 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
  + 渲染完毕后，js线程继续接管，开始下一个宏任务（从事件队列中获取）

### 7、Set、Map 两种数据结构
Set 是一种叫做集合的数据结构，Map 是一种叫做字典的数据结构
集合 or 字典
  * 概念：
    + 集合：是由一堆无序的、相关联的，且不重复的内存结构[数学中称为元素]组成的组合
    + 字典：是一些元素的集合，每个元素有一个称作 key 的域，不同元素的 key 各不相同
  * 区别：
    + 共同点：集合、字典都可以存储不重复的值
    + 不同点：集合是以[值、值]的形式存储元素，字典是以[[键: 值]]的形式存储

### 8、内存泄漏
* 全局变量造成的内存泄漏
  + 未声明变量
  + 使用 this 创建的变量(this 的指向是 window)
* 闭包引起的内存泄漏
  将事件处理函数定义在外部，解除闭包 或者将定义事件处理函数在外部
* 没有清理的 DOM 元素引用
  手动删除，elements.btn = null
* 被遗忘的定时器或者是回调函数
  + 手动删除定时器和DOM
  + removeEventListener 移除事件监听

### 9、数据类型转换
* Number()
  + Number()将字符串转换为数值，要比parseInt函数严格。基本上，只要有一个字符无法转成数值，整个字符串就会被转换成NaN。但是，parseInt可以处理字符串截取和数值进制问题
  + 参数为对象类型：
    - 调用对象自身的valueOf方法，如果返回原始类型的值，则直接对该值使用Number函数，不再进行后续步骤
    - 如果valueOf方法返回的还是对象，则改为调用对象自身的toString方法。如果toString方法返回原始类型的值，则对改值使用Nubmer函数，不再进行后续步骤
    - 如果toString方法返回的是对象，报错  
* String()
  + 当String()的参数为原始数据类型时：
    * 数值：转为对应的字符串
    * 字符串：转换后还是原来的值
    * 布尔值：true 转为字符串的'true'，false对应
    * undefined：转化为字符串 'undefined'
    * null：转化为字符串 'null'
  + 参数为对象类型：
    - 先调用对象自身的toString方法。如果返回原始类型的值，则对该值使用String函数，不再进行以下步骤
    - 如果 toString 方法返回的是对象，再调用原对象的valueOf方法。如果valueOf方法返回原始类型的值，则对该值使用String函数。不再进行以下步骤
    - 如果valueOf方法返回的是对象，报错
* Boolean()
  在Boolean类型转换时，虚值(falsey)，虚值主要有以下几种：
    * undefined
    * null
    * 0 +0 -0
    * NaN
    * false
    * ''

### 10、正则表达式
* 从字符出发
  + 单个字符
    - 换行符 /n(hew line)
    - 回车符 /r(return)
    - 空白符 /s(space)
    - 制表符 /t(tab)
    - 换页符号 /f(form feed)
    - 垂直制表符 /v(vertical tab)
    - 回退符 [\b](backspace 避免和/b重复)
  + 多个字符
    - 除了换行符之外的任何字符 .
    - 单个数字[0-9] /d(digit)
    - 除了[0-9] /D(not digit)
    - 字母或数字或下划线或汉字[A-Za-z0-9_] /w(word)
    - 非单字字符 /W(not word)
    - 匹配空白字符，包括空格、制表符、换页符和换行符 /s(space)
    - 匹配非空白字符 /S(not space)
* 循环和重复
  + 元字符`*`用来表示匹配0个或无数个字符。通常用来过滤某些可有可以无的字符串
  + 元字符`+`适用于要匹配同个字符出现1次或者多次的情况
  + 特定次数
    ```js
      {x}: x次
      {min, max}: min-max
      {min, }: 至少min次
      {0, max}: 至多max次
    ```
* 位置边界
  + 单词边界
    ```
      The cat scattered his food all over the room
    ```
    我想找到cat这个单词，但是如果只是使用/cat/这个正则，就会同时匹配到cat和scattered这两处文本。
    这时候我们就需要使用边界正则表达式\b
    ```js
      /\bcat\b/
    ```
  + 字符串边界
    - 单词边界 \b(boundary)
    - 非单词边界 \B(not boundary)
    - 字符串开头 ^
    - 字符串结尾 $
    - 多行模式 m标志(multiple of lines)
    - 忽略大小写 i标志(ignore case, case-insensitive)
    - 全局模式 g标志(global)
* 子表达式
  通过嵌套递归和自身引用可以让正则发挥更强大的功能。  
  从简单到复杂的正则表达式演变通常要采用分组、回溯引用和逻辑处理的思想
  + 分组
    其中分组体现在：所有以`(`和`)`元字符所包含的正则表达式被分为一组，每一个分组都是一个子表达式，它也是构成高级正则的基础
  + 回溯引用
    - 引用 \0, \1, \2 和 $0, $1, $2
    - 非捕获组 (?:) 引用表达式(()), 本身不被消费(?), 引用(:)
    - 前向查找 (?=) 引用子表达式(()), 本身不被消费(?), 正向的查找(=)
    - 前向负查找 (?!) 引用子表达式(()), 本身不被消费(?), 负向的查找(!)
    - 反向查找 (?<=) 引用子表达式(()), 本身不被消费(?), 反向的(<，开口往后)，正的查找(=)
    - 反向查找 (?<!) 引用子表达式(()), 本身不被消费(?), 反向的(<，开口往后)，负的查找(!)
  + 逻辑处理
   - 非 [^regex] 和 !
   - 或 |

### 11、事件流
事件流分为两种，捕获事件流和冒泡事件流
  * 捕获事件流从根节点开始执行，一直往子节点查找执行，直到查找执行到目标节点
  * 冒泡事件流从目标节点开始执行，一直往父节点冒泡查找执行，直到查到根节点
DOM事件流分为三个阶段，一个是捕获阶段，一个是处于目标节点节点，一个是冒泡阶段

### 12、ES5的new实例和ES6的class的new实例有什么区别
* ES5里的构造函数就是一个普通函数，可以使用new调用也可以直接调用
* ES5的原型对象和静态方法默认是可枚举的，而class的默认不可枚举，如果想要获取不可枚举的属性可以使用`Object.getownPropertyNames`方法
* 子类可以直接通过__proto__找到父类，而ES5是指向Function.prototype
* ES5的继承，实质是先创造子类的实例对象this，然后再执行父类的构造函数给它添加实例方法和属性(不执行也无所谓)；ES6，实质是先创建父类的实例对象this(当然它的__proto__指向的是子类的prototype)，然后再用子类的构造函数修改this
* class不存在变量提升，所以父类必须在子类之前定义

### 13、装箱和拆箱
* 装箱：把基本数据类型转换为对应的引用数据类型的操作
```js
  const s1 = 'Sunshine_lin'
  const index = s1.indexOf('_')
```
原来是js内部进行了装箱操作：
  + 创建String类型的一个实例
  + 在实例上调用指定的方法
  + 销毁这个实例
* 拆箱：将引用数据类型转换为对应的基本类型的操作  
通过valueOf或者toString方法实现拆箱操作

### 14、继承方式有几种
```js
  // 前置工作
  // 定义一个动物类
  function Animal (name) {
    // 属性
    this.name = name || 'Animal'
    // 实例方法
    this.sleep = function(){
      console.log(this.name + '正在睡觉！')
    }
  }
  // 原型方法
  Animal.prototype.eat = function(food) {
    console.log(this.name + '正在吃：' + food)
  }
```
* 原型链继承(将父类的实例作为子类的原型)
  ```js
    function Cat (){ }
    Cat.prototype = new Animal()
    Cat.prototype.name = 'cat'

    const cat = new Cat('cat')
    console.log(cat.name) // cat
    cat.eat('fish') // cat正在吃：fish
    cat.sleep() // cat正在睡觉
    console.log(cat instanceof Animal) // true
    console.log(cat instanceof Cat) // true
  ```
  + 优点：
    - 非常纯粹的继承关系，实例是子类的实例，也是父类的实例
    - 父类新增原型方法/属性，子类都能访问到
    - 简单，易于实现
  + 缺点：
    - 要想为子类新增属性和方法，必须要在new Animal()这样的语句之后执行，不能放到构造器中
    - 来自原型对象的所有属性被所有实例共享
    - 创建子实例时，无法向父类构造函数传参
    - 不支持多继承
* 构造继承(使用父类的构造器来增强子类实例，等于是复制父类的属性给子类。没用到原型)
  ```js
    function Cat(name) {
      Animal.call(this)
      this.name = name || 'Tom'
    }

    var cat = new Cat()
    console.log(cat.name) // Tom
    cat.sleep() // Tom正在睡觉！
    console.log(cat instanceof Animal) // false
    console.log(cat instanceof Cat) // true
  ```
  + 优点：
    - 解决了原型链继承中，子类实例共享父类引用属性的问题
    - 创建子类实例时，可以向父类传递参数
    - 可以实现多继承(call多个父类对象)缺点
  + 缺点：
    - 实例并不是父类的实例，只是子类的实例
    - 是能继承父类的实例属性和方法，不能继承原型属性、方法
    - 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能
* 实例继承(为父类实例添加新特性，作为子类实例返回)
  ```js
    function Cat(name) {
      const instance = new Animal()
      instance.name = name || 'Tom'
      return instance
    }

    var cat = new Cat()
    console.log(cat.name) // Tom
    cat.sleep() // Tom正在睡觉！
    console.log(cat instanceof Animal) // true
    console.log(cat instanceof Cat) // false
  ```
  + 优点：
    - 不限制调用的方式，不管是new 子类()还是子类()，返回的对象具有相同的效果
  + 缺点：
    - 实例是父类的实例，不是子类的实例
    - 不支持多继承
* 拷贝继承(一个一个属性拷贝)
  ```js
    function Cat(name) {
      const animal = new Animal()
      for (let k of animal) {
        Cat.prototype[k] = animal[k]
      }
      this.name = name || 'Tom'
    }

    var cat = new Cat()
    console.log(cat.name) // Tom
    cat.sleep() // Tom正在睡觉！
    console.log(cat instanceof Animal) // false
    console.log(cat instanceof Cat) // true
  ```
  + 优点：
    - 支持多继承
  + 缺点：
    - 效率低，内存占用高(因为要拷贝父类的属性)
    - 无法获取父类不可枚举方法(不可枚举方法，不能用for in访问到)
* 组合继承(通过父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用)
  ```js
    function Cat(name) {
      Animal.call(this)
      this.name = name || 'Tom'
    }

    Cat.prototype = new Animal()
    Cat.prototype.constructor = Cat

    var cat = new Cat()
    console.log(cat.name) // Tom
    cat.sleep() // Tom正在睡觉！
    console.log(cat instanceof Animal) // true
    console.log(cat instanceof Cat) // true
  ```
  + 优点：
    - 弥补了构造继承的缺陷，可以继承实例属性/方法，也可以继承原型属性/方法
    - 即使子类的实例，也是父类的实例
    - 不存在引用属性共享问题
    - 可传参
    - 函数可复用
  + 缺点：
    - 调用了两次父类构造函数，生成了两份实例(子类实例将子类原型上的那份屏蔽了)
* 寄生组合继承(通过寄生方式，砍掉父类的实例属性。这样，在调用两次父类的构造时，就不会初始化两次实例方法/属性，避免继承组合的缺点)
  ```js
    function Cat(name) {
      Animal.call(this)
      this.name = name || 'Tom'
    }

    // 创建一个没有实例方法的类
    const Super = function () {}
    Super.prototype = Animal.prototype
    Cat.prototype = new Super()

    var cat = new Cat()
    console.log(cat.name) // Tom
    cat.sleep() // Tom正在睡觉！
    console.log(cat instanceof Animal) // true
    console.log(cat instanceof Cat) // true
  ```
  + 优点：
    - 堪称完美
  + 缺点：
    - 实现复杂