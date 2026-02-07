import { supabase } from '../config/supabase';

export const attendanceRepository = {
  async create(payload: any) {
    const { data, error } = await supabase.from('attendance').insert([payload]).select('*').single();
    if (error) throw error;
    return data;
  },
  async findByStudentAndDate(student_id: string, date: string) {
    const { data, error } = await supabase.from('attendance').select('*').eq('student_id', student_id).eq('date', date).maybeSingle();
    if (error) throw error;
    return data;
  },
  async updateByStudentAndDate(student_id: string, date: string, status: 'present' | 'absent') {
    const { data, error } = await supabase.from('attendance').update({ status }).eq('student_id', student_id).eq('date', date).select('*').maybeSingle();
    if (error) throw error;
    return data;
  },
  async findByStudent(student_id: string) {
    const { data, error } = await supabase.from('attendance').select('*').eq('student_id', student_id).order('date', { ascending: false });
    if (error) throw error;
    return data;
  },
  async dailySummary(date?: string) {
    const q = supabase.from('attendance');
    const day = date || new Date().toISOString().slice(0, 10);
    const { data, error } = await q.select('student_id, status').eq('date', day);
    if (error) throw error;
    const present = data.filter((r: any) => r.status === 'present').length;
    const absent = data.filter((r: any) => r.status === 'absent').length;
    return { date: day, present, absent };
  },
  async findByDate(date?: string) {
    const day = date || new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase.from('attendance').select('student_id, status').eq('date', day);
    if (error) throw error;
    return data || [];
  },
  async summaryForPeriod(period: 'week' | 'month') {
    const now = new Date();
    let from: string;
    if (period === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      from = d.toISOString().slice(0, 10);
    } else {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      from = d.toISOString().slice(0, 10);
    }
    const to = now.toISOString().slice(0, 10);
    const { data, error } = await supabase.from('attendance').select('status').gte('date', from).lte('date', to);
    if (error) throw error;
    const present = data.filter((r: any) => r.status === 'present').length;
    const absent = data.filter((r: any) => r.status === 'absent').length;
    return { from, to, present, absent };
  },
  async percentageForPeriod(student_id: string, period: 'week' | 'month') {
    // Calculate date range
    const now = new Date();
    let from: string;
    if (period === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      from = d.toISOString().slice(0, 10);
    } else {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      from = d.toISOString().slice(0, 10);
    }
    const { data, error } = await supabase.from('attendance').select('status').eq('student_id', student_id).gte('date', from).lte('date', now.toISOString().slice(0,10));
    if (error) throw error;
    const total = data.length;
    const present = data.filter((r: any) => r.status === 'present').length;
    const percent = total === 0 ? 0 : (present / total) * 100;
    return { total, present, percent };
  }
};
