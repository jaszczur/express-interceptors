import httpHandler from "./index.js";
import express from "express";

const loggingInterceptor = () => ({
  name: "logger",
  enter: (ctx) => {
    const requestId = Math.floor(Math.random() * 10e12);
    console.log("ENTER", requestId, ctx.request.path);
    return { ...ctx, requestId, requestTimestamp: new Date().getTime() };
  },
  leave: (ctx) => {
    const time = new Date().getTime() - ctx.requestTimestamp;
    console.log(
      "LEAVE",
      ctx.requestId,
      ctx.request.path,
      `${time}ms`,
      ctx.response.status
    );
  },
});

const app = express();

const handle = httpHandler([loggingInterceptor()]);

const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

app.get(
  "/",
  handle(async (ctx) => {
    const sleepTime = Math.random() * 1000;
    await sleep(sleepTime);

    return {
      ...ctx,
      response: {
        status: 200,
        body: `I've slept for ${sleepTime} milliseconds`,
      },
    };
  })
);

app.listen(3000, "localhost", () => {
  console.log("Listening on http://localhost:3000/");
});
