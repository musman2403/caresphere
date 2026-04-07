import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgcepqktrhmuuabqqbsp.supabase.co';
const supabaseKey = 'sb_publishable_a5GzMp5gycCMKI_BRI5GMA_9rBkog7e';
export const supabase = createClient(supabaseUrl, supabaseKey);
