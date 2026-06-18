import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let serviceRoleKey = '';

for (const line of envLines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || !trimmed) continue;
  const parts = trimmed.split('=');
  const key = parts[0].trim();
  const val = parts.slice(1).join('=').trim();
  
  if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
    supabaseUrl = val;
  }
  if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
    serviceRoleKey = val;
  }
}

console.log('URL:', supabaseUrl);
console.log('Key length:', serviceRoleKey?.length);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  console.log('\n--- Fetching profiles ---');
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    console.log('Profiles:', data);
    console.log('Error:', error);
  } catch (err) {
    console.error('Profiles Catch Error:', err);
  }

  console.log('\n--- Fetching auth users list ---');
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (data && data.users) {
      console.log('Users found:', data.users.length);
      for (const u of data.users) {
        console.log(`- ID: ${u.id}, Email: ${u.email}, Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'}`);
      }
    } else {
      console.log('No data or users:', data);
    }
    console.log('Error:', error);
  } catch (err) {
    console.error('Auth Users Catch Error:', err);
  }
}

run();
