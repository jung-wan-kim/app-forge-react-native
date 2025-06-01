import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puoscoaltsznczqdfjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b3Njb2FsdHN6bmN6cWRkZmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NzE1NDgsImV4cCI6MjA2NDM0NzU0OH0.0UwKb9Ds32Wzw9P5WtB-hjru2q-_3SPnAbr8cKQ7oIY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);