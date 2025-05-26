import { db } from "./db";
import { users, otpCodes, sessions } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";

export interface CreateUserData {
  email?: string;
  phone?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  userType: string;
  googleId?: string;
  appleId?: string;
  profileImage?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface CreateOTPData {
  phone: string;
  code: string;
  expiresAt: Date;
}

export const storage = {
  // User methods
  async createUser(userData: CreateUserData) {
    const [user] = await db.insert(users).values({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return user;
  },

  async getUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async getUserByPhone(phone: string) {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  },

  async getUserByGoogleId(googleId: string) {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  },

  async getUserByAppleId(appleId: string) {
    const [user] = await db.select().from(users).where(eq(users.appleId, appleId));
    return user;
  },

  async updateUserGoogleId(userId: number, googleId: string) {
    await db.update(users)
      .set({ googleId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  async updateUserAppleId(userId: number, appleId: string) {
    await db.update(users)
      .set({ appleId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  async updateUserPhoneVerification(userId: number, isVerified: boolean) {
    await db.update(users)
      .set({ isPhoneVerified: isVerified, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  async getAllUsers() {
    return await db.select().from(users);
  },

  // OTP methods
  async createOTP(otpData: CreateOTPData) {
    // Delete any existing OTPs for this phone
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
      // Mark OTP as verified
      await db.update(otpCodes)
        .set({ verified: true })
        .where(eq(otpCodes.id, otpRecord.id));
      return true;
    }
    return false;
  },

  // Session methods
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
        and(
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date())
        )
      );
    return session;
  },

  async deleteSession(token: string) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
};