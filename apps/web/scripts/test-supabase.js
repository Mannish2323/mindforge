import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let supabaseKey = '';

for (const line of envLines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || !trimmed) continue;
  const parts = trimmed.split('=');
  const key = parts[0].trim();
  const val = parts.slice(1).join('=').trim();
  
  if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
    supabaseUrl = val;
  }
  if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    supabaseKey = val;
  }
}

console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey?.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('\n--- Test 1: Login with non-existent email ---');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nonexistent_test_12345_6789@gmail.com',
      password: 'Password123!',
    });
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err) {
    console.error('Catch Error:', err);
  }

  console.log('\n--- Test 2: Signup with example.com email ---');
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test_example_auth@example.com',
      password: 'Password123!',
    });
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

runTests();
