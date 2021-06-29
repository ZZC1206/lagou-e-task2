/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

// 第一阶段：实现promise 基本逻辑
/*
 * 原Promise实例：
    let promise = new Promise((resolve, reject) => {
        resolve('成功')
        reject('失败')
    });
    promise.then(value => console.log(value), reason => console.log(reason))
 *分析：
    1.Promise是一个类，可以使用 new 来调用 Promise 的构造器来进行实例化

    2.在执行这个类的时候，需要传递一个带有 resolve（解析）和 reject（拒绝）两个参数的执行器进去，执行器会立即执行

    3.在 Promise 中有三种状态，分别为
        等待 pending
        成功 fulfilled
        失败 rejected

    4.resolve 和 reject 函数是用来更改状态的(状态一旦确定，就不能更改)
        resolve：pending(等待) ---> fulfilled(成功)
        reject：pending(等待) ---> rejected(失败)
        
    5.then 方法内部做的事情就是判断状态,then 方法是被定义在原型变量中的。
        如果状态是成功,调用成功回调函数
        如果状态是失败,调用失败回调函数
    6.then成功回调有一个参数,表示成功之后的值
      then失败回调有一个参数,表示失败之后的原因

    7.then方法是可以被链式调用的, 后面then方法的回调函数拿到值的是上一个then方法的回调函数的返回值
*/

const PENDING = 'pending' // 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected' // 失败

