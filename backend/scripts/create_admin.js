#!/usr/bin/env node
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in environment.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Simple CLI args parser to avoid external dependency
  const rawArgs = process.argv.slice(2);
  const argv = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const a = rawArgs[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = rawArgs[i + 1];
      if (next && !next.startsWith('-')) {
        argv[key] = next;
        i++;
      } else {
        argv[key] = true;
      }
    } else if (a.startsWith('-')) {
      const key = a.slice(1);
      const next = rawArgs[i + 1];
      if (next && !next.startsWith('-')) {
        argv[key] = next;
        i++;
      } else {
        argv[key] = true;
      }
    }
  }

  const name = argv.name || argv.n || 'Admin User';
  const email = argv.email || argv.e;
  const password = argv.password || argv.p || 'AdminPass123';

  if (!email) {
    console.error('Usage: node scripts/create_admin.js --email admin@example.com [--name "Admin"] [--password "pass"]');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').insert([
      { name, email, password_hash: hash, role: 'admin' }
    ]).select('*').single();

    if (error) {
      console.error('Error inserting admin:', error.message || error);
      process.exit(1);
    }

    console.log('Admin created:', { id: data.id, email: data.email, name: data.name });
  } catch (err) {
    console.error('Unexpected error:', err.message || err);
    process.exit(1);
  }
}

main();
