/**
 * Supabase Client - Professional Setup
 * Frontend (React) me use karne ke liye
 * URL: https://ynvhluadxmsjoihdjmky.supabase.co
 * Anon Key: Public key only
 */

import { createClient } from '@supabase/supabase-js'

// ✅ Supabase URL and Anon Key
const SUPABASE_URL = 'https://ynvhluadxmsjoihdjmky.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE'

// 🎨 Supabase Client Initialization
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Example Utility Functions for Reuse
 */

// ✅ Get current logged-in user
export const getCurrentUser = () => supabase.auth.user()

// ✅ Sign up new user
export const signUpUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// ✅ Sign in existing user
export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ✅ Sign out user
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ✅ Listen to auth state changes
export const onAuthStateChange = (callback) => {
  supabase.auth.onAuthStateChange(callback)
}

// ✅ Real-time subscription helper
export const subscribeToTable = (tableName, eventType = 'INSERT', callback) => {
  return supabase
    .from(tableName)
    .on(eventType, callback)
    .subscribe()
}

// ✅ Styled console log for dev
export const logSupabase = (message, data) => {
  console.log(`%c[Supabase] ${message}`, 'color: #4CAF50; font-weight: bold;', data)
}