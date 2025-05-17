import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://qtavtrnrevqvjytklpsb.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXZ0cm5yZXZxdmp5dGtscHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjM5OTcsImV4cCI6MjA2MjQ5OTk5N30.9PBunJ6CmoOKz_dufo3lq7rm6qBVn0_EljXI1VjpyQI';

console.log('[SUPABASE] Initializing client with URL:', supabaseUrl);

// Create the client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'eco-waste-hub'
    }
  }
});

let lastConnectionTest = 0;
const CONNECTION_TEST_INTERVAL = 5000; // 5 seconds

// Function to test the connection using direct REST API
export const testSupabaseConnection = async () => {
  const now = Date.now();
  
  // If we've tested recently, return the last result
  if (now - lastConnectionTest < CONNECTION_TEST_INTERVAL) {
    console.log('[SUPABASE] Using cached connection test result');
    return { success: true };
  }

  lastConnectionTest = now;
  
  try {
    console.log('[SUPABASE] Testing connection...');
    
    // First, test basic connectivity with REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=count&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SUPABASE] REST API test failed:', errorText);
      return { success: false, error: new Error(`REST API test failed: ${response.status} ${response.statusText}`) };
    }

    // Then, test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('[SUPABASE] Auth check failed:', authError);
      return { success: false, error: authError };
    }

    // Finally, test database access with the user's session token
    const { data: dbData, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .maybeSingle();

    if (dbError) {
      console.error('[SUPABASE] Database test failed:', dbError);
      return { success: false, error: dbError };
    }

    // Test products table access
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
      .maybeSingle();

    if (productsError) {
      console.error('[SUPABASE] Products table test failed:', productsError);
      return { success: false, error: productsError };
    }

    console.log('[SUPABASE] Connection test successful');
    return { success: true };
  } catch (err) {
    console.error('[SUPABASE] Unexpected error during connection test:', err);
    return { success: false, error: err };
  }
};

// Run the initial connection test
testSupabaseConnection().then(result => {
  if (result.success) {
    console.log('[SUPABASE] Initial connection test passed');
  } else {
    console.error('[SUPABASE] Initial connection test failed:', result.error);
  }
}); 