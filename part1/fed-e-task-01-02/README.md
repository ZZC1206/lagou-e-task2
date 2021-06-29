# Part1-2 作业

( 请在当前文件直接作答 )

## 简答题

### 1. 请说出下列最终执行结果，并解释为什么?

```javascript
var a = []
for (var i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i)
    }
}
a[6]()
```

控制台打印：10，原因分析：
执行顺序如下

1. 声明一个空数组 a；
2. 执行 10 次 for 循环，向 a 数组中保存 10 个匿名函数元素。当循环结束以后，全局执行上下文里面 i 的值已经变为 10 了；
3. 执行 a 数组中第 7 个匿名函数元素，因为会使用到 i 变量，这时候在 fn7 匿名函数的作用域链中私有执行上下文找不到 i 变量，就会上一个执行上下文找，上一个执行上下文是全局执行上下文，全局执行上下文有变量 i，即 i = 10;所以打印的结果是 10（这里无论调用数组中的哪一个，打印结果都是 10）。

可以进一步修改：

1. 闭包

```javascript
var a = []
for (var i = 0; i < 10; i++) {
    ;(function (i) {
        a[i] = function () {
            console.log(i)
        }
    })(i)
}
a[6]() // 6
```

2.使用 let

```javascript
var a = []
for (let i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i)
    }
}
a[6]() // 6
```

### 2. 请说出此案列最终执行结果，并解释为什么?

```javascript
var tmp = 123
if (true) {
    console.log(tmp)
    let tmp
}
```

报错： Uncaught ReferenceError: Cannot access 'tmp' before initialization

原因：使用 let 声明变量，会产生块级作用域，而且 let 声明变量不会提升，只能声明后再使用，否则会报错。

### 3. 结合 ES6 语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4]
Math.min(...arr)
// 补充
arr.sort((a, b) => a-b)[0]
arr.reduce((min,num)=>min<num?min:num)
```

### 4. 请详细说明 var、let、const 三种声明变量的方式之间的具体差别

在 ES6 出现之前在 JavaScript 中声明变量都是用 var 来声明；在 ES6 出现之后，一般会是用 let 代替 var 来进行变量的声明，使用 const 来进行常量的声明。

|                         | var | let | const |
| :---------------------: | :-: | :-: | :---: |
|        重复声明         |  Y  |     |       |
|        变量提升         |  Y  |     |       |
|       暂时性死区        |     |  Y  |   Y   |
| window 对象的属性和方法 |  Y  |     |       |
|       块级作用域        |     |  Y  |   Y   |
|      定义后可修改       |  Y  |  Y  |       |

##### 1. 重复声明

```js
/* var */
var a = 123
var a = 321
console.log(a) // 打印结果: 321 新的会覆盖旧的

/* let */
let b = 123
let b = 321
console.log(b) // 报错：Uncaught SyntaxError: Identifier 'b' has already been declared

/* const */
const c = 123
const c = 321
console.log(c) // 报错：Uncaught SyntaxError: Identifier 'c' has already been declared
```

-   总结 1：在同一个块级作用域下，var 可以重复声明同一个变量，但 let 和 const 不能。

##### 2. 变量 提升（hoisting）

```js
/* var */
console.log(a) // 打印结果: undefined
var a = 123

// 逻辑上等于
var a
console.log(a) //undefined
a = 123

/* let */
console.log(b) // 报错：Uncaught ReferenceError: Cannot access 'b' before initialization
let b = 123

/* const */
console.log(c) // 报错：Uncaught ReferenceError: Cannot access 'c' before initialization
const c = 123
```

-   总结 2：变量提升是指无论 var 出现在一个作用域的哪个位置，这个声明都属于当前的整个作用域，在当前的整个作用域中任何地方都可以访问得到这个变量 。注意只有变量声明才会提升，但变量赋值并不会提升。let 和 const 不存在变量提升。

##### 3. 暂时性死区（临时死区 Temporal Dead Zone，简写为 TDZ）

```js
/* var */
var a = 1
console.log(a) // 1
console.log(b) // undefined
var b = 2

/* let */
let a = 1
console.log(a) // 1
console.log(b) // 报错：Uncaught ReferenceError: Cannot access 'b' before initialization
let b = 2

/* const */
const a = 1
console.log(a) // 1
console.log(b) // 报错：Uncaught ReferenceError: Cannot access 'b' before initialization
const b = 2

