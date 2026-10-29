'use server';
// İletişim formu: alanlar SUNUCUDA da kontrol edilir (tarayıcıdaki kontroller atlatılabilir).
import { sql } from '@/lib/db';

const SINIR = { ad: 100, eposta: 200, mesaj: 2000 };
const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function mesajGonder(oncekiDurum, formData) {
  const ad_soyad = String(formData.get('ad_soyad') || '').trim();
  const eposta = String(formData.get('eposta') || '').trim();
  const mesaj = String(formData.get('mesaj') || '').trim();
  const kvkk_onay = formData.get('kvkk_onay') === 'on';
  const tuzak = String(formData.get('web_sitesi') || ''); // botlar için gizli alan
  const degerler = { ad_soyad, eposta, mesaj, kvkk_onay };

  const hatalar = {};
  if (!ad_soyad) hatalar.ad_soyad = 'Ad soyad boş bırakılamaz.';
  else if (ad_soyad.length > SINIR.ad) hatalar.ad_soyad = `En fazla ${SINIR.ad} karakter olabilir.`;

  if (!eposta) hatalar.eposta = 'E-posta boş bırakılamaz.';
  else if (eposta.length > SINIR.eposta || !EPOSTA_DESENI.test(eposta)) hatalar.eposta = 'Geçerli bir e-posta adresi yazın.';

  if (!mesaj) hatalar.mesaj = 'Mesaj boş bırakılamaz.';
  else if (mesaj.length > SINIR.mesaj) hatalar.mesaj = `Mesaj en fazla ${SINIR.mesaj} karakter olabilir (şu an ${mesaj.length}).`;

  if (!kvkk_onay) hatalar.kvkk_onay = 'Devam etmek için aydınlatma metnini onaylamanız gerekir.';

  if (Object.keys(hatalar).length) return { hatalar, degerler };

  // Bot gizli alanı doldurduysa sessizce başarılı göster ama kaydetme
  if (tuzak) return { tamam: true };

  await sql`
    INSERT INTO iletisim_mesajlari (ad_soyad, eposta, mesaj, kvkk_onay)
    VALUES (${ad_soyad}, ${eposta}, ${mesaj}, ${kvkk_onay})`;

  return { tamam: true };
}
