import { useEffect } from 'react';

export function createDispatcher() {
  const storesMap = new Map();
  function dispatcher(action) {
    storesMap.forEach((state, dispatch) => dispatch(action));
  }
  function register(state, dispatch) {
    if (!dispatch) return undefined;
    storesMap.set(dispatch, state);
    return () => storesMap.delete(dispatch);
  }
  return function useDispatcher(state, dispatch) {
    useEffect(() => register(state, dispatch), [state, dispatch]);
    return dispatcher;
  };
}
