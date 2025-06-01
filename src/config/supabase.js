import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puoscoaltsznczqdfjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b3Njb2FsdHN6bmN6cWRmamgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjE2NjM1NCwiZXhwIjoyMDUxNzQyMzU0fQ.VQqYqHrCdlrMTpdjj0bniJF4e8t2OtYr0gWjx76K8gY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});