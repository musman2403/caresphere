import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mgcepqktrhmuuabqqbsp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_a5GzMp5gycCMKI_BRI5GMA_9rBkog7e';
export const supabase = createClient(supabaseUrl, supabaseKey);
