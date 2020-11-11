// let
(function () {
    for (var i = 0; i < 10; i++) {
        console.log(i);
    }
})()
// console.log(i); // undefined

// const
function newConst(key, value) {
    const desc = {
        writable: false,
        value
    }
    Object.defineProperty(global, key, desc);
}

newConst('constKey', 123);
console.log(constKey);
constKey = 234; // 修改无效
console.log(constKey);

// call
Function.prototype.myCall = function (context = global, ...args) {
    const fn = Symbol('fn');
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
}

global.keyForTestMyCall = 'global keyForTestMyCall';
function testMyCall() {
    console.log(this.keyForTestMyCall);
}
const obj = {
    keyForTestMyCall: 'obj keyForTestMyCall'
}
testMyCall.myCall(obj);
testMyCall.myCall();
testMyCall();

// apply
Function.prototype.myApply = function (context = global, args) {
    const fn = Symbol('fn');
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
}

function testMyApply(args) {
    console.log(this.keyForTestMyCall, args);
}
testMyApply.myApply(obj, [123]);
testMyApply.apply(obj, [123]);

// bind
Function.prototype.myBind = function (thisArg, ...args) {
    var self = this
    // new优先级
    var fbound = function () {
        self.apply(this instanceof self ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)))
    }
    // 继承原型上的属性和方法
    fbound.prototype = Object.create(self.prototype);

    return fbound;
}

function testBind(...args) {
    console.log(...args);
    console.log('test');
    console.log(this.key)
}

const bindObj = {
    key: 'bind key'
}
testBind.myBind(bindObj, 4, 5, 6)(23);
testBind.bind(bindObj, 4, 5)();

// 防抖
function debounce(func, wait) {
    let timeout = null;
    return function () {
        const context = this;
        const args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    }
}

const testDebounce = debounce((arg) => {
    console.log(arg);
}, 2000);
testDebounce(123);
testDebounce(123);
testDebounce(123);
testDebounce(123);
testDebounce(123);

// 节流
function throttle(func, wait) {
    let timeout = null;
    return function () {
        const context = this;
        const args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        }
    }
}

const testThrottle = throttle((args) => {
    console.log(args);
}, 2000);
testThrottle(1);
testThrottle(1);
testThrottle(1);
testThrottle(1);
testThrottle(1);
