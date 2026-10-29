'use server';
// Yönetim panelinin bütün işlemleri (Server Actions).
// KURAL: Her fonksiyon önce requireAdmin() çağırır. Oturum geçersizse /giris'e yönlendirilir.
// Server Action'lar dışarıdan doğrudan çağrılabildiği için bu kontrol her birinde ŞARTTIR.
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/* ---------------- Güvenlik bulguları ---------------- */

const DURUMLAR = ['açık', 'kapatıldı'];

// Formdan gelen değerleri kontrol edip temiz bir nesneye çevirir.
function bulguVerisi(formData) {
  const metin = (ad) => String(formData.get(ad) || '').trim();
  const hatalar = [];

  const baslik = metin('baslik');
  if (!baslik) hatalar.push('Başlık boş bırakılamaz.');
  if (baslik.length > 200) hatalar.push('Başlık en fazla 200 karakter olabilir.');

  const lab_ortami = metin('lab_ortami') || null;
  if (lab_ortami && lab_ortami.length > 120) hatalar.push('Lab ortamı en fazla 120 karakter olabilir.');

  let cvss = metin('cvss').replace(',', '.');
  if (cvss === '') cvss = null;
  else {
    cvss = Number(cvss);
    if (!Number.isFinite(cvss) || cvss < 0 || cvss > 10) hatalar.push('CVSS 0 ile 10 arasında olmalı.');
    else cvss = Math.round(cvss * 10) / 10;
  }

  const durum = metin('durum') || null;
  if (durum && !DURUMLAR.includes(durum)) hatalar.push('Durum "açık" veya "kapatıldı" olmalı.');

  const bulunma_tarihi = metin('bulunma_tarihi') || null;
  if (bulunma_tarihi && !/^\d{4}-\d{2}-\d{2}$/.test(bulunma_tarihi)) hatalar.push('Tarih geçersiz.');

  let kategori_id = metin('kategori_id');
  kategori_id = kategori_id ? Number.parseInt(kategori_id, 10) : null;
  if (kategori_id !== null && !Number.isInteger(kategori_id)) hatalar.push('Kategori geçersiz.');

  const yayinda = formData.get('yayinda') === 'on';

  return { hatalar, veri: { baslik, lab_ortami, cvss, durum, bulunma_tarihi, kategori_id, yayinda } };
}

// Hata olduğunda formdaki değerler kaybolmasın diye geri gönderilir.
function hamDegerler(formData) {
  const o = {};
  for (const ad of ['baslik', 'lab_ortami', 'cvss', 'durum', 'bulunma_tarihi', 'kategori_id']) o[ad] = String(formData.get(ad) || '');
  o.yayinda = formData.get('yayinda') === 'on';
  return o;
}

function yenile() {
  revalidatePath('/admin', 'layout');
  revalidatePath('/');
}

// INSERT
export async function bulguEkle(oncekiDurum, formData) {
  await requireAdmin();
  const { hatalar, veri: v } = bulguVerisi(formData);
  if (hatalar.length) return { hatalar, degerler: hamDegerler(formData), anahtar: Date.now() };

  await sql`
    INSERT INTO guvenlik_bulgulari
      (baslik, lab_ortami, cvss, durum, bulunma_tarihi, kategori_id, yayinda)
    VALUES
      (${v.baslik}, ${v.lab_ortami}, ${v.cvss}, ${v.durum}, ${v.bulunma_tarihi}, ${v.kategori_id}, ${v.yayinda})`;
  yenile();
  return { tamam: 'Kayıt eklendi.', anahtar: Date.now() };
}

// UPDATE
export async function bulguGuncelle(oncekiDurum, formData) {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get('id')), 10);
  if (!Number.isInteger(id)) return { hatalar: ['Kayıt bulunamadı.'] };
  const { hatalar, veri: v } = bulguVerisi(formData);
  if (hatalar.length) return { hatalar, degerler: hamDegerler(formData), anahtar: Date.now() };

  await sql`
    UPDATE guvenlik_bulgulari SET
      baslik = ${v.baslik}, lab_ortami = ${v.lab_ortami}, cvss = ${v.cvss}, durum = ${v.durum},
      bulunma_tarihi = ${v.bulunma_tarihi}, kategori_id = ${v.kategori_id}, yayinda = ${v.yayinda}
    WHERE id = ${id}`;
  yenile();
  redirect('/admin/guvenlik-bulgulari');
}

// DELETE
export async function bulguSil(formData) {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get('id')), 10);
  if (Number.isInteger(id)) await sql`DELETE FROM guvenlik_bulgulari WHERE id = ${id}`;
  yenile();
}

// Yayında / yayında değil
export async function bulguYayinDegistir(formData) {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get('id')), 10);
  if (Number.isInteger(id)) await sql`UPDATE guvenlik_bulgulari SET yayinda = NOT yayinda WHERE id = ${id}`;
  yenile();
}

/* ---------------- İletişim mesajları ---------------- */

export async function mesajOkunduDegistir(formData) {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get('id')), 10);
  if (Number.isInteger(id)) await sql`UPDATE iletisim_mesajlari SET okundu = NOT okundu WHERE id = ${id}`;
  yenile();
}

export async function mesajSil(formData) {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get('id')), 10);
  if (Number.isInteger(id)) await sql`DELETE FROM iletisim_mesajlari WHERE id = ${id}`;
  yenile();
}

/* ---------------- Oturumlar (Görev 6) ---------------- */
// Oturumlar sayfada token'ın kendisiyle değil, kısa bir özetiyle (md5'in ilk 12 karakteri)
// tanımlanır. Böylece başka oturumların token'ları sayfanın HTML'ine hiç yazılmaz.

export async function oturumKapat(formData) {
  const admin = await requireAdmin();
  const kimlik = String(formData.get('kimlik') || '');
  if (/^[a-f0-9]{12}$/.test(kimlik)) {
    await sql`
      DELETE FROM oturumlar
      WHERE yonetici_id = ${admin.id}
        AND left(md5(token), 12) = ${kimlik}
        AND token <> ${admin.token}`;
  }
  revalidatePath('/admin/oturumlar');
}

export async function digerOturumlariKapat() {
  const admin = await requireAdmin();
  await sql`DELETE FROM oturumlar WHERE yonetici_id = ${admin.id} AND token <> ${admin.token}`;
  revalidatePath('/admin/oturumlar');
}
