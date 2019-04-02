import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    // 这时候只会发送 store 内部的 reducer
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // ({getState, dispatch}) => (next) => (action) =>{}
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    //  (next) => (action) =>{}
    dispatch = compose(...chain)(store.dispatch)
// dispatch = m1(m2(store.dispatch))
// next 都有了参数
    // m2 next 对应 store.dispatch
// 所有的 dispatch 内部的都变成了 m1(m2(store.dispatch)) 形式，不要轻易调用 dispatch 会造成从头再来啊，最后一个 next
    return {
      ...store,
      dispatch
    }
  }
}
