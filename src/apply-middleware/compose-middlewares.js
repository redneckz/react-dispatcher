export function composeMiddlewares(...middlewares) {
  return middlewares
    .reverse()
    .reduce(
      (acc, mw) => (store) => (next) => mw(store)(acc(store)(next)),
      finalMiddleware,
    );
}

function finalMiddleware({ dispatch }) {
  return () => dispatch;
}
