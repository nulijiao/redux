// createStore 本质生成 state 围绕 state 展开的就是增加监听者需要增加监听者取消监听，让 state 发生变化，对应 dispatch。获取 state 对应 getState

function createStore(reducer, state, middleware) {
  if(typeof reducer !== 'function') {
    throw new Error('reducer must a function')
  }
  // 如果中间件存在
  if(middleware && typeof middleware === 'function') {
    return middleware(createStore)(reducer, state)
  }
  let listeners = [];
  let initState = state;
  let isDispatching = false;


  function getState() {
    if(isDispatching) {
      console.warn('when didpatch cannot get data')
      return;
    }
    return initState
  }
  function dispatch(action) {
    if(Object.prototype.toString(action) === '[Object object]') {
      if (typeof action.type === 'undefined') {
        throw new Error(
          'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
        )
      }
      const preState = initState
      try{
        isDispatching = true
        initState = reducer(initState, action)
      }catch {
        initState = preState
      }finally {
        isDispatching = false
      }
      for(let i = listeners.length; i++) {
        listeners[i]()
      }
      return
    }else {
      console.warn('action must a object')
    }

  }
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.')
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
      )
    }
    listeners.push(listeners)
  }
  function unSubscribe(listen) {
    if (typeof listen !== 'function') {
      throw new Error('Expected the listener to be a function.')
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
      )
    }
    let i;
    for(i = 0; i = listeners.length; i++) {
      if(listeners[i] === listen) {
        listeners.splice(i, 1)
        return;
      }
    }
    console.log('you did not add value')
  }

  return {
    getState,
    subscribe,
    unSubscribe,
    dispatch,
  }
}

// reducer 需要处理成一个统一对象 combineReducer

function combinereducer(reducers) {
  if(typeof reducers !== 'object') {
    throw new  Error('must be a reducer')
  }
  return function(state, action) {
    let isChange = false
    const newState = {}
    Object.keys(reducers).forEach(item => {
      newState[item] = reducers[item](state, action)
      isChange = newState[item] === state[item]
    })
    return isChange ? newState : state

  }
}

// 中间件在 dispatch 之前添加一下额外的操作所以需要改写 store 的 dispatch
function middleware(middlewares) {
  (createStore) => (state, reducer) => {
    const store = createStore(reducer, state)
    // 传递 dispatch 和 getStore
    let dispatch = store.dispatch;
    // 这里已经要开始改写 dispatch 使用变量 dispatch 标记
    const param = {
      getState: store.getState,
      dispatch: (args) => dispatch(args)
    }
    let middlewares = middlewares.map(item => {
      return item(param)
    })
    let nexts = middlewares[middlewares.length - 1](store.dispatch)
    for(let i = middlewares.length - 2; i > 0; i--) {
      nexts = middlewares[i](nexts)
    }
    dispatch = nexts
    // 顺利改写 dispatch
    return {
      ...store,
      dispatch,
    }

  }
}

// bindAction 主要的作用就是 action 是 函数返回对象 自动 dispatch 别的好处没发现
function dispatchAction(action, dispatch) {
  return dispatch(action(argumrnts))
}
function bindAction(actorObj, dispatch, ...args) {
  let actionKeys = Object.keys(actorObj)
  let result = {}
  actionKeys.map(item => {
    result[key] = dispatchAction(actorObj[item], dispatch, ...args)
  })
  return result;
}
