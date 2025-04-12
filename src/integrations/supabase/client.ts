/**
 * Supabase client configuration
 * Uses environment variables for API keys to enhance security
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Fallback values for local development only - DO NOT use in production
const FALLBACK_URL = 'https://cndgtyzjwjlelglieoyf.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZGd0eXpqd2psZWxnbGllb3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDYzMzgsImV4cCI6MjA1Njg4MjMzOH0.CbHswVdSYfKw6a6mKd9sQuAcxfqA6DQdoOebqe7bzQc';

// Get Supabase credentials from environment variables
// Support both Vite and React Native environment variable formats
let SUPABASE_URL;
let SUPABASE_ANON_KEY;

// Check for Vite environment variables
if (typeof import.meta !== 'undefined' && import.meta.env) {
  SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Vite env detected:', { 
    url: SUPABASE_URL ? 'Found' : 'Not found', 
    key: SUPABASE_ANON_KEY ? 'Found' : 'Not found' 
  });
}

// If not found in Vite env, check for React Native env
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // For React Native, process.env would be used
  if (typeof process !== 'undefined' && process.env) {
    SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
    SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    console.log('React Native env detected:', { 
      url: SUPABASE_URL ? 'Found' : 'Not found', 
      key: SUPABASE_ANON_KEY ? 'Found' : 'Not found' 
    });
  }
}

// Use fallback values if environment variables are still not found
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Using fallback Supabase credentials. This should only happen in development.'
  );
  SUPABASE_URL = FALLBACK_URL;
  SUPABASE_ANON_KEY = FALLBACK_KEY;
}

console.log('Initializing Supabase client with:', { 
  url: SUPABASE_URL?.substring(0, 15) + '...', 
  keyLength: SUPABASE_ANON_KEY?.length 
});

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);