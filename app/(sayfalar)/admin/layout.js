import { requireAdmin } from '@/lib/auth';
import { cikisYap } from '../giris/actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Yönetim paneli' };

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="ust">
        <div className="ic">
          <b>ADT · Panel</b>
          <nav aria-label="Panel menüsü">
            <a href="/admin">Özet</a>
            <a href="/admin/guvenlik-bulgulari">Güvenlik bulguları</a>
            <a href="/admin/mesajlar">Mesajlar</a>
            <a href="/admin/oturumlar">Oturumlar</a>
            <a href="/" target="_blank" rel="noopener">Siteyi gör ↗</a>
          </nav>
          <span className="kim">{admin.eposta}</span>
          <form action={cikisYap}><button className="btn kucuk ikincil" type="submit">Çıkış</button></form>
        </div>
      </header>
      <main className="ana">{children}</main>
    </>
  );
}
