import { attendanceRepository } from '../repositories/attendanceRepository';
import { studentRepository } from '../repositories/studentRepository';

export const attendanceService = {
  async markAttendance(student_id: string, date: string, status: 'present' | 'absent') {
    // Ensure one record per day
    const existing = await attendanceRepository.findByStudentAndDate(student_id, date);
    if (existing) throw new Error('Attendance already marked for this student on this date');
    return attendanceRepository.create({ student_id, date, status });
  },

  async dailySummary(date?: string) {
    return attendanceRepository.dailySummary(date);
  },

  async weeklyPercentage(studentId: string) {
    return attendanceRepository.percentageForPeriod(studentId, 'week');
  },

  async monthlyPercentage(studentId: string) {
    return attendanceRepository.percentageForPeriod(studentId, 'month');
  },

  async periodSummary(period: 'week' | 'month') {
    return attendanceRepository.summaryForPeriod(period);
  },

  async findAttendanceByUserId(userId: string) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) return [];
    return attendanceRepository.findByStudent(student.id);
  },

  async weeklyPercentageByUser(userId: string) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) return 0;
    return attendanceRepository.percentageForPeriod(student.id, 'week');
  },

  async monthlyPercentageByUser(userId: string) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) return 0;
    return attendanceRepository.percentageForPeriod(student.id, 'month');
  }
};
