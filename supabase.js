// supabase.js
// Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your Supabase project credentials
// For production, use environment variables instead of hardcoding
const SUPABASE_URL = 'https://ynvhluadxmsjoihdjmky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE';

// Create and export the client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);