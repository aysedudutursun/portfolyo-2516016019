-- =====================================================================
-- sorgular.sql — Görev 3, 6 ve 7 SQL sorguları
-- Öğrenci: Ayşe Dudu Tursun (2516016019)
-- Tablo: guvenlik_bulgulari (+ zafiyet_turleri)
-- Her sorguyu Neon SQL Editor'de ayrı ayrı çalıştırıp sonucun ekran görüntüsünü alın.
-- =====================================================================


-- Görev 3.1
-- CVSS puanı 7.0 ve üzeri (yüksek/kritik) VE durumu 'açık' olan bulgular.
-- İki koşul AND ile bağlanır; ikisi birden doğru olmalı.
SELECT id, baslik, cvss, durum, bulunma_tarihi
FROM guvenlik_bulgulari
WHERE cvss >= 7.0
  AND durum = 'açık'
ORDER BY cvss DESC;


-- Görev 3.2
-- En yüksek CVSS puanlı 4 bulgu (sitedeki "Öne çıkanlar" alanı bu sorguyu kullanır).
-- CVSS'i boş (NULL) olanlar dışarıda bırakılır; aksi hâlde DESC sıralamada en üste çıkarlar.
SELECT id, baslik, cvss
FROM guvenlik_bulgulari
WHERE cvss IS NOT NULL
ORDER BY cvss DESC
LIMIT 4;


-- Görev 3.3
-- Duruma göre bulgu sayısı ve ortalama CVSS puanı.
-- GROUP BY her durum için bir satır üretir; durumu boş olanlar NULL grubunda toplanır.
-- AVG, CVSS'i NULL olan satırları hesaba katmaz; ROUND ile 2 basamağa yuvarlanır.
SELECT durum,
       COUNT(*)            AS bulgu_sayisi,
       ROUND(AVG(cvss), 2) AS ortalama_cvss
FROM guvenlik_bulgulari
GROUP BY durum
ORDER BY bulgu_sayisi DESC;


-- Görev 3.4
-- Her zafiyet türü için bulgu sayısı (kategori adıyla), kaydı olmayanlar 0 ile.
-- LEFT JOIN: zafiyet_turleri'ndeki her satır, eşleşen bulgu olmasa da sonuçta kalır.
-- COUNT(b.id): eşleşme yoksa b.id NULL olur ve sayılmaz → 0. (COUNT(*) olsaydı 1 çıkardı.)
SELECT z.ad          AS zafiyet_turu,
       COUNT(b.id)   AS bulgu_sayisi
FROM zafiyet_turleri z
LEFT JOIN guvenlik_bulgulari b ON b.kategori_id = z.id
GROUP BY z.id, z.ad
ORDER BY bulgu_sayisi DESC, z.ad;


-- Görev 3.5
-- Başlığında öğrenci numaram geçen kayıt. ILIKE büyük/küçük harf ayırmaz,
-- % işareti "önünde/arkasında herhangi bir metin olabilir" demektir.
SELECT id, baslik, cvss, durum
FROM guvenlik_bulgulari
WHERE baslik ILIKE '%2516016019%';


-- Görev 3.6
-- Seçilen bir bulgunun durumunu 'kapatıldı' yapmak.
-- Önce aynı WHERE ile SELECT çalıştırıp doğru kaydı seçtiğimi kontrol ediyorum:
SELECT id, baslik, durum FROM guvenlik_bulgulari WHERE id = 2;
-- Sonra güncelliyorum (WHERE olmadan ÇALIŞTIRILMAZ, yoksa bütün kayıtlar değişir):
UPDATE guvenlik_bulgulari
SET durum = 'kapatıldı'
WHERE id = 2;


-- Görev 3.7
-- CVSS puanı 0 olan kayıtları silmek. Önce hangi kayıtların silineceğini görüyorum:
SELECT id, baslik, cvss FROM guvenlik_bulgulari WHERE cvss = 0;
-- Sonra siliyorum:
DELETE FROM guvenlik_bulgulari
WHERE cvss = 0;


-- Görev 6 (SQL görevi)
-- Süresi dolmuş tüm oturumları tek sorguda silmek:
-- ya mutlak süresi (bitis) geçmiş ya da 30 dakikadır işlem yapılmamış oturumlar.
DELETE FROM oturumlar
WHERE bitis <= now()
   OR son_aktivite <= now() - interval '30 minutes';
-- (Uygulama da her başarılı girişte bu sorguyu çalıştırır: app/(sayfalar)/giris/actions.js)

-- Görev 6: Diğer tüm oturumları kapatma (paneldeki düğmenin sorgusu)
-- DELETE FROM oturumlar WHERE yonetici_id = <benim_id> AND token <> <su_anki_token>;


-- Görev 7 (SQL görevi)
-- Sütunlar 01_tablolar.sql'de eklendi:
--   ALTER TABLE yoneticiler ADD COLUMN son_giris TIMESTAMPTZ, ADD COLUMN son_giris_ip TEXT;
-- Her başarılı girişte uygulamanın çalıştırdığı UPDATE (değerler parametre olarak gider):
--   UPDATE yoneticiler SET son_giris = now(), son_giris_ip = $1 WHERE id = $2;
-- Panel ana sayfasında gösterilen bilgi:
SELECT eposta, son_giris, son_giris_ip
FROM yoneticiler;
