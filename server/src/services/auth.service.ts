import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { Repositories } from '../db/repositories/interfaces';

export class AuthService {
  constructor(private repos: Repositories) {}

  async register(name: string, email: string, password: string, role: string = 'member') {
    const existing = this.repos.users.findByEmail(email);
    if (existing) throw new Error('Email already registered');

    const password_hash = await bcrypt.hash(password, 12);
    const user = this.repos.users.create({ id: '', name, email, password_hash, role: role as any, avatar: null });
    const { password_hash: _, ...safeUser } = user as any;
    const token = this.generateToken(user.id, user.role);
    return { user: safeUser, token };
  }

  async login(email: string, password: string) {
    const user = this.repos.users.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password_hash || '');
    if (!valid) throw new Error('Invalid credentials');

    const { password_hash: _, ...safeUser } = user as any;
    const token = this.generateToken(user.id, user.role);
    return { user: safeUser, token };
  }

  getMe(userId: string) {
    const user = this.repos.users.findById(userId);
    if (!user) throw new Error('User not found');
    const { password_hash: _, ...safeUser } = user as any;
    return safeUser;
  }

  private generateToken(userId: string, role: string) {
    return jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  }
}
