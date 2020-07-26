# 浅谈柯里化函数和它的应用
## 什么是柯里化函数
函数柯里化其实是闭包应用的一个很好的例子，通俗的解释就是通过闭包创建一个函数，这个函数已经被设置好了部分参数，如果调用这个函数，还需要给这个函数传入一些参数，用一个加法函数的例子来说明
```javascript
function add(a, b) {
  return a + b;
}

add(1, 2); // 3
```
这是一个普通的函数，如果把它柯里化，那么是这样的
```javascript
function curryAdd(b) {
  return add(10 + b);
}
curryAdd(7); // 17
```
这里仅仅是展示柯里化函数的概念，严格来说并非是柯里化函数，它实际上是一个第一个参数永远为10的add函数版本。

那么，真正的柯里化函数是什么样子的呢？ 它一般是动态创建的，调用另一个函数并为它传入要柯里化的函数和必要参数，同样用例子来说明:
```javascript
function curry(fn) {
  const outerArgs = Array.prototype.slice.call(arguments, 1); // arguments 是伪数组，没有slice方法
  return function() {
    const innerArgs = Array.prototype.slice.call(arguments);
    const args = outerArgs.concat(innerArgs);
    return fn.apply(null, args);
  }
}
```
curry()主要做了什么呢？它首先通过 `slice` 方法用 `outerArgs` 接收第1个之后的参数，然后在内部函数中也是通过 `slice` 方法用 `innerArgs` 接收了内部函数的参数，这里使用 `slice` 的目的就是为了将 `arguments` 转化为数组，便于截取和重新组装； 之后就将 `outerArgs` 和 `innerArgs` 拼装起来用 `args` 存放，最后在内部函数中调用传进来的 `fn` 函数，并通过 `apply` 将 `args` 注入，这里不考虑函数的执行环境。

用上面的add方法来验证下动态创建柯里化函数
```javascript
const newCurryAdd = curry(add, 10);
newCurryAdd(7); // 17
```
也可以创建时就讲参数全部指定好
```javascript
const newCurryAdd = curry(add, 10, 7);
newCurryAdd(); // 17
```

## 应用
关于柯里化函数的应用，可以尝试用它来实现bind函数，上文也提到，实现的 `curry()` 并没有考虑上下文，把上下文考虑进去，就是一个bind函数了
```javascript
function bind(fn, ctx) {
  const outerArgs = Array.prototype.slice.call(arguments, 2); // arguments 是伪数组，没有slice方法
  return function() {
    const innerArgs = Array.prototype.slice.call(arguments);
    const args = outerArgs.concat(innerArgs);
    return fn.apply(ctx, args);
  }
}
```
注意这里和 `curry()` 的区别，在调用时需要多传入一个上下文参数 `ctx`，在使用 `outerArgs` 接收的时候， `slice` 的参数由 `1` 变成了 `2`，最后通过 `apply` 将 `ctx` 执行环境注入进去。

注意这里的bind函数并不是模拟es5中 `Function` 原型链里的 `bind` 实现，如果对这部分有兴趣可以单独找些文章来看看。

## 写在最后
之前在面试的时候，柯里化函数被问住了，所以重新去找了相关的资料来看；常听大佬说，证明你理解这个知识点最好的方式是把它向别人说明白，所以就有了这篇文章，今后争取养成习惯，把新学习到的碎片知识点都用文章总结出来。

如有错误，还请指正!
