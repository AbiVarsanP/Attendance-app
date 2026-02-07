import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { studentRepository } from '../repositories/studentRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authService = {
  async login(identifier: string, password: string) {
    // identifier can be email or register_number
    let user = await userRepository.findByEmail(identifier);
    // if not found by email, try register number -> get student -> user
    if (!user) {
      const student = await studentRepository.findByRegisterNumber(identifier);
      if (student) user = await userRepository.findById(student.user_id);
    }
    if (!user) throw new Error('Invalid credentials');
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    // Return token and basic user info (no password)
    const safeUser = { id: user.id, role: user.role, name: user.name, email: user.email };
    return { token, user: safeUser };
  },

  async createStudent({ name, email, password, register_number }: any) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('Email already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password_hash: hash, role: 'student' });
    const student = await studentRepository.create({ user_id: user.id, register_number });
    return { user, student };
  }
};
