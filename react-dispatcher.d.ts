import * as React from 'react';

declare module '@redneckz/react-dispatcher' {
  export function createDispatcher(): <D extends React.Dispatch<any>>(state?: any, dispatch?: D) => D;
  export function applyMiddleware(...arg: Function[]): <D extends React.Dispatch<any>>(arg: (state?: any, dispatch?: D) => D) => void;
}
