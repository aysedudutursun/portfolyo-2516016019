import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import BulguFormu from '@/components/BulguFormu';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Bulguyu düzenle' };

export default async function BulguDuzenle({ params }) {
  await requireAdmin();
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) notFound();

  const [bulgu] = await sql`
    SELECT id, baslik, lab_ortami, cvss, durum, kategori_id, yayinda,
           to_char(bulunma_tarihi, 'YYYY-MM-DD') AS bulunma_tarihi
    FROM guvenlik_bulgulari WHERE id = ${id}`;
  if (!bulgu) notFound();
  const kategoriler = await sql`SELECT id, ad FROM zafiyet_turleri ORDER BY ad`;

  return (
    <>
      <p><a href="/admin/guvenlik-bulgulari">← Bulgulara dön</a></p>
      <div className="kutu">
        <h1>Bulguyu düzenle (#{bulgu.id})</h1>
        <BulguFormu kategoriler={kategoriler} bulgu={bulgu} />
      </div>
    </>
  );
}
