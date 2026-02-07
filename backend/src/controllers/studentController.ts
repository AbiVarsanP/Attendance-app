import { Request, Response } from 'express';
import { attendanceService } from '../services/attendanceService';

export const myAttendance = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  const records = await attendanceService.findAttendanceByUserId(userId);
  res.json(records);
};

export const myAnalytics = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  const weekly = await attendanceService.weeklyPercentageByUser(userId);
  const monthly = await attendanceService.monthlyPercentageByUser(userId);
  res.json({ weekly, monthly });
};
