declare module '@redneckz/react-dispatcher' {
  type Dispatch<A> = (action: A) => any;
  type UseDispatcher<S, A> = (state?: S, dispatch?: Dispatch<A>) => Dispatch<A>;

  export function createDispatcher<S, A>(): UseDispatcher<S, A>;

  interface Store<S, A> {
    getState: () => S;
    dispatch: Dispatch<A>;
  }
  type Middleware<S, A> = (store: Store<S, A>) => (next: Dispatch<A>) => Dispatch<A>;

  export function applyMiddleware<S, A>(...middlewares: Middleware<S, A>[]): (useDispatcher: UseDispatcher<S, A>) => UseDispatcher<S, A>;
}
