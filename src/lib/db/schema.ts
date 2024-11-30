import { SQL, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  uuid,
  integer,
  pgEnum,
  decimal,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const Role = pgEnum("role", ["user", "admin", "host"]);
export const TicketStatus = pgEnum("ticketStatus", [
  "valid",
  "used",
  "refunded",
  "cancelled",
]);
export const OrderStatus = pgEnum("orderStatus", [
  "pending",
  "paid",
  "refunded",
  "cancelled",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: Role("role").notNull().default("user"),
  twoFactorEnabled: boolean("twoFactorEnabled"),
  stripeConnectId: varchar("stripeConnectId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const event = pgTable("event", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  isFree: boolean("isFree").notNull().default(false),
  isOnline: boolean("isOnline").notNull().default(false),
  isCancelled: boolean("isCancelled").notNull().default(false),
  slug: varchar("slug", { length: 255 }).notNull(),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => category.id),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  totalEarnings: decimal("totalEarnings", { precision: 10, scale: 2 }).default(
    "0.00"
  ),
  organizerEarnings: decimal("organizerEarnings", {
    precision: 10,
    scale: 2,
  }).default("0.00"),
  platformsEarnings: decimal("platformsEarnings", {
    precision: 10,
    scale: 2,
  }).default("0.00"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const category = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const ticketDetails = pgTable("ticketDetails", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  eventId: uuid("eventId")
    .notNull()
    .references(() => event.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  totalQuantity: integer("totalQuantity").notNull(),
  availableQuantity: integer("availableQuantity").notNull(),
  maxPerCustomer: integer("maxPerCustomer").notNull().default(3),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const ticket = pgTable("ticket", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  eventId: uuid("eventId")
    .notNull()
    .references(() => event.id),
  ticketDetailsId: uuid("ticketDetailsId")
    .notNull()
    .references(() => ticketDetails.id),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull(),
  pricePerTicket: decimal("pricePerTicket", { precision: 10, scale: 2 }),
  paymentIntentId: text("paymentIntentId"),
  status: TicketStatus("ticketStatus").notNull().default("valid"),
  purchasedAt: timestamp("purchasedAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const order = pgTable("order", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  eventId: uuid("eventId")
    .notNull()
    .references(() => event.id),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull(),
  paymentIntentId: text("paymentIntentId"),
  status: OrderStatus("orderStatus").notNull().default("pending"),
  purchasedAt: timestamp("purchasedAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const twoFactor = pgTable("twoFactor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backupCodes").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

// Types
export type UserType = typeof user.$inferSelect;
export type NewUserType = typeof user.$inferInsert;

export type EventType = typeof event.$inferSelect;
export type NewEventType = typeof event.$inferInsert;

export type CategoryType = typeof category.$inferSelect;
export type NewCategoryType = typeof category.$inferInsert;

export type TicketDetailsType = typeof ticketDetails.$inferSelect;
export type NewTicketDetailsType = typeof ticketDetails.$inferInsert;

export type TicketType = typeof ticket.$inferSelect;
export type NewTicketType = typeof ticket.$inferInsert;

export type OrderType = typeof order.$inferSelect;
export type NewOrderType = typeof order.$inferInsert;

// Utility functions
export const lowerCase = (str: AnyPgColumn): SQL => {
  return sql`lower(${str})`;
};
