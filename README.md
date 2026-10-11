# ชาใจ Mini POS

ระบบขายสินค้า (POS) สำหรับแบรนด์ชาใจ — ตัดสต๊อกใน Supabase อัตโนมัติ พร้อมแจ้งเตือนเข้า Telegram ทันทีหลังขายสำเร็จ

ทำ Week 8 (Mini POS) และ Week 9 (Telegram Alert) พร้อมกันในชุดเดียว เพราะยังไม่เคยมี Mini POS มาก่อน

## โครงสร้างไฟล์

```
app/
  layout.js           ← root layout บังคับของ Next.js
  page.js             ← หน้ารายการสินค้า (/)
  sell/page.js         ← หน้าขายสินค้า (/sell) — ตัดสต๊อก + log + แจ้งเตือน Telegram
  history/page.js      ← หน้าประวัติการขาย (/history)
lib/
  supabaseClient.js    ← Supabase client กลาง ใช้ร่วมกันทุกหน้า
  telegram.js          ← ฟังก์ชันยิงข้อความแจ้งเตือนเข้า Telegram
supabase/
  schema.sql           ← สร้างตาราง products + sales พร้อม seed สินค้าชาใจ 10 รายการ
.env.local.example     ← ตัวอย่างค่า environment variables (คัดลอกเป็น .env.local)
```

## ขั้นตอนติดตั้ง

### 1. สร้างตารางใน Supabase

เปิด Supabase Dashboard ของโปรเจกต์ "ชาใจ" → SQL Editor → วางเนื้อหาจาก `supabase/schema.sql` ทั้งหมด → กด Run

จะได้ตาราง `products` (มีสินค้าชาใจ 10 รายการพร้อมสต๊อกตั้งต้น) และตาราง `sales` (ว่างไว้รอบันทึกประวัติ)

### 2. สร้าง repo บน GitHub

สร้าง repo ใหม่ชื่อ `chajai-mini-pos` (หรือชื่ออื่นตามสะดวก) แล้วอัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้นไป

### 3. Deploy บน Vercel

เชื่อม repo นี้เข้า Vercel แบบเดียวกับที่เคยทำกับเว็บ Landing Page ก่อนหน้านี้ (New Project → Import จาก GitHub)

### 4. ตั้งค่า Environment Variables บน Vercel

เข้า Vercel → โปรเจกต์นี้ → Settings → Environment Variables → เพิ่มทั้ง 4 ตัวตาม `.env.local.example`:

| Key | ค่า |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | จาก Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | จาก Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` | Token บอท (⚠️ ควร Revoke token เดิมแล้วขอใหม่ก่อนใช้จริง เพราะเคยพิมพ์ในแชทมาแล้ว) |
| `NEXT_PUBLIC_TELEGRAM_CHAT_ID` | `-1004497747710` |

ตั้งค่าเสร็จแล้วไปที่ Deployments → Redeploy เพื่อให้ค่าใหม่มีผล

### 5. เตรียม Telegram Channel

- บอท `@my_mini_pos_12034_bot` ต้องถูกเพิ่มเป็น **Admin** ของ channel ที่ chat id `-1004497747710` และต้องให้สิทธิ์ **Post Messages** ไว้แล้ว ก่อนทดสอบ

### 6. ทดสอบระบบจริง

1. เปิดเว็บที่ deploy ไว้ ไปหน้า `/sell`
2. เลือกสินค้า 1 รายการ ใส่จำนวน กดขาย
3. เช็คว่า `/` (สต๊อก) และ `/history` (ประวัติ) อัปเดตถูกต้อง
4. เช็คว่า Telegram channel ได้รับข้อความ "🛍️ มีรายการขายใหม่!"
5. ขายซ้ำจนสต๊อกสินค้าใดสินค้าหนึ่งเหลือ ≤ 5 ชิ้น → ต้องเห็นข้อความ "🚨 [เตือนภัย] สต๊อกสินค้าใกล้หมด!" ตามมาอีกข้อความ

## หมายเหตุด้านความปลอดภัย

`NEXT_PUBLIC_` ทำให้ค่าถูกฝังไปในโค้ดฝั่ง browser ได้ (ใครก็เปิด DevTools ดู Bot Token ได้) เหมาะกับงานสาธิตในคลาสเท่านั้น ถ้าจะใช้งานจริงแนะนำย้ายการยิง Telegram ไปทำผ่าน Next.js API Route (`app/api/notify/route.js`) แทน
