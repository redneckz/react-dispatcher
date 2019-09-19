import * as React from 'react';

declare module '@redneckz/react-dispatcher' {
  export function createDispatcher(): <D extends React.Dispatch<any>>(state: any, dispatch: D) => D;
}
