/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) => (...args) => a(b(...args))
  )
}

//  累加
// function f(a, b) {
//   return function(arg){
//     console.log(a)
//     a(b(arg))
//   }
// }

// 相当于 funcs.reduce(f)， 返回一个两个函数形成函数栈因此会执行两次,闭包是不会随着运行，但是形成了一层层的函数栈，洋葱圈的本质也是一层层的函数栈的结束。但是返回的函数形成了一个函数栈一点一点返回直到最后一个返回
