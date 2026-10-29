// Oturum (session) yönetimi: giriş, kontrol, çıkış.
//
// Akış:
//  1) Girişte rastgele bir token üretilir, "oturumlar" tablosuna 2 saat geçerli olarak yazılır
//     ve tarayıcıya httpOnly bir çerez olarak verilir.
//  2) Her /admin sayfası ve her Server Action, getAdmin() ile çerezdeki token'ı tabloda arar.
//     Token yoksa, süresi (bitis) dolmuşsa veya 30 dakikadır işlem yapılmamışsa oturum geçersizdir.
//  3) Çıkışta satır tablodan silinir ve çerez temizlenir.
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'node:crypto';
import { sql } from './db';

export const CEREZ_ADI = 'oturum';
export const OTURUM_SURESI_SN = 2 * 60 * 60; // 2 saat

// Çerez ayarları:
//  httpOnly  → JavaScript (document.cookie) çerezi okuyamaz; XSS ile token çalınamaz.
//  secure    → çerez yalnızca HTTPS üzerinden gönderilir; ağda dinlenerek çalınamaz.
//  sameSite  → başka sitelerden gelen isteklerde çerez gönderilmez; CSRF'e karşı korur.
export function cerezAyarlari() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTURUM_SURESI_SN,
  };
}

export function yeniToken() {
  return crypto.randomBytes(32).toString('hex'); // 64 karakterlik tahmin edilemez değer
}

// Giriş yapmış yöneticiyi döndürür; yoksa null.
export async function getAdmin() {
  const token = (await cookies()).get(CEREZ_ADI)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

  const rows = await sql`
    SELECT y.id, y.eposta, y.son_giris, y.son_giris_ip
    FROM oturumlar o
    JOIN yoneticiler y ON y.id = o.yonetici_id
    WHERE o.token = ${token}
      AND o.bitis > now()
      AND o.son_aktivite > now() - interval '30 minutes'`;

  if (rows[0]) {
    // Her işlemde "son aktivite" yenilenir; 30 dk hareketsiz kalan oturum kendiliğinden düşer.
    await sql`UPDATE oturumlar SET son_aktivite = now() WHERE token = ${token}`;
    return { ...rows[0], token };
  }
  return null;
}

// /admin sayfalarının ve Server Action'ların başında çağrılır.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/giris');
  return admin;
}

// İstek yapan istemcinin IP adresi ve tarayıcı bilgisi
export async function istemciBilgisi() {
  const h = await headers();
  const ip =
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'bilinmiyor';
  const cihaz = (h.get('user-agent') || 'bilinmiyor').slice(0, 300);
  return { ip: ip.slice(0, 64), cihaz };
}
