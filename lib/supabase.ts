
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgbjydfgxbarttitnvxe.supabase.co'; 

// আপনার প্রদান করা আসল anon public key এখানে বসানো হলো
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYmp5ZGZneGJhcnR0aXRudnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDc4ODcsImV4cCI6MjA4NjM4Mzg4N30.6tC4KyrfHkXicfWgPzLLeHEDi0-GzDICu-PlsVO2Cdc'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
