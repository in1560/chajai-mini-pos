// app/history/page.js — ประวัติการขาย (อ่านจากตาราง sales)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sales')
      .select('id, product_name, quantity, total_price, created_at')
      .order('created_at', { ascending: false }); // ล่าสุดขึ้นก่อน

    if (error) {
      console.error('โหลดประวัติการขายไม่สำเร็จ:', error);
    } else {
      setSales(data || []);
    }
    setIsLoading(false);
  }

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_price), 0);

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>ประวัติการขาย — ชาใจ</h1>
        <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
          <Link href="/">สินค้า</Link>
          <Link href="/sell">ขายสินค้า</Link>
        </nav>
      </div>
      <p style={{ color: '#777', marginTop: 0 }}>
        รวมทั้งหมด {sales.length} รายการ — ยอดขายรวม {totalRevenue.toLocaleString('th-TH')} บาท
      </p>

      {isLoading && <p>กำลังโหลด...</p>}
      {!isLoading && sales.length === 0 && <p>ยังไม่มีประวัติการขาย</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '0.5rem' }}>เวลา</th>
            <th style={{ padding: '0.5rem' }}>สินค้า</th>
            <th style={{ padding: '0.5rem', textAlign: 'right' }}>จำนวน</th>
            <th style={{ padding: '0.5rem', textAlign: 'right' }}>ราคารวม</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                {new Date(s.created_at).toLocaleString('th-TH', {
                  timeZone: 'Asia/Bangkok',
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </td>
              <td style={{ padding: '0.5rem' }}>{s.product_name}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>{s.quantity} ชิ้น</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                {Number(s.total_price).toLocaleString('th-TH')} บาท
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
