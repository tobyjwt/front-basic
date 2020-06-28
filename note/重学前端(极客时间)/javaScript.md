## 闭包和执行上下文
原文链接 https://time.geekbang.org/column/article/83302?utm_source=pinpaizhuanqu&utm_medium=geektime&utm_campaign=guanwang&utm_term=guanwang&utm_content=0511

闭包其实只是一个绑定了执行环境的函数，这个函数并不是印在书本里的一条简单的表达式，闭包与普通函数的区别是，它携带了执行的环境

按winter到解释，js中function其实就是古典到闭包定义，在js标准中并没有闭包的定义，js钟对应闭包的组成部分为:
* 环境部分
    * 环境: 函数的词法环境(执行上下文的一部分)
    * 标示符列表: 函数钟用到的未声明的变量
* 表达式部分: 函数体

### var声明与赋值
早期没有let，由于var 声明作用域函数执行的作用域， 即var会穿透for、if等语句，用立即执行函数来控制var的范围，语法规定了 function 关键字开头是函数声明，所以要想让函数变成函数表达式，最常见的做法是加括号
```javascript
;(function() {
    var a = 1;
})();
```
如果上一行行末没加`;`，上文首行的括号会被当成上一行行末的函数来调用，所以这里在最开始的地方加了一个`;`。

还有一种写法是
```javascript
void function() {
    var a = 1;
}()
```
语义上 void 运算表示忽略后面表达式的值，变成 undefined

### let
let 出现前，if for等语句不产生块级作用域，有了let后，在下面几个语句钟会产生块级作用域
* if
* for
* switch
* tyr\catch\finaly

### Realm
新标准的新概念，对于不同Realm中对象的一些操作，比如 instanceOf等，是不太准确的，例如
```
...iframe 1
var instance1 = new Array();
...
...iframe 2
iframe1.contentWindow.instance1 instanceOf Array // false
```
红宝书上也有提到这个，但是原因说的不是特别清楚，猜测是和instanceOf的实现方式有关(原型链)，因为在不同的window的对象中，一直向上查找应该是两个不同的内置对象，解决方案是用`Object.prototype.toString`来判断

## 函数
### 定义方式
#### 1.普通函数：用 function 关键字定义的函数
```
function foo() {
    // code
}
```
#### 2.箭头函数：用=>运算符定义
```
const foo = () => {
    // code
}
```
#### 3.方法：在class中定义的函数
```
class C {
    foo() {
        // code
    }
}
```
#### 4.生成器函数：用function * 定义的函数
```
function* foo() {
    // code
}
```
#### 5.类：用class定义的类，实际上也是函数
```
class Foo {
    constructor(){
        //code
    }
}
```
#### 异步函数：普通函数、箭头函数和生成器函数加上async关键字
```

async function foo(){
    // code
}
const foo = async () => {
    // code
}
async function foo*(){
    // code
}
```
### this
调用函数时使用的引用，决定了函数执行时刻的 this 值。
```

function showThis(){
    console.log(this);
}

var o = {
    showThis: showThis
}

showThis(); // global
o.showThis(); // o
```
获取函数表达式，实际上返回的不是它本身，而是一个Reference类型，reference类型由一个对象和一个属性值组成

## 语句
