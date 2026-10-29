import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { tarihSaat } from '@/lib/bicim';

export const dynamic = 'force-dynamic';

export default async function AdminAnaSayfa() {
  const admin = await requireAdmin();

  // COUNT ile sayılar
  const [okunmamis] = await sql`SELECT COUNT(*)::int AS sayi FROM iletisim_mesajlari WHERE okundu = false`;
  const [bulgu] = await sql`SELECT COUNT(*)::int AS sayi FROM guvenlik_bulgulari`;
  const [yayinda] = await sql`SELECT COUNT(*)::int AS sayi FROM guvenlik_bulgulari WHERE yayinda = true`;

  return (
    <>
      <h1>Merhaba 👋</h1>
      <p className="mut">
        Son başarılı giriş: <strong>{tarihSaat(admin.son_giris)}</strong>, IP: <strong>{admin.son_giris_ip || '—'}</strong>
      </p>

      <div className="sayilar">
        <div className="kutu sayi">
          <b>{okunmamis.sayi}</b>
          okunmamış mesaj<br /><a href="/admin/mesajlar">Mesajlara git →</a>
        </div>
        <div className="kutu sayi">
          <b>{bulgu.sayi}</b>
          güvenlik bulgusu ({yayinda.sayi} tanesi yayında)<br /><a href="/admin/guvenlik-bulgulari">Bulgulara git →</a>
        </div>
      </div>

      <p className="mut" style={{ fontSize: 14 }}>
        Güvenlik notu: 30 dakika işlem yapmazsanız oturumunuz kendiliğinden kapanır. Açık oturumlarınızı
        <a href="/admin/oturumlar"> Oturumlar</a> sayfasından görüp kapatabilirsiniz.
      </p>
    </>
  );
}
