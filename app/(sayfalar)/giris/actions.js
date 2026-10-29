'use server';
// Giriş ve çıkış işlemleri (sunucuda çalışır).
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { CEREZ_ADI, cerezAyarlari, yeniToken, istemciBilgisi } from '@/lib/auth';

// Kullanıcı bulunamasa bile bcrypt.compare çalışsın diye kullanılan sahte özet.
// Böylece "bu e-posta var mı?" bilgisi cevap süresinden anlaşılamaz.
const SAHTE_HASH = '$2b$12$V6jHaV0YvNwKA.we4RagzuVpEn9xifElIEHtIPqBR/nRxH5mm/dw2';
const HATA_MESAJI = 'E-posta veya şifre hatalı';

export async function girisYap(oncekiDurum, formData) {
  const eposta = String(formData.get('eposta') || '').trim().toLowerCase();
  const sifre = String(formData.get('sifre') || '');
  const { ip, cihaz } = await istemciBilgisi();

  if (!eposta || !sifre || eposta.length > 200 || sifre.length > 200) {
    return { hata: HATA_MESAJI, eposta };
  }

  const rows = await sql`
    SELECT id, sifre_hash FROM yoneticiler WHERE lower(eposta) = ${eposta}`;
  const yonetici = rows[0];
  const dogru = await bcrypt.compare(sifre, yonetici ? yonetici.sifre_hash : SAHTE_HASH);

  if (!yonetici || !dogru) {
    // Başarısız deneme sunucu kayıtlarına (Vercel → Logs) düşer.
    console.warn(`[GIRIS-BASARISIZ] ${new Date().toISOString()} ip=${ip} eposta=${eposta}`);
    await new Promise((r) => setTimeout(r, 600)); // kaba kuvvet denemelerini yavaşlatır
    // Hangi bilginin yanlış olduğu SÖYLENMEZ (e-posta mı şifre mi).
    return { hata: HATA_MESAJI, eposta };
  }

  // Süresi dolmuş eski oturumları temizle (sorgular.sql → Görev 6)
  await sql`DELETE FROM oturumlar
            WHERE bitis <= now() OR son_aktivite <= now() - interval '30 minutes'`;

  const token = yeniToken();
  await sql`
    INSERT INTO oturumlar (token, yonetici_id, bitis, son_aktivite, cihaz)
    VALUES (${token}, ${yonetici.id}, now() + interval '2 hours', now(), ${cihaz})`;

  // Görev 7: her başarılı girişte tarih ve IP kaydedilir
  await sql`
    UPDATE yoneticiler SET son_giris = now(), son_giris_ip = ${ip}
    WHERE id = ${yonetici.id}`;

  (await cookies()).set(CEREZ_ADI, token, cerezAyarlari());
  redirect('/admin');
}

export async function cikisYap() {
  const jar = await cookies();
  const token = jar.get(CEREZ_ADI)?.value;
  if (token) await sql`DELETE FROM oturumlar WHERE token = ${token}`;
  jar.delete(CEREZ_ADI);
  redirect('/giris');
}
