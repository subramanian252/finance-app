import { db } from "@/app/db/db";
import {
  accounts,
  categories,
  insertCategorySchema,
  insertTransactionSchema,
  transactions,
} from "@/app/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";
import { parse, subDays } from "date-fns";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const user = getAuth(c);

      const { from, to, accountId } = c.req.valid("query");

      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const data = await db
        .select({
          id: transactions.id,
          payee: transactions.payee,
          amount: transactions.amount,
          date: transactions.date,
          categoryId: transactions.categoryId,
          category: categories.name,
          accountId: transactions.accountId,
          account: accounts.name,
          notes: transactions.notes,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, user?.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
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
          id: transactions.id,
          payee: transactions.payee,
          amount: transactions.amount,
          date: transactions.date,
          categoryId: transactions.categoryId,
          accountId: transactions.accountId,
          notes: transactions.notes,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(accounts.userId, user?.userId), eq(transactions.id, id)));
      return c.json({ data: data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const user = getAuth(c);

      const values = c.req.valid("json");

      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .insert(transactions)
        .values({
          id: uuidv4(),
          ...values,
        })
        .returning();

      return c.json({ data: data[0] });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
    async (c) => {
      const user = getAuth(c);
      const values = c.req.valid("json");

      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((i) => ({
            id: uuidv4(),
            ...i,
          }))
        )
        .returning();

      return c.json({ data: data });
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

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(eq(accounts.userId, user.userId), inArray(transactions.id, ids))
          )
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select * from ${transactionsToDelete})`)
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data: data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const user = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToPatch = db.$with("transactions_to_update").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, user.userId), eq(transactions.id, id)))
      );

      const [data] = await db
        .with(transactionsToPatch)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select * from ${transactionsToPatch})`)
        )
        .returning();
      return c.json({ data: data });
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

      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, user.userId), eq(transactions.id, id)))
      );

      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select * from ${transactionToDelete})`)
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data: data });
    }
  );

export default app;
