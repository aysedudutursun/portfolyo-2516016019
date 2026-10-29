import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { tarihSaat, cihazAdi } from '@/lib/bicim';
import { oturumKapat, digerOturumlariKapat } from '../actions';
import OnayliButon from '@/components/OnayliButon';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Oturumlar' };

export default async function OturumlarSayfasi() {
  const admin = await requireAdmin();

  // Bu yöneticinin hâlâ geçerli olan oturumları.
  // Token'ın kendisi sayfaya gönderilmez; yalnızca md5 özetinin ilk 12 karakteri (kimlik).
  const oturumlar = await sql`
    SELECT left(md5(token), 12) AS kimlik, cihaz, son_aktivite, bitis,
           (token = ${admin.token}) AS bu_oturum
    FROM oturumlar
    WHERE yonetici_id = ${admin.id}
      AND bitis > now()
      AND son_aktivite > now() - interval '30 minutes'
    ORDER BY son_aktivite DESC`;
  const digerSayisi = oturumlar.filter((o) => !o.bu_oturum).length;

  return (
    <>
      <h1>Açık oturumlar</h1>
      <p className="mut">
        30 dakika işlem yapılmayan oturum kendiliğinden kapanır; her oturum en fazla 2 saat geçerlidir.
        Tanımadığınız bir cihaz görürseniz kapatın ve şifrenizi değiştirin.
      </p>

      <div className="tablo-kap">
        <table>
          <thead><tr><th>Cihaz</th><th>Son aktivite</th><th>Bitiş</th><th></th></tr></thead>
          <tbody>
            {oturumlar.map((o) => (
              <tr key={o.kimlik}>
                <td>
                  <strong>{cihazAdi(o.cihaz)}</strong>
                  {o.bu_oturum && <> <span className="rozet yayin">bu cihaz</span></>}
                  <div className="mut" style={{ fontSize: 12, overflowWrap: 'anywhere' }}>{o.cihaz}</div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{tarihSaat(o.son_aktivite)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{tarihSaat(o.bitis)}</td>
                <td>
                  {!o.bu_oturum && (
                    <form action={oturumKapat}>
                      <input type="hidden" name="kimlik" value={o.kimlik} />
                      <button className="btn tehlike kucuk" type="submit">Kapat</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bosluk" />
      <form action={digerOturumlariKapat}>
        <OnayliButon className="btn tehlike" soru="Bu cihaz dışındaki bütün oturumlar kapatılsın mı?">
          Diğer tüm oturumları kapat ({digerSayisi})
        </OnayliButon>
      </form>
    </>
  );
}
