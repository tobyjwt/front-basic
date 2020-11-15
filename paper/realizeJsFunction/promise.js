class MyPromise {
    constructor(executor) {
        this._resolveQueue = [];
        this._rejectQueue = [];

        const resolve = (val) => {
            while (this._resolveQueue.length) {
                const func = this._resolveQueue.shift();
                func(val);
            }
        }

        const reject = (val) => {
            while (this._rejectQueue.length) {
                const func = this._rejectQueue.shift();
                func(val);
            }
        }

        executor(resolve, reject);
    }

    then(resolveFunc, rejectFunc) {
        if (resolveFunc) {
            this._resolveQueue.push(resolveFunc);
        }
        if (rejectFunc) {
            this._rejectQueue.push(rejectFunc);
        }
    }
}

const demo = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve();
    }, 2000);
});
demo.then(() => {
    console.log('finish');
})
