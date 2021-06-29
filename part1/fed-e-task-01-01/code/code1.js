/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

// text：文本，ms：延时时间/毫秒
const clgStr = (text, ms) => {
    return new Promise((resolve, reject) =>
        setTimeout(() => resolve(text), ms)
    )
}
clgStr('hello', 10)
    .then(value => clgStr(value + 'lagou', 10))
    .then(value => clgStr(value + 'I ♥ U', 10))
    .then(value => console.log(value))
