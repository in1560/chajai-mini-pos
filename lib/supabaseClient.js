// lib/supabaseClient.js
//
// Supabase client กลาง — ทุกหน้า (product list / sell / history) import จากที่นี่ที่เดียว
// ห้ามสร้าง createClient() ซ้ำในไฟล์อื่นอีก เพื่อให้ config อยู่จุดเดียว แก้ทีเดียวจบ

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
