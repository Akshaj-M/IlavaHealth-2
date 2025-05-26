
// In-memory storage for demo purposes (no database required)
interface User {
  id: number;
  email?: string;
  phone?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  userType: string;
  googleId?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory user storage
const users: User[] = [
  {
    id: 1,
    email: "test@example.com",
    passwordHash: "$2b$10$xyz", // This would be the hash of "password"
    firstName: "Test",
    lastName: "User",
    userType: "buyer",
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: "farmer@example.com",
    passwordHash: "$2b$10$abc", // This would be the hash of "password"
    firstName: "John",
    lastName: "Farmer",
    userType: "farmer",
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextUserId = 3;

export const storage = {
  async getAllUsers(): Promise<User[]> {
    return Promise.resolve([...users]);
  },

  async getUserById(id: number): Promise<User | null> {
    const user = users.find(u => u.id === id);
    return Promise.resolve(user || null);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = users.find(u => u.email === email);
    return Promise.resolve(user || null);
  },

  async getUserByPhone(phone: string): Promise<User | null> {
    const user = users.find(u => u.phone === phone);
    return Promise.resolve(user || null);
  },

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const user = users.find(u => u.googleId === googleId);
    return Promise.resolve(user || null);
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: nextUserId++,
      email: userData.email,
      phone: userData.phone,
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      userType: userData.userType || "buyer",
      googleId: userData.googleId,
      isEmailVerified: userData.isEmailVerified || false,
      isPhoneVerified: userData.isPhoneVerified || false,
      profileImage: userData.profileImage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    return Promise.resolve(newUser);
  },

  async updateUserPhoneVerification(userId: number, isVerified: boolean): Promise<User | null> {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.isPhoneVerified = isVerified;
      user.updatedAt = new Date();
    }
    return Promise.resolve(user || null);
  },

  async updateUserGoogleId(userId: number, googleId: string): Promise<User | null> {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.googleId = googleId;
      user.updatedAt = new Date();
    }
    return Promise.resolve(user || null);
  },
};
