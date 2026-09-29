import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../src/app.js";

let ready: Promise<void> | undefined;

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  ready ??= (async () => {
    await app.ready();
  })();
  await ready;

  app.server.emit("request", request, response);
}