var a = 123
{
    console.log(a) // U123
    var a = 312
}

let a = 123
{
    console.log(a) // Uncaught ReferenceError: Cannot access 'a' before initialization
    let a = 312
}
```

-   总结 3：暂时性死区和变量提升有点相类似，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量或常量，一开始就形成一个作用域。let 和 const 的变量不能在声明之前被使用，var 可以。暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码被执行过后，才可以获取和使用该变量，也就是先声明，再使用。

##### 4. window 对象的属性和方法（全局作用域中）

```js
var a = 123
console.log(window.a) // 123
function fn() {
    console.log('function')
}
window.fn() // function
console.log(window.fn === fn) // true

let b = 123
console.log(window.b) // undefined
let c = fn
console.log(window.c === fn) // false
```

-   总结 4：在全局作用域中，var 声明的变量和通过 function 声明的函数，会自动变成 window 对象的属性或方法，但是 let 和 const 不会。

##### 5. 块级作用域

```js
/* var */
for (var i = 0; i < 3; i++) {
    console.log(i) // 1 2 3
}
console.log(i) // 3

/* let */
for (let i = 0; i < 3; i++) {
    console.log(i) // 1 2 3
}
console.log(i) // 报错：Uncaught ReferenceError: i is not defined

/* const */
if (true) {
    var a = 'asd'
    const c = 'zxc'
}
console.log(a) // asd
console.log(c) // Uncaught ReferenceError: c is not defined

/* 这里涉及相关的只是点 */
// 作用域链：内层作用域 --> 外层作用域 --> ... --> 全局作用域

// 作用域有三种：全局作用域、块级作用域、函数作用域

// 块级作用域有哪些：
// {}
// for(){}
// while(){}
// do{}while()
// if(){}
// switch(){}

// 函数作用域:
// function(){}

// let animal={} 这里对象的{}，不构成作用域的
```

-   总结 5：let 和 const 的声明会形成块级作用域，var 不会。

##### 6. 定义变量后可修改

```js
/* 简单数据类型 */
var a = 111
a = 999
console.log(a) // 999

let b = 222
b = 888
console.log(b) // 888

const c = 333
c = 777
console.log(c) // 报错：Uncaught TypeError: Assignment to constant variable.

/* 复合数据类型 */
const animal = {}
animal.dog = '二哈'
animal.cat = '大橘'
console.log(animal) // {dog: "二哈", cat: "大橘"}
animal = { bird: '鹦鹉' } // 报错：Uncaught TypeError: Assignment to constant variable.

const arr = ['foo', 'asd']
arr.push('zxc')
arr[3] = '123'
arr.shift('asd')
console.log(arr) // ["asd", "zxc", "123"]
```

-   总结 6：var、let 定义变量之后可以修改，而 const 表面上像是声明一个“常量”。const 并不是保证变量的值不得改动，而是指变量指向的内存地址不得改变。对于简单数据类型（Number、String、Boolean），值就保存在变量指向的内存地址，因此等同于常量；而对于复合数据类型（主要是对象和数组），变量只是保存了指向堆内存的地址，至于堆内的数据是不是可变的，就不能控制了。

### 5. 请说出下列代码最终输出结果，并解释为什么？

```javascript
var a = 10
var obj = {
    a: 20,
    fn() {
        setTimeout(() => {
            console.log(this.a)
        })
    },
}
obj.fn()
```

结果：控制台打印 20

-   this 是在执行上下文创建时确定的一个在执行过程中不可更改的变量。
-   this 只在函数调用阶段确定，也就是执行上下文创建的阶段进行赋值，保存在变量对象中。

这里执行 obj.fn()，即 obj 调用的 fn 函数，所以 this 指向 obj ；在箭头函数中的 this 指向声明时所在的执行上下文，这里是 obj，this.a 为 obj.a

```js
var asd = obj.fn
asd()
```

结果：控制台打印 10

### 6. 简述 Symbol 类型的用途

Symbol 是 ES6 中引入的一种新的基本数据类型，用于表示一个独一无二的值。它是 JavaScript 中的第七种数据类型，与 undefined、null、Number（数值）、String（字符串）、Boolean（布尔值）、Object（对象）并列。

1. 由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

```js
let s1 = Symbol()
let s2 = Symbol()
const obj = {
    age: 16,
    age: 19,
    [s1]: 'Hello!',
    [s2]: 'world',
}
console.log(obj) // {age: 19, Symbol(): "Hello!", Symbol(): "world"}
```

2. 常用内置的 Symbol 值：Symbol.iterator。对象的 Symbol.iterator 属性，指向该对象的默认遍历器方法 ，凡是具有[Symbol.iterator]方法的对象都是可遍历的，可以使用 for … of 循环依次输出对象的每个属性

```js
for (var item of [1, 2, 3]) {
    console.log(item) //依次输出 1，2，3
}
```

3. Symbol 数据类型的另一特点是隐藏性，for···in，object.keys() 不能访问。不需要对外操作和访问的属性使用 Symbol 来定义，实现让“对内操作”和“对外选择性输出”。

```js
let id = Symbol('id')
let obj = {
    [id]: 'symbol',
}
for (let option in obj) {
    console.log(obj[option]) // 没东西打印
}

