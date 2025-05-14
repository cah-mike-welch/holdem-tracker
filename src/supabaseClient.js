import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aiulviseithhgygvzuzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWx2aXNlaXRoaGd5Z3Z6dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzk3MjEsImV4cCI6MjA2Mjc1NTcyMX0.UyX5I3q0oimiRBAKMut9DtkogHOq2WUbNTkugMaMBIk';

export const supabase = createClient(supabaseUrl, supabaseKey);
