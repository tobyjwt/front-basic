function myNew(foo, ...args) {
    // 创建新对象，挂在foo的原型链上
    const obj = Object.create(foo.prototype);
    // 执行构造函数
    const result = foo.apply(obj, args);
    return Object.prototype.call(result) === '[object Object]' ? result : obj;
}
