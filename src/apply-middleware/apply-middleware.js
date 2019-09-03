import { composeMiddlewares } from './compose-middlewares';

export function applyMiddleware(...middlewares) {
  const mw = composeMiddlewares(...middlewares);
  return (useDispatcher) => (state, dispatch) => {
    const dispatcher = useDispatcher(state, dispatch);
    const store = {
      getState() {
        return state;
      },
      dispatch: dispatcher,
    };
    return mw(store)(dispatcher);
  };
}
