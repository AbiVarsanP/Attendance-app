import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const login = async (req: Request, res: Response) => {
  const { email, password, register_number, identifier } = req.body;
  const id = email || register_number || identifier;
  try {
    const result = await authService.login(id, password);
    // result: { token, user }
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const registerStudent = async (req: Request, res: Response) => {
  const { name, email, password, register_number } = req.body;
  try {
    const student = await authService.createStudent({ name, email, password, register_number });
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
