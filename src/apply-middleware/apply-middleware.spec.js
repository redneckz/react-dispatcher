import { applyMiddleware } from './apply-middleware';

describe('applyMiddleware', () => {
  const state = {};
  const dispatch = () => {};
  let dispatcher;
  let useDispatcher;

  beforeEach(() => {
    dispatcher = jest.fn();
    useDispatcher = jest.fn(() => dispatcher);
  });

  describe('as useDispatcher hook wrapper', () => {
    it('should pass appropriate args (state, dispatch) down to wrapped useDispatcher hook', () => {
      const wrappedHook = applyMiddleware()(useDispatcher);
      wrappedHook(state, dispatch);
      expect(useDispatcher).toBeCalledWith(state, dispatch);
    });

    it('should wrap dispatcher function produced by wrapped useDispatcher hook', () => {
      const wrappedHook = applyMiddleware()(useDispatcher);
      const wrappedDispatcher = wrappedHook(state, dispatch);
      const action = { type: 'ACTION' };
      wrappedDispatcher(action);
      expect(dispatcher).toBeCalledWith(action);
    });
  });

  describe('as middleware applicator', () => {
    it('should supply each middleware with appropriate state (as field of store)', () => {
      const identityMiddleware = jest.fn(() => (next) => next);
      const wrappedHook = applyMiddleware(identityMiddleware)(useDispatcher);
      wrappedHook(state, dispatch);
      const store = identityMiddleware.mock.calls[0][0]; // first arg
      expect(store.dispatch).toBe(dispatcher);
    });

    it('should supply each middleware with dispatcher function (as field of store)', () => {
      const identityMiddleware = jest.fn(() => (next) => next);
      const wrappedHook = applyMiddleware(identityMiddleware)(useDispatcher);
      wrappedHook(state, dispatch);
      const store = identityMiddleware.mock.calls[0][0]; // first arg
      expect(store.getState()).toBe(state);
    });

    it('should apply each middleware to wrapped useDispatcher hook', () => {
      const echoMiddleware = (store) => (next) => (action) => {
        store.dispatch({ type: 'ECHO', payload: store.getState() });
        return next(action);
      };
      const fooMiddleware = () => (next) => (action) => next({ ...action, meta: { foo: 123 } });
      const wrappedHook = applyMiddleware(echoMiddleware, fooMiddleware)(
        useDispatcher,
      );
      const wrappedDispatcher = wrappedHook(state, dispatch);
      wrappedDispatcher({ type: 'ACT' });
      expect(dispatcher).toBeCalledWith({ type: 'ECHO', payload: state });
      expect(dispatcher).toBeCalledWith({ type: 'ACT', meta: { foo: 123 } });
    });
  });
});
