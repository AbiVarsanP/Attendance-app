import { Request, Response } from 'express';
import { attendanceService } from '../services/attendanceService';
import { userRepository } from '../repositories/userRepository';
import { studentRepository } from '../repositories/studentRepository';

export const myAttendance = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  const records = await attendanceService.findAttendanceByUserId(userId);
  res.json(records);
};

export const myAnalytics = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  const weekly = await attendanceService.weeklyPercentageByUser(userId);
  const monthly = await attendanceService.monthlyPercentageByUser(userId);

  // include basic student/profile info so frontend can show name and register_number
  const user = await userRepository.findById(userId);
  const student = await studentRepository.findByUserId(userId);

  res.json({ weekly, monthly, user: { id: user.id, name: user.name, email: user.email }, student: { id: student?.id, register_number: student?.register_number } });
};
