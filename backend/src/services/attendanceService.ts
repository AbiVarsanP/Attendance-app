import { attendanceRepository } from '../repositories/attendanceRepository';
import { studentRepository } from '../repositories/studentRepository';

export const attendanceService = {
  async markAttendance(student_id: string, date: string, status: 'present' | 'absent') {
    // If there's an existing record for this student and date, update it (allow re-marking)
    const existing = await attendanceRepository.findByStudentAndDate(student_id, date);
    if (existing) {
      // If the status is the same, just return the record
      if (existing.status === status) return existing;
      // Otherwise update and return
      return attendanceRepository.updateByStudentAndDate(student_id, date, status);
    }
    // No existing record, create a new one
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

  async findByDate(date?: string) {
    return attendanceRepository.findByDate(date);
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
