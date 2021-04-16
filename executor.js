const interceptorExecutor = (chain) => {
  const moveForward = (context) => {
    const head = context.queue[0];
    const tail = context.queue.slice(1);
    return {
      ...context,
      queue: tail,
      stack: [...context.stack, head],
    };
  };

  const moveBackward = (context) => {
    return {
      ...context,
      queue: [],
      stack: context.stack.slice(0, context.stack.length - 1),
    };
  };

  return async (initialContext, handler) => {
    let context = {
      ...initialContext,
      queue: [...chain],
      stack: [],
    };

    while (context.queue.length > 0) {
      const interceptor = context.queue[0];
      context = moveForward(context);
      if (interceptor.enter) {
        const result = await interceptor.enter(context);
        context = result || context;
      }
    }

    context = await handler(context);

    while (context.stack.length > 0) {
      const interceptor = context.stack[context.stack.length - 1];
      context = moveBackward(context);
      if (interceptor.leave) {
        const result = await interceptor.leave(context);
        context = result || context;
      }
    }

    return context;
  };
};

export default interceptorExecutor;
