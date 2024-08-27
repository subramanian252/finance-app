import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import category from "./category";
import transactions from "./transactions";
import summary from "./summary";

import { HTTPException } from "hono/http-exception";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/account", accounts)
  .route("/category", category)
  .route("/transactions", transactions)
  .route("/summary", summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
