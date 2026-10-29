import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { tarihSaat } from '@/lib/bicim';
import { mesajOkunduDegistir, mesajSil } from '../actions';
import OnayliButon from '@/components/OnayliButon';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mesajlar' };

export default async function MesajlarSayfasi() {
  await requireAdmin();
  // Yeniden eskiye
  const mesajlar = await sql`
    SELECT id, ad_soyad, eposta, mesaj, kvkk_onay, okundu, gonderim_zamani
    FROM iletisim_mesajlari
    ORDER BY gonderim_zamani DESC`;
  const okunmamis = mesajlar.filter((m) => !m.okundu).length;

  return (
    <>
      <h1>İletişim mesajları</h1>
      <p className="mut">{mesajlar.length} mesaj, {okunmamis} tanesi okunmamış.</p>

      {mesajlar.length === 0 && <p className="kutu mut">Henüz mesaj yok.</p>}

      {mesajlar.map((m) => (
        <article key={m.id} className={'kutu mesaj' + (m.okundu ? '' : ' okunmamis')}>
          <div className="bas">
            <div>
              <strong>{m.ad_soyad}</strong> · <a href={`mailto:${m.eposta}`}>{m.eposta}</a>
              {!m.okundu && <> <span className="rozet yeni">yeni</span></>}
            </div>
            <span className="mut" style={{ fontSize: 13 }}>{tarihSaat(m.gonderim_zamani)}</span>
          </div>
          <p>{m.mesaj}</p>
          <div className="islem">
            <form action={mesajOkunduDegistir}>
              <input type="hidden" name="id" value={m.id} />
              <button className="btn kucuk" type="submit">{m.okundu ? 'Okunmadı yap' : 'Okundu işaretle'}</button>
            </form>
            <form action={mesajSil}>
              <input type="hidden" name="id" value={m.id} />
              <OnayliButon soru="Bu mesaj kalıcı olarak silinsin mi?">Sil</OnayliButon>
            </form>
            <span className="mut" style={{ fontSize: 12, alignSelf: 'center' }}>
              KVKK onayı: {m.kvkk_onay ? 'verildi' : 'yok'}
            </span>
          </div>
        </article>
      ))}
    </>
  );
}
