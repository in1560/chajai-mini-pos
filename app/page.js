// app/page.js — หน้ารายการสินค้า (ดูอย่างเดียว ไม่ได้ขาย)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const MOOD_LABELS = {
  fresh: 'สดชื่น',
  relax: 'ผ่อนคลาย',
  focus: 'โฟกัส',
  romance: 'โรแมนติก'
};

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, mood, price, stock')
      .order('mood', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('โหลดรายการสินค้าไม่สำเร็จ:', error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>สินค้า — ชาใจ</h1>
        <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
          <Link href="/sell">ขายสินค้า</Link>
          <Link href="/history">ประวัติการขาย</Link>
        </nav>
      </div>
      <p style={{ color: '#777', marginTop: 0 }}>รายการสินค้าและสต๊อกคงเหลือปัจจุบัน</p>

      {isLoading && <p>กำลังโหลด...</p>}

      {!isLoading && products.length === 0 && (
        <p>ยังไม่มีสินค้าในระบบ — รัน <code>supabase/schema.sql</code> ก่อน</p>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '0.5rem' }}>กลิ่น</th>
            <th style={{ padding: '0.5rem' }}>สินค้า</th>
            <th style={{ padding: '0.5rem', textAlign: 'right' }}>ราคา</th>
            <th style={{ padding: '0.5rem', textAlign: 'right' }}>สต๊อก</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{MOOD_LABELS[p.mood] || p.mood}</td>
              <td style={{ padding: '0.5rem' }}>{p.name}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                {Number(p.price).toLocaleString('th-TH')} บาท
              </td>
              <td
                style={{
                  padding: '0.5rem',
                  textAlign: 'right',
                  color: p.stock <= 5 ? '#c0392b' : 'inherit',
                  fontWeight: p.stock <= 5 ? 'bold' : 'normal'
                }}
              >
                {p.stock} ชิ้น
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
