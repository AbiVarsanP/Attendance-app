import { Request, Response } from 'express';
import { attendanceService } from '../services/attendanceService';
import { authService } from '../services/authService';
import { studentRepository } from '../repositories/studentRepository';
import { userRepository } from '../repositories/userRepository';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, register_number } = req.body;
    const student = await authService.createStudent({ name, email, password, register_number });
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listStudents = async (req: Request, res: Response) => {
  try {
    const students = await studentRepository.listAll();
    // Attach user info for each student
    const results = await Promise.all(students.map(async (s: any) => {
      const user = await userRepository.findById(s.user_id);
      return { ...s, user };
    }));
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { name, email, password, register_number } = req.body;
    const student = await studentRepository.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Update student table
    if (register_number) {
      await studentRepository.update(studentId, { register_number });
    }

    // Update user table
    const userUpdate: any = {};
    if (name) userUpdate.name = name;
    if (email) userUpdate.email = email;
    if (password) {
      const bcrypt = require('bcrypt');
      userUpdate.password_hash = await bcrypt.hash(password, 10);
    }
    if (Object.keys(userUpdate).length > 0) {
      await userRepository.update(student.user_id, userUpdate);
    }

    const updatedStudent = await studentRepository.findById(studentId);
    const user = await userRepository.findById(updatedStudent.user_id);
    res.json({ ...updatedStudent, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const student = await studentRepository.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Delete user which cascades to student and attendance
    await userRepository.delete(student.user_id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { student_id, date, status } = req.body;
    const result = await attendanceService.markAttendance(student_id, date, status);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const attendanceByDate = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string | undefined;
    const records = await attendanceService.findByDate(date);
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const dailySummary = async (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  const summary = await attendanceService.dailySummary(date);
  res.json(summary);
};

export const studentAnalytics = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const weekly = await attendanceService.weeklyPercentage(studentId);
  const monthly = await attendanceService.monthlyPercentage(studentId);
  res.json({ weekly, monthly });
};

export const weeklySummary = async (req: Request, res: Response) => {
  try {
    const s = await attendanceService.periodSummary('week');
    res.json(s);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const monthlySummary = async (req: Request, res: Response) => {
  try {
    const s = await attendanceService.periodSummary('month');
    res.json(s);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
