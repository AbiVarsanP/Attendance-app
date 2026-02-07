import { supabase } from '../config/supabase';

export const studentRepository = {
  async create(payload: any) {
    const { data, error } = await supabase.from('students').insert([payload]).select('*').single();
    if (error) throw error;
    return data;
  },
  async findByUserId(user_id: string) {
    const { data, error } = await supabase.from('students').select('*').eq('user_id', user_id).maybeSingle();
    if (error) throw error;
    return data;
  }
  ,
  async listAll() {
    const { data, error } = await supabase.from('students').select('*').order('register_number', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  ,
  async findById(id: string) {
    const { data, error } = await supabase.from('students').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async findByRegisterNumber(register_number: string) {
    const { data, error } = await supabase.from('students').select('*').eq('register_number', register_number).maybeSingle();
    if (error) throw error;
    return data;
  },
  async update(id: string, payload: any) {
    const { data, error } = await supabase.from('students').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
  async remove(id: string) {
    const { data, error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
    return data;
  }
};
