const target = {
    a: 123
};

const handler = {
    get() {
        console.log('this is get proxy');
        return Reflect.get(...arguments)
    },
    set() {
        console.log('this is set proxy');
        return Reflect.set(...arguments);
    }
};

const proxy = new Proxy(target, handler);

// console.log(proxy.a, proxy, proxy.b);
console.log(proxy.__proto__); //
console.log(Proxy.prototype); // Proxy 原型指向null，所以instance of 不能用
proxy.b = 123;
console.log(proxy.b);
console.log(target.b);