// 使用 Symbol 作为对象属性时，需要使用方括号语法去访问对应的属性，而不是字符串。
console.log(obj[id]) // symbol
console.log(Object.getOwnPropertySymbols(obj)) // [Symbol(id)]
// 使用新增的反射API
console.log(Reflect.ownKeys(obj)) // [Symbol(id)]
```

### 7. 说说什么是浅拷贝，什么是深拷贝？

-   浅拷贝：不考虑对象的引用类型的属性，只对当前对象的所有成员进行拷贝，克隆的项会“藕断丝连”。

```js
let arr1 = [1, 2, [3, 4]]
// = 赋值操作是不能实现浅克隆的，只是指向内存中相同的地址
let arr2 = arr1
console.log('= 赋值：', arr1 === arr2) // = 赋值： true

let copyArr = []
for (let i = 0; i < arr1.length; i++) {
    copyArr.push(arr1[i])
}

console.log(arr1) // arr1： [1,2,[3,4]]
console.log(copyArr) // copyArr： [1,2,[3,4]]
console.log('浅克隆：', arr1 === copyArr) // 浅克隆： false

arr1.push(5)
console.log(arr1) // arr1： [1,2,[3,4],5]
console.log(copyArr) // copyArr： [1,2,[3,4]]

arr1[2].push(6)
console.log(arr1) // arr1： [1,2,[3,4,6]]
console.log(copyArr) // copyArr： [1,2,[3,4,6]]
console.log('浅克隆：', arr1[2] === copyArr[2]) // 浅克隆： true
```

-   深拷贝：在拷贝的时候，需要把当前要拷贝的对象内所有引用类型的属性进行完整的拷贝，即拷贝出来的对象和原对象之间没有任何数据是共享的，所有的东西都是自己独占的一份。

```js
let arr = [1, 2, [3, 4]]

function deepClone(o) {
    // 要判断o是对象还是数组
    if (Array.isArray(o)) {
        // 数组
        var result = []
        for (var i = 0; i < o.length; i++) {
            result.push(deepClone(o[i]))
        }
    } else if (typeof o == 'object') {
        // 对象
        var result = {}
        for (var k in o) {
            result[k] = deepClone(o[k])
        }
    } else {
        // 基本类型值
        var result = o
    }
    return result
}

let copyArr = deepClone(arr)

