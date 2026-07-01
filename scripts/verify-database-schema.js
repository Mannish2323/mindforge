import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Required Database Tables and domains from Document 3
// Maps domain name to list of required tables.
// Each table entry has:
//   name: table name from Document 3
//   aliases: alternative table names already in schema providing equivalent functionality
const databaseDomains = {
  "Identity": [
    { name: "profiles" },
    { name: "user_settings" },
    { name: "user_preferences" },
    { name: "user_roles", aliases: ["admin_roles"] },
    { name: "subscriptions", aliases: ["entitlements"] },
    { name: "devices" },
    { name: "sessions" }
  ],
  "Learning": [
    { name: "courses" },
    { name: "modules" },
    { name: "lessons" },
    { name: "lesson_sections" },
    { name: "vocabulary" },
    { name: "grammar_topics", aliases: ["grammar"] },
    { name: "kanji" },
    { name: "dialogues" },
    { name: "reading_lessons" },
    { name: "listening_lessons" },
    { name: "speaking_lessons" },
    { name: "writing_lessons" }
  ],
  "Practice": [
    { name: "quizzes" },
    { name: "quiz_questions" },
    { name: "quiz_attempts" },
    { name: "review_queue" },
    { name: "writing_sessions", aliases: ["writing_history", "writing_mastery"] },
    { name: "speaking_sessions" }
  ],
  "Progress": [
    { name: "course_progress" },
    { name: "module_progress" },
    { name: "lesson_progress" },
    { name: "vocabulary_progress", aliases: ["vocab_progress"] },
    { name: "grammar_progress" },
    { name: "kanji_progress" },
    { name: "writing_progress" },
    { name: "speaking_progress" },
    { name: "reading_progress" },
    { name: "listening_progress" },
    { name: "achievements", aliases: ["user_badges", "badges"] },
    { name: "bookmarks" }
  ],
  "Sakura AI": [
    { name: "ai_conversations" },
    { name: "ai_messages", aliases: ["ai_chat_messages"] },
    { name: "ai_recommendations" },
    { name: "ai_usage_logs", aliases: ["usage_log", "usage_counters"] }
  ],
  "Community": [
    { name: "posts" },
    { name: "comments" },
    { name: "reactions" },
    { name: "friendships" },
    { name: "leaderboard_snapshots" }
  ],
  "Premium": [
    { name: "subscription_plans" },
    { name: "orders" },
    { name: "payments", aliases: ["payment_history"] },
    { name: "invoices" },
    { name: "feature_entitlements" }
  ],
  "Notifications": [
    { name: "notifications" },
    { name: "notification_preferences" },
    { name: "notification_history" }
  ],
  "Analytics": [
    { name: "analytics_events", aliases: ["activity_logs"] },
    { name: "lesson_logs" },
    { name: "ai_logs" },
    { name: "payment_logs" },
    { name: "crash_reports" }
  ],
  "Administration": [
    { name: "admin_users", aliases: ["admin_roles"] },
    { name: "admin_logs", aliases: ["admin_audit_logs"] },
    { name: "content_reviews" },
    { name: "moderation_reports" }
  ]
};

console.log('🌸 Starting Learning Velmorth Database Schema Verification...\n');

// 1. Gather all SQL contents
const sqlFiles = [];
const supabaseDir = path.join(rootDir, 'supabase');

if (fs.existsSync(path.join(supabaseDir, 'schema.sql'))) {
  sqlFiles.push(path.join(supabaseDir, 'schema.sql'));
}

const migrationsDir = path.join(supabaseDir, 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  for (const m of migrations) {
    sqlFiles.push(path.join(migrationsDir, m));
  }
}

// Read and concatenate all SQL definitions
let combinedSql = '';
for (const file of sqlFiles) {
  combinedSql += fs.readFileSync(file, 'utf8') + '\n';
}

// Clean comments and whitespace to ease regex parsing
const cleanSql = combinedSql
  .replace(/--.*$/gm, '') // remove line comments
  .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
  .toLowerCase();

// Function to check if a table is created in SQL definitions
function isTableDefined(tableName) {
  // Regex matches "create table [if not exists] [public.]table_name"
  const regex = new RegExp(`create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?(?:public\\.)?${tableName}\\b`, 'i');
  return regex.test(cleanSql);
}

// 2. Perform the verification
let overallSuccess = true;
let totalChecked = 0;
let totalPassed = 0;

for (const [domain, tables] of Object.entries(databaseDomains)) {
  console.log(`\n📂 Domain: ${domain}`);
  console.log('--------------------------------------------------');
  
  for (const table of tables) {
    totalChecked++;
    let defined = isTableDefined(table.name);
    let matchedName = table.name;
    let isAlias = false;

    // If not directly defined, check its aliases
    if (!defined && table.aliases) {
      for (const alias of table.aliases) {
        if (isTableDefined(alias)) {
          defined = true;
          matchedName = alias;
          isAlias = true;
          break;
        }
      }
    }

    if (defined) {
      totalPassed++;
      if (isAlias) {
        console.log(`\x1b[36m[ALIAS MATCH]\x1b[0m ${table.name} (implemented as '${matchedName}')`);
      } else {
        console.log(`\x1b[32m[OK]\x1b[0m          ${table.name}`);
      }
    } else {
      console.log(`\x1b[31m[MISSING]\x1b[0m     ${table.name}`);
      overallSuccess = false;
    }
  }
}

console.log('\n--------------------------------------------------');
console.log(`Verification Summary: ${totalPassed} / ${totalChecked} Tables Verified`);

if (overallSuccess) {
  console.log('\n✅ Success: All database domains and tables from Document 3 are fully satisfied!');
  process.exit(0);
} else {
  console.error('\n❌ Error: Some required database tables are missing from migrations.');
  process.exit(1);
}