class MyPromise {
    constructor(executor) {
        try {
            // 执行器传进来，立即执行
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }
    // 状态，初始为pending(等待)
    status = PENDING
    // 保存成功的值,默认 没有
    value = undefined
    // 保存失败的值，默认 没有
    reason = undefined
    // 保存成功回调
    successCallBack = []
    // 保存失败回调
    failCallBack = []

    resolve = value => {
        // 如果不是等待状态，就组织函数继续执行
        if (this.status !== PENDING) return
        // pending(等待) ---> fulfilled(成功)
        this.status = FULFILLED
        // 保存成功的值
        this.value = value
        // 判断成功回调是否存在
        // this.successCallBack && this.successCallBack(this.value)
        // while (this.successCallBack.length) this.successCallBack.shift()(this.value)
        while (this.successCallBack.length) this.successCallBack.shift()()
    }

    reject = reason => {
        // 如果不是等待状态，就组织函数继续执行
        if (this.status !== PENDING) return
        // pending(等待) ---> rejected(失败)
        this.status = REJECTED
        // 保存失败的值
        this.reason = reason
        // console.log('this.reason', this.reason);
        // 判断失败回调是否存在
        // this.failCallBack && this.failCallBack(this.reason)
        // while (this.failCallBack.length) this.failCallBack.shift()(this.reason)
        while (this.failCallBack.length) this.failCallBack.shift()()
    }

    then = (successCallBack, failCallBack) => {
        // 判断 successCallBack 是否存在，存在则直接调用 successCallBack，否则 value => value 重新赋值给successCallBack
        successCallBack = successCallBack ? successCallBack : value => value
        failCallBack = failCallBack ? failCallBack : reason => { throw reason }
        // 实现then 方法返回一个promise对象
        let promise2 = new MyPromise((resolve, reject) => {
            // successCallBack, failCallBack 是function
            if (this.status === FULFILLED) {
                // 把这部分的代码变成异步，才能正常获取promise2
                setTimeout(() => {
                    try {
                        // 状态为成功，调用成功回调函数
                        let x = successCallBack(this.value)
                        // resolve(x)
                        // 判断 X 的值是普通还是promise对象
                        // 如果是普通值 直接调用resolve
                        // 如果是promise对象 查看promise对象返回结果
                        // 在根据promise对象返回的结果 决定调用resolve 还是reject
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        // 状态为失败，调用失败回调函数
                        failCallBack(this.reason)
                        // resolve(x)
                        // 判断 X 的值是普通还是promise对象
                        // 如果是普通值 直接调用resolve
                        // 如果是promise对象 查看promise对象返回结果
                        // 在根据promise对象返回的结果 决定调用resolve 还是reject
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                // 状态为等待
                // 将成功回调、失败回调 存储起来
                this.successCallBack.push(() => {
                    // successCallBack()
                    setTimeout(() => {
                        try {
                            // 状态为成功，调用成功回调函数
                            let x = successCallBack(this.value)
                            // resolve(x)
                            // 判断 X 的值是普通还是promise对象
                            // 如果是普通值 直接调用resolve
                            // 如果是promise对象 查看promise对象返回结果
                            // 在根据promise对象返回的结果 决定调用resolve 还是reject
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.failCallBack.push(() => {
                    setTimeout(() => {
                        // failCallBack()
                        try {
                            // 状态为失败，调用失败回调函数
                            failCallBack(this.reason)
                            // resolve(x)
                            // 判断 X 的值是普通还是promise对象
                            // 如果是普通值 直接调用resolve
                            // 如果是promise对象 查看promise对象返回结果
                            // 在根据promise对象返回的结果 决定调用resolve 还是reject
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise2
    }

    finally (callback) {
        // 调用 this.then 获取当前状态
        // this.then(() => { callback() }, () => { callback() })
        // finally 返回的也是 Promise 对象
        return this.then(value => {
            // callback()
            // return value
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            // callback()
            // throw reason
            return MyPromise.reject(callback()).then(() => { throw reason })
        })
    }

    catch (failCallBack) {
        return this.then(undefined, failCallBack)
    }

    static all (array) {
        // 声明一个结果数组
        let result = []
        let index = 0

        // 返回 Promise 对象
        return new MyPromise((resolve, reject) => {
            // 结果数组添加结果方法
            function addData (key, value) {
                result[key] = value
                index++
                if (index == array.length) {
                    // 当结果的长度和传进来的长度相等时才返回所有结果
                    resolve(result)
                }
            }
            // 遍历传进来的数组
            for (let i = 0; i < array.length; i++) {
                // 获取数组当前的值
                let current = array[i];
                // 判断当前的值是否为 Promise 对象
                if (current instanceof MyPromise) {
                    // Promise 对象
                    current.then(value => addData(i, value), reason => reject(reason))
                } else {
                    // 普通值，直接添加到结果数组中
                    addData(i, current)
                }
            }
        })
    }

    static resolve (value) {
        // 是MyPromise对象直接返回的
        if (value instanceof MyPromise) return value
        // 不是对象，创建一个MyPromise，把 resolve(value) 返回
        return new MyPromise(resolve => resolve(value))
    }

    static reject (reason) {
        // 是MyPromise对象直接返回的
        if (reason instanceof MyPromise) {
            console.log(reason);
            return reason
        }
        // 不是对象，创建一个MyPromise，把 reject(reason) 返回
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }

    static race (array) {
        // 声明一个结果
        let result = undefined

        // 返回 Promise 对象
        return new MyPromise((resolve, reject) => {
            // 结果数组添加结果方法
            function addData (value) {
                result = value
                if (result) {
                    // 当结果不为空的时候的就返回
                    resolve(result)
                }
            }
            // 遍历传进来的数组
            for (let i = 0; i < array.length; i++) {
                // 获取数组当前的值
                let current = array[i];
                // 判断当前的值是否为 Promise 对象
                if (current instanceof MyPromise) {
                    // Promise 对象
                    current.then(value => addData(value), reason => reject(reason))
                } else {
                    // 普通值，直接添加到结果数组中
                    addData(current)
                }
            }
        })
    }
}

function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        // promise 对象
        // x.then(value => resolve(value), reason => reject(reason))
        x.then(resolve, reject)
    } else {
        // 普通值
        resolve(x)
    }
}

// 测试
function p1 () {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => resolve('p1'), 2000)
    })
}

function p2 () {
    return new MyPromise((resolve, reject) => {
        // resolve('p2')
        reject('p2')
    })
}
MyPromise.race([p1(), p2()]).then(result => console.log(result)).catch(reason => console.log(reason))