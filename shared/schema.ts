import { pgTable, serial, text, varchar, boolean, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { InferSelectModel, relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'farmer' or 'buyer'
  googleId: varchar("google_id", { length: 255 }).unique(),
  appleId: varchar("apple_id", { length: 255 }).unique(),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 50 }),
  quantity: integer('quantity').notNull().default(0),
  unit: varchar('unit', { length: 20 }).notNull().default('kg'), // 'kg', 'quintal', 'tons'
  farmerId: integer('farmer_id').notNull(),
  wasteType: varchar('waste_type', { length: 50 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Waste scans table
export const wasteScans = pgTable('waste_scans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  imageUrl: text('image_url').notNull(),
  detectedWasteType: varchar('detected_waste_type', { length: 50 }),
  confidence: decimal('confidence', { precision: 5, scale: 4 }), // ML confidence score
  scanResults: text('scan_results'), // JSON with detailed analysis
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  buyerId: integer('buyer_id').notNull(),
  sellerId: integer('seller_id').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  shippingAddress: text('shipping_address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cart items
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
});

// Favorites
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
});

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  farmer: one(users, {
    fields: [products.farmerId],
    references: [users.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

export const wasteScansRelations = relations(wasteScans, ({ one }) => ({
  user: one(users, {
    fields: [wasteScans.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Types
export type User = InferSelectModel<typeof users>;
export type Product = InferSelectModel<typeof products>;
export type CartItem = InferSelectModel<typeof cartItems>;
export type Favorite = InferSelectModel<typeof favorites>;
export type WasteScan = InferSelectModel<typeof wasteScans>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  phone: true,
  passwordHash: true,
  firstName: true,
  lastName: true,
  userType: true,
  googleId: true,
  appleId: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  profileImage: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  quantity: true,
  unit: true,
  farmerId: true,
  wasteType: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  productId: true,
});

export const insertWasteScanSchema = createInsertSchema(wasteScans).pick({
  userId: true,
  imageUrl: true,
  detectedWasteType: true,
  confidence: true,
  scanResults: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  buyerId: true,
  sellerId: true,
  totalAmount: true,
  status: true,
  shippingAddress: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

// Export types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertWasteScan = z.infer<typeof insertWasteScanSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;