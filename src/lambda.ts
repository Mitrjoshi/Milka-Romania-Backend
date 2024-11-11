import serverless from "aws-serverless-express";
import { Handler } from "aws-lambda";
import app from "./app";

const server = serverless.createServer(app);

export const handler: Handler = (event, context) => {
  return new Promise((resolve, reject) => {
    serverless.proxy(server, event, {
      ...context,
      succeed: resolve,
      fail: reject,
    });
  });
};
