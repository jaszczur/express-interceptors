import executorFactory from "./executor.js";

//
// Express adapter
//

const httpHandlerFactory = (executorOrChain) => {
  const executor = Array.isArray(executorOrChain)
    ? executorFactory(executorOrChain)
    : executorOrChain;

  const serializeRequest = (req) => req;
  const applyResponse = (recipe, res) => {
    if (recipe.status) res.status(recipe.status);
    if (recipe.body) res.send(recipe.body);
  };

  return (handler) => {
    return (req, res) => {
      const ctx = {
        request: serializeRequest(req),
        response: {},
      };
      executor(ctx, handler).then((ctx) => {
        applyResponse(ctx.response, res);
      });
    };
  };
};

export default httpHandlerFactory;
