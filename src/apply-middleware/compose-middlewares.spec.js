import { composeMiddlewares } from './compose-middlewares';

describe('composeMiddlewares', () => {
  const state = { foo: 123 };
  let dispatch;
  let store;

  beforeEach(() => {
    dispatch = jest.fn();
    store = {
      getState() {
        return state;
      },
      dispatch,
    };
  });

  it('should provide store for each middleware in chain', () => {
    const identityMiddleware = () => (next) => next;
    const fooMiddleware = jest.fn(identityMiddleware);
    const barMiddleware = jest.fn(identityMiddleware);
    const composedMiddleware = composeMiddlewares(fooMiddleware, barMiddleware);
    composedMiddleware(store)()({ type: 'ACTION' });
    expect(fooMiddleware).toBeCalledWith(store);
    expect(barMiddleware).toBeCalledWith(store);
  });

  it('should compose middlewares from right to left', () => {
    const inc = () => (next) => (action) => next({ ...action, payload: action.payload + 1 });
    const square = () => (next) => (action) => next({
      ...action,
      payload: action.payload * action.payload,
    });
    const composedMiddleware = composeMiddlewares(inc, square);
    composedMiddleware(store)()({ type: 'ACTION', payload: 9 });
    expect(dispatch).toBeCalledWith({ type: 'ACTION', payload: 100 });
  });

  it('should produce dispatching middleware if no middlewares provided', () => {
    const dispatchingMiddleware = composeMiddlewares();
    const action = { type: 'ACTION' };
    dispatchingMiddleware(store)()(action);
    expect(dispatch).toBeCalledWith(action);
  });
});
