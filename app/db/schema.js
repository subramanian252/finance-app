"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertTransactionSchema = exports.transactionRelations = exports.transactions = exports.insertCategorySchema = exports.categoryRelations = exports.categories = exports.insertAccountSchema = exports.accountRelations = exports.accounts = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
var zod_1 = require("zod");
exports.accounts = (0, pg_core_1.pgTable)("accounts", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    userId: (0, pg_core_1.text)("user_id").notNull(),
    plaidId: (0, pg_core_1.text)("plaid_id"),
});
exports.accountRelations = (0, drizzle_orm_1.relations)(exports.accounts, function (_a) {
    var many = _a.many;
    return ({
        transactions: many(exports.transactions),
    });
});
exports.insertAccountSchema = (0, drizzle_zod_1.createInsertSchema)(exports.accounts);
exports.categories = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    userId: (0, pg_core_1.text)("user_id").notNull(),
    plaidId: (0, pg_core_1.text)("plaid_id"),
});
exports.categoryRelations = (0, drizzle_orm_1.relations)(exports.categories, function (_a) {
    var many = _a.many;
    return ({
        transactions: many(exports.transactions),
    });
});
exports.insertCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.categories);
exports.transactions = (0, pg_core_1.pgTable)("transactions", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    amount: (0, pg_core_1.integer)("amount").notNull(),
    payee: (0, pg_core_1.text)("payee").notNull(),
    notes: (0, pg_core_1.text)("notes"),
    date: (0, pg_core_1.timestamp)("date", { mode: "date" }).notNull(),
    accountId: (0, pg_core_1.text)("account_id").references(function () { return exports.accounts.id; }, {
        onDelete: "cascade",
    }),
    categoryId: (0, pg_core_1.text)("category_id").references(function () { return exports.categories.id; }, {
        onDelete: "set null",
    }),
});
exports.transactionRelations = (0, drizzle_orm_1.relations)(exports.transactions, function (_a) {
    var one = _a.one;
    return ({
        account: one(exports.accounts, {
            fields: [exports.transactions.accountId],
            references: [exports.accounts.id],
        }),
        category: one(exports.categories, {
            fields: [exports.transactions.categoryId],
            references: [exports.categories.id],
        }),
    });
});
exports.insertTransactionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.transactions, {
    date: zod_1.z.coerce.date(),
});
