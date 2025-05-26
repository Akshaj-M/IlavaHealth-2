import { db } from './db';
import { users, type User, type InsertUser } from '../shared/schema';
import { eq, or } from 'drizzle-orm';

export const storage = {
  async createUser(userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return user;
  },

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  async getUserByPhone(phone: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || null;
  },

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || null;
  },

  async updateUserGoogleId(userId: number, googleId: string): Promise<void> {
    await db.update(users).set({ 
      googleId, 
      updatedAt: new Date() 
    }).where(eq(users.id, userId));
  },

  async updateUserPhoneVerification(userId: number, isVerified: boolean): Promise<void> {
    await db.update(users).set({ 
      isPhoneVerified: isVerified,
      updatedAt: new Date() 
    }).where(eq(users.id, userId));
  },

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  },

  async getUserByAppleId(appleId: string): Promise<User | null> {
      const [user] = await db.select().from(users).where(eq(users.appleId, appleId));
      return user || null;
  },

  async updateUserAppleId(userId: number, appleId: string): Promise<void> {
      await db.update(users).set({
          appleId,
          updatedAt: new Date()
      }).where(eq(users.id, userId));
  },
  async createSession(userId: number, token: string, expiresAt: Date) {
      const [session] = await db.insert(sessions).values({
          userId,
          token,
          expiresAt,
          createdAt: new Date()
      }).returning();
      return session;
  },

  async getSessionByToken(token: string) {
      const [session] = await db.select()
          .from(sessions)
          .where(
              eq(sessions.token, token)
          );
      return session;
  },

  async deleteSession(token: string) {
      await db.delete(sessions).where(eq(sessions.token, token));
  },
  async createOTP(otpData: { phone: string; code: string; expiresAt: Date; }) {
      await db.delete(otpCodes).where(eq(otpCodes.phone, otpData.phone));

      const [otp] = await db.insert(otpCodes).values({
          ...otpData,
          createdAt: new Date()
      }).returning();
      return otp;
  },

  async verifyOTP(phone: string, code: string) {
      const [otpRecord] = await db.select()
          .from(otpCodes)
          .where(
              and(
                  eq(otpCodes.phone, phone),
                  eq(otpCodes.code, code),
                  eq(otpCodes.verified, false),
                  gt(otpCodes.expiresAt, new Date())
              )
          );

      if (otpRecord) {
          await db.update(otpCodes)
              .set({ verified: true })
              .where(eq(otpCodes.id, otpRecord.id));
          return true;
      }
      return false;
  },
};
import { db } from './db';
import { users, otpCodes, sessions, type User, type InsertUser } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";