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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const email = 'test_delete_flow@gmail.com';
  const password = 'Password123!';

  console.log(`\n--- Creating user ${email} ---`);
  
  // Try to delete first in case it exists
  try {
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email === email);
    if (existingUser) {
      console.log('User already exists, deleting first...');
      await supabase.auth.admin.deleteUser(existingUser.id);
      console.log('Deleted existing user.');
    }
  } catch (e) {
    console.error('Error cleaning up:', e);
  }

  // Create user
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email!
      user_metadata: { username: 'delete_tester', full_name: 'Delete Tester' }
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created and confirmed successfully:', data.user.id);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

run();
