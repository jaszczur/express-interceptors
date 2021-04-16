import httpHandler from "./index.js";
import express from "express";

//
// Sample usage
//

const app = express();

const handle = httpHandler([
  {
    name: "logger",
    enter: (ctx) => console.log("ENTER", ctx.request.path),
    leave: (ctx) => {
      console.log("LEAVE", ctx.response.status);
    },
  },
]);

app.get(
  "/",
  handle((ctx) => {
    return {
      ...ctx,
      response: {
        status: 200,
        body: "Yo!",
      },
    };
  })
);

app.listen(3000, "localhost", () => {
  console.log("Listening on http://localhost:3000/");
});
