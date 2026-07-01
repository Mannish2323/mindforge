// src/lib/rls.ts

/** Helper to generate Row Level Security (RLS) policies */
export const rlsPolicy = (table: string, role: string, condition: string) => {
  return `CREATE POLICY ${role}_${table}_policy ON ${table} FOR ALL TO ${role} USING (${condition});`;
};

// Example usage (to be used in migrations):
// const policy = rlsPolicy('profiles', 'authenticated', 'auth.uid() = id');