console.log('arr', JSON.stringify(arr)) // arr [1,2,[3,4]]
console.log('copyArr：', JSON.stringify(copyArr)) // copyArr： [1,2,[3,4]]
console.log('深克隆：', arr === copyArr) // 深克隆： false
console.log('深克隆的arr[2]：', arr[2] === copyArr[2]) // 深克隆的arr[2]： false
```

### 8. 请简述 TypeScript 与 JavaScript 之间的关系？

-   JavaScript（通常简写为 JS）是一种轻量的、解释性的、面向对象的头等函数语言，其最广为人知的应用是作为网页的脚本语言，但同时它也在很多非浏览器环境下使用。JS 是一种动态的基于原型和多范式的脚本语言，支持面向对象、命令式和函数式的编程风格。
-   TypeScript 是一种由微软开发的自由和开源的编程语言。它是 JavaScript 的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。

### 9. 请谈谈你所认为的 typescript 优缺点

TypeScript 相比于 JavaScript 的优点

1. 静态输入
   静态类型化是一种功能，可以在开发人员编写脚本时检测错误。查找并修复错误是当今开发团队的迫切需求。有了这项功能，就会允许开发人员编写更健壮的代码并对其进行维护，以便使得代码质量更好、更清晰。

2. 大型的开发项目
   有时为了改进开发项目，需要对代码库进行小的增量更改。这些小小的变化可能会产生严重的、意想不到的后果，因此有必要撤销这些变化。使用 TypeScript 工具来进行重构更变的容易、快捷。

3. 更好的协作
   当发开大型项目时，会有许多开发人员，此时乱码和错误的机也会增加。类型安全是一种在编码期间检测错误的功能，而不是在编译项目时检测错误。这为开发团队创建了一个更高效的编码和调试过程。

4. 更强的生产力
   干净的 ECMAScript 6 代码，自动完成和动态输入等因素有助于提高开发人员的工作效率。这些功能也有助于编译器创建优化的代码。

TypeScript 相比于 JavaScript 的缺点

1. 有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等前端工程师可能不是很熟悉的概念

2. 短期可能会增加一些开发成本，毕竟要多写一些类型的定义，不过对于一个需要长期维护的项目，TypeScript 能够减少其维护成本

3. 集成到构建流程需要一些工作量

### 10. 描述引用计数的工作原理和优缺点

引用计数法（Reference Counting）比较简单，对每一个对象保存一个整型的引用计数器属性。用于记录对象被引用的情况。

对于一个对象 A，只要有任何一个对象引用了 A，则 A 的引用计数器就加 1；当引用失效时，引用计数器就减 1。只要对象的引用计数器的值为 0，即表示对象 A 不能在被使用，可进行回收。

优点：实现简单，垃圾对象便于辨识；判定效率高，回收没有延迟性。

缺点：
（1）他需要单独的字段存储计数器，这样的做法增加了存储空间的开销。

（2）每次赋值都需要更新计数器，伴随着加法和减法操作，这增加了时间开销。

### 11. 描述标记整理算法的工作流程

“标记-清除”算法，分为“标记”和“清除”两个阶段：首先标记出所有需要回收的对象，在标记完成后统一回收掉所有被标记的对象。它主要由两个缺点：一个是效率问题，标记和清除过程的效率都不高；另一个是空间问题，标记清除之后会产生大量不连续的内存碎片，空间碎片太多可能会导致当程序在以后的运行过程中需要分配较大对象时无法找到足够的连续内存而不得不提前触发另一次垃圾收集动作。

标记整理算法（Mark Compact），和标记清除类似，也有相同的标记过程，不过回收时并不是直接清除，也分两个阶段 “标记”阶段和“整理”阶段。整理阶段：移动存活对象，让存活的对象都向一端移动，同时更新存活对象中所有指向被移动对象的指针，然后将所有没有标记的对象地址连续起来，避免产生碎片化空间，然后清除这些没有标记的对象，回收相应的空间。

### 12.描述 V8 中新生代存储区垃圾回收的流程

-   新生代指存活时间较短的对象，例如：一个局部作用域中，只要函数执行完毕之后变量就会回收。

新生代内存区分为两个等大小空间，使用空间为 From，空闲空间为 To。

如果需要申请空间使用，回收步骤如下：
主要采用复制算法 + 标记整理算法

1. 首先会将所有活动对象存储于 From 空间，这个过程中 To 是空闲状态。
2. 当 From 空间使用到一定程度之后就会触发 GC 操作，这个时候会进行标记整理对活动对象进行标记并移动位置将使用空间变得连续，便于后续不会产生碎片化空间。
3. 将活动对象拷贝至 To 空间，拷贝完成之后活动空间就有了备份，这个时候就可以考虑回收操作了。
4. 把 From 空间完成释放，回收完成
5. 对 From 和 To 名称进行调换，继续重复之前的操作。

注：To 的使用率是有限制的，回收操作是要把 From 空间的内容拷贝到 To 空间中进行交换，如果 To 的使用率太高，变成 From 之后新的较大对象可能就存不进去了。

### 13. 描述增量标记算法在何时使用及工作原理

-   老生代指存活时间较长的对象，例如：全局对象，闭包变量数据。
    新生代内存区分为两个等大小空间，使用空间为 From，空闲空间为 To。

回收老生代对象主要采用标记清除、标记整理、增量标记算法

先使用标记清除完成垃圾回收，再采用标记整理优化空间，为了降低老生代的垃圾回收而造成的卡顿，V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成。
