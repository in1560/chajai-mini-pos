// app/layout.js — root layout บังคับของ Next.js App Router
export const metadata = {
  title: 'ชาใจ Mini POS',
  description: 'ระบบขายสินค้า ชาใจ'
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
