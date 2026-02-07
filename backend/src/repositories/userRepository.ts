import { supabase } from '../config/supabase';

export const userRepository = {
  async create(payload: any) {
    const { data, error } = await supabase.from('users').insert([payload]).select('*').single();
    if (error) throw error;
    return data;
  },
  async findByEmail(email: string) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
  }
  ,
  async findById(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  }
  ,
  async update(id: string, payload: any) {
    const { data, error } = await supabase.from('users').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { data, error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return data;
  }
};
