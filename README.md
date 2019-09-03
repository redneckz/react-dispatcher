# react-dispatcher

> TODO

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

## Installation

```shell
npm install --save @redneckz/react-dispatcher
```

## How-to

```jsx
import React from 'react';
import { useDispatcher } from '@redneckz/react-dispatcher';

const initialState = { count: 1000 };

/**
 * Local store. No need in "Lifting state up"
 */
function reducer(state, { type }) {
  switch (type) {
    case 'INC':
      return { count: state.count + 1 };
    case 'DEC':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

export function Counter() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const dispatcher = useDispatcher(state, dispatch);
  return (
    <button onClick={() => dispatcher({ type: 'INC' })}>{state.count}</button>
  );
}
```

```jsx
import { useDispatcher } from '@redneckz/react-dispatcher';

/**
 * Some container far away from counter
 * and loosely coupled with containers
 * that support pattern { type: "dec" }
 */
export function Dec() {
  const dispatcher = useDispatcher();
  return <button onClick={() => dispatcher({ type: 'DEC' })}>-</button>;
}
```

```jsx
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { useDispatcher, applyMiddleware } from '@redneckz/react-dispatcher';

/**
 * Produces new hook useDispatcher
 */
export default applyMiddleware(
  logger,
  thunk,
)(useDispatcher);
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Freact-dispatcher.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Freact-dispatcher
[build-image]: https://cloud.drone.io/api/badges/redneckz/react-dispatcher/status.svg
[build-url]: https://cloud.drone.io/redneckz/react-dispatcher
[coveralls-image]: https://coveralls.io/repos/github/redneckz/react-dispatcher/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/react-dispatcher?branch=master
[bundlephobia-image]: https://badgen.net/bundlephobia/min/@redneckz/react-dispatcher
[bundlephobia-url]: https://bundlephobia.com/result?p=@redneckz/react-dispatcher
