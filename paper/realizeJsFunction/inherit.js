// 原型链继承

function Parent() {
    this.famailyName = 'prototype line inherit';
    this.testArray = [1, 2, 3];
}

function Child() {

}

Child.prototype = new Parent();
Child.prototype.constructor = Child; // 原型链规则，构造函数原型对象上的constructor指向它本身

const child = new Child();
const child2 = new Child();
console.log(child.famailyName, child.testArray); // 'prototype line inherit', [1, 2, 3]
console.log(child2.famailyName, child2.testArray); // 'prototype line inherit', [1, 2, 3]
child.famailyName = 'hack 123';
child.testArray[1] = 'hack 123';
console.log(child.famailyName, child.testArray); // 'hack 123',  [1, 'hack 123', 3]
console.log(child2.famailyName, child2.testArray); // 'prototype line inherit', [1, 'hack 123', 3]
// 可以继承父类的属性和方法

// 原型链继承的缺点
// 所有的child对象都指向一个父类的实例，如果在Child对象上修改某个父类引用类型变量，会影响所有的child 对象
// 创建子类实例时无法向父类构造函数传参，即没有super()功能


// 构造函数继承
function Parent2() {
    this.name = ['parent2'];
}

Parent2.prototype.getName = function() {
    return this.name;
}

function Child2() {
    Parent2.call(this, '123')
}

const child20 = new Child2();
const child21 = new Child2();
child20.name[1] = 123;
console.log(child20.name); // ['parent2', 123]
console.log(child21.name); // ['parent2']
// console.log(child20.getName()); // 报错，找不到getName方法

// 构造函数继承可以解决原型链继承的一些问题，避免实例之间恭喜一个原型实例，也可以实现传参
// 构造函数继承不能继承原型链上的属性与方法

// 组合式继承
function Parent3() {
    this.name = ['parent3'];
}

Parent3.prototype.getName = function () {
    return this.name;
}

function Child3() {
    Parent3.call(this, 'child 3');
}

Child3.prototype = new Parent3();
Child3.prototype.constructor = Child3;

// 缺点，每次新建Child实例都需要调用两次父类的构造函数 Parent3.call() 和 new Parent3()

// 寄生式继承， babel 处理 es6 继承的方式
function Parent4() {
    this.name = ['parent4'];
}

Parent4.prototype.getName = function () {
    return this.name;
}

function Child4() {
    Parent3.call(this, 'child 4');
}

// Child4.prototype = new Parent4();
Child4.prototype = Object.create(Parent4.prototype);
Child4.prototype.constructor = Child4;
