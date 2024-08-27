import { db } from "@/app/db/db";
import { categories, insertCategorySchema } from "@/app/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const user = getAuth(c);

    if (!user?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, user.userId));
    return c.json({ data });
  })
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const user = getAuth(c);
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(and(eq(categories.userId, user.userId), eq(categories.id, id)));
      return c.json({ data: data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const user = getAuth(c);

      const { name } = c.req.valid("json");

      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .insert(categories)
        .values({
          id: uuidv4(),
          name,
          userId: user.userId,
        })
        .returning();

      return c.json({ data: data[0] });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const user = getAuth(c);

      const { ids } = c.req.valid("json");

      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(categories)
        .where(
          and(eq(categories.userId, user.userId), inArray(categories.id, ids))
        )
        .returning({
          id: categories.id,
        });

      return c.json({ data: data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const user = getAuth(c);
      const { id } = c.req.valid("param");
      const { name } = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .update(categories)
        .set({ name })
        .where(and(eq(categories.userId, user.userId), eq(categories.id, id)))
        .returning();
      return c.json({ data: data[0] });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const user = getAuth(c);
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .delete(categories)
        .where(and(eq(categories.userId, user.userId), eq(categories.id, id)))
        .returning();
      return c.json({ data: data[0] });
    }
  );

export default app;
