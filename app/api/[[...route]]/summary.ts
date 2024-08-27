import { db } from "@/app/db/db";
import { accounts, categories, transactions } from "@/app/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/new_utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
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

    const periodLength = differenceInDays(endDate, startDate) + 1;

    const lastPeriodStart = subDays(startDate, periodLength);

    const lastPeriodEnd = subDays(endDate, periodLength);

    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      return await db
        .select({
          income:
            sql<number>`SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END)`.mapWith(
              Number
            ),
          expense:
            sql<number>`SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, and(eq(accounts.id, transactions.accountId)))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        );
    }

    const [lastPeriodData] = await fetchFinancialData(
      user.userId,
      lastPeriodStart,
      lastPeriodEnd
    );

    const [currentPeriod] = await fetchFinancialData(
      user.userId,
      startDate,
      endDate
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriodData.income
    );
    const expenseChange = calculatePercentageChange(
      currentPeriod.expense,
      lastPeriodData.expense
    );

    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriodData.remaining
    );

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(amount))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(categories, eq(categories.id, transactions.categoryId))
      .innerJoin(accounts, eq(accounts.id, transactions.accountId))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, user?.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(amount))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce((acc, { value }) => acc + value, 0);

    const finalCategories = [
      ...topCategories,
      { name: "Other", value: otherSum },
    ];

    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(accounts.id, transactions.accountId))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, user?.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const allDays = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expenseAmount: currentPeriod.expense,
        expenseChange,
        categories: finalCategories,
        days: allDays,
      },
    });
  }
);

export default app;
