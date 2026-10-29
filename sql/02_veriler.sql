-- =====================================================================
-- 02_veriler.sql — Örnek kayıtlar (Görev 2: INSERT)
-- 01_tablolar.sql'den SONRA çalıştırın.
--
-- ÖNEMLİ: Bulgular, DVWA ve OWASP Juice Shop eğitim laboratuvarlarında tipik olarak
-- bulunan zafiyetlerden hazırlanmış ÖRNEKLERDİR. Ödev "kendi gerçek bilgilerinizle"
-- istiyor: çalıştırmadan önce başlık, tarih, CVSS ve durumları kendi laboratuvar
-- çalışmanıza göre düzenleyin.
-- =====================================================================

-- En az 4 zafiyet türü (OWASP Top 10 2021 başlıkları).
-- "Server-Side Request Forgery" için bilerek kayıt eklenmedi: Görev 3.4'te 0 olarak görünecek.
INSERT INTO zafiyet_turleri (ad) VALUES
  ('Broken Access Control'),                    -- id 1
  ('Cryptographic Failures'),                   -- id 2
  ('Injection'),                                -- id 3
  ('Security Misconfiguration'),                -- id 4
  ('Identification and Authentication Failures'), -- id 5
  ('Cross-Site Scripting (XSS)'),               -- id 6
  ('Server-Side Request Forgery');              -- id 7

-- En az 12 bulgu. Bazı alanlar bilerek boş (NULL) bırakıldı.
-- Son kayıt (CVSS 0.0) Görev 3.7'de silinmek için eklendi.
INSERT INTO guvenlik_bulgulari
  (baslik, lab_ortami, cvss, durum, bulunma_tarihi, kategori_id, yayinda)
VALUES
  ('DVWA Low: SQL Injection ile kullanıcı tablosunun listelenmesi',  'DVWA (Docker, localhost)',          9.8, 'kapatıldı', '2025-11-04', 3, true),
  ('DVWA: Stored XSS ile ziyaretçi defterine kalıcı script',         'DVWA (Docker, localhost)',          6.1, 'açık',      '2025-11-11', 6, true),
  ('DVWA Medium: Reflected XSS filtresinin atlatılması',             'DVWA (Docker, localhost)',          5.4, 'kapatıldı', '2025-11-18', 6, true),
  ('Juice Shop: Yönetici sayfasına yetkisiz erişim',                 'OWASP Juice Shop (localhost:3000)', 8.1, 'açık',      '2025-12-02', 1, true),
  ('Juice Shop: Giriş formunda SQL Injection ile admin oturumu',     'OWASP Juice Shop (localhost:3000)', 9.1, 'açık',      '2025-12-02', 3, true),
  ('DVWA: Command Injection ile sunucuda komut çalıştırma',          'DVWA (Docker, localhost)',          8.8, 'açık',      '2026-01-09', 3, true),
  ('Juice Shop: Hata mesajlarında yığın izi (stack trace) sızıntısı','OWASP Juice Shop (localhost:3000)', 5.3, 'kapatıldı', '2026-01-15', 4, true),
  ('DVWA: Kaba kuvvete (brute force) karşı korumasız giriş formu',   'DVWA (Docker, localhost)',          7.5, 'açık',      '2026-02-03', 5, true),
  ('Juice Shop: Parolaların tuzsuz MD5 ile saklanması',              'OWASP Juice Shop (localhost:3000)', 7.4, 'açık',      '2026-02-20', 2, true),
  ('Lab notu 2516016019: DVWA CSRF ile şifre değiştirme',            'DVWA (Docker, localhost)',          6.5, 'kapatıldı', '2026-03-05', 1, true),
  ('DVWA: Dosya yükleme ile web shell çalıştırma',                   'DVWA (Docker, localhost)',          9.0, 'açık',      '2026-03-21', NULL, true),
  ('Juice Shop: Güvenlik başlıklarının (CSP, HSTS) eksikliği',       'OWASP Juice Shop (localhost:3000)', 4.3, NULL,        NULL,         4, true),
  ('Juice Shop: Kayıt formunda zayıf parola politikası',             'OWASP Juice Shop (localhost:3000)', NULL, 'açık',     '2026-04-10', 5, false),
  ('Deneme kaydı (yanlışlıkla eklendi, silinecek)',                  NULL,                                0.0, NULL,        NULL,         NULL, false);
