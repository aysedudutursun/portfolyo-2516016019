import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { bulguSil, bulguYayinDegistir } from '../actions';
import BulguFormu from '@/components/BulguFormu';
import OnayliButon from '@/components/OnayliButon';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Güvenlik bulguları' };

export default async function BulgularSayfasi() {
  await requireAdmin();

  // JOIN: her bulgunun yanında kategori (zafiyet türü) adı
  const bulgular = await sql`
    SELECT b.id, b.baslik, b.lab_ortami, b.cvss, b.durum, b.yayinda,
           to_char(b.bulunma_tarihi, 'DD.MM.YYYY') AS tarih,
           z.ad AS kategori
    FROM guvenlik_bulgulari b
    LEFT JOIN zafiyet_turleri z ON z.id = b.kategori_id
    ORDER BY b.bulunma_tarihi DESC NULLS LAST, b.id DESC`;
  const kategoriler = await sql`SELECT id, ad FROM zafiyet_turleri ORDER BY ad`;

  return (
    <>
      <h1>Güvenlik Laboratuvarı Bulgularım</h1>
      <p className="mut">{bulgular.length} kayıt. Soluk satırlar sitede yayında değil.</p>

      <div className="tablo-kap">
        <table>
          <thead>
            <tr><th>#</th><th>Başlık</th><th>Tür</th><th>CVSS</th><th>Durum</th><th>Tarih</th><th>Yayın</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            {bulgular.map((b) => (
              <tr key={b.id} className={b.yayinda ? '' : 'soluk'}>
                <td>{b.id}</td>
                <td>{b.baslik}{b.lab_ortami && <div className="mut" style={{ fontSize: 12 }}>{b.lab_ortami}</div>}</td>
                <td>{b.kategori || '—'}</td>
                <td>{b.cvss ?? '—'}</td>
                <td>{b.durum ? <span className={'rozet ' + (b.durum === 'açık' ? 'acik' : 'kapali')}>{b.durum}</span> : '—'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{b.tarih || '—'}</td>
                <td>
                  <form action={bulguYayinDegistir}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="btn kucuk ikincil" type="submit">
                      {b.yayinda ? 'Yayında ✓' : 'Yayında değil'}
                    </button>
                  </form>
                </td>
                <td>
                  <div className="islem">
                    <a className="btn kucuk" href={`/admin/guvenlik-bulgulari/${b.id}`}>Düzenle</a>
                    <form action={bulguSil}>
                      <input type="hidden" name="id" value={b.id} />
                      <OnayliButon soru={`"${b.baslik}" silinsin mi? Bu işlem geri alınamaz.`}>Sil</OnayliButon>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {bulgular.length === 0 && <tr><td colSpan={8} className="mut">Henüz kayıt yok.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bosluk" />
      <div className="kutu">
        <h2>Yeni kayıt ekle</h2>
        <BulguFormu kategoriler={kategoriler} />
      </div>
    </>
  );
}
