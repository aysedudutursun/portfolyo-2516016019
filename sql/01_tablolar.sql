-- =====================================================================
-- 01_tablolar.sql — Bütün tabloları oluşturur.
-- Neon → SQL Editor'e yapıştırıp "Run" deyin. (Bir kez çalıştırılır.)
-- Sıra önemlidir: başka tabloya bağlanan (REFERENCES) tablo sonra oluşturulur.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Görev 1: Ortak tablolar
-- ---------------------------------------------------------------------

-- Panele giriş yapabilen yöneticiler
CREATE TABLE yoneticiler (
  id          SERIAL PRIMARY KEY,                      -- otomatik artan benzersiz numara
  eposta      TEXT UNIQUE NOT NULL,                    -- giriş adı; iki yönetici aynı e-postayı kullanamaz
  sifre_hash  TEXT NOT NULL,                           -- şifrenin kendisi DEĞİL, bcrypt özeti
  olusturma   TIMESTAMPTZ NOT NULL DEFAULT now()       -- kaydın oluşturulma zamanı (otomatik)
);

-- Açık oturumlar: her giriş bir satır
CREATE TABLE oturumlar (
  token        TEXT PRIMARY KEY,                       -- tarayıcı çerezinde tutulan rastgele değer
  yonetici_id  INT NOT NULL REFERENCES yoneticiler(id) ON DELETE CASCADE,
                                                       -- hangi yöneticinin oturumu; yönetici silinirse oturumları da silinir
  bitis        TIMESTAMPTZ NOT NULL                    -- bu zamandan sonra oturum geçersiz (girişten 2 saat sonra)
);

-- Ziyaretçilerin iletişim formundan gönderdiği mesajlar
CREATE TABLE iletisim_mesajlari (
  id               SERIAL PRIMARY KEY,
  ad_soyad         TEXT NOT NULL,
  eposta           TEXT NOT NULL,
  mesaj            TEXT NOT NULL,
  kvkk_onay        BOOLEAN NOT NULL DEFAULT false,      -- aydınlatma metni onaylandı mı
  okundu           BOOLEAN NOT NULL DEFAULT false,      -- panelde okundu işaretlendi mi
  gonderim_zamani  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Görev 2: Bana özel tablolar (Güvenlik Laboratuvarı Bulgularım)
-- ---------------------------------------------------------------------

-- Zafiyet türleri (OWASP Top 10 başlıkları). Önce bu oluşturulur,
-- çünkü guvenlik_bulgulari.kategori_id bu tabloya bağlanır.
CREATE TABLE zafiyet_turleri (
  id  SERIAL PRIMARY KEY,
  ad  TEXT NOT NULL UNIQUE                             -- aynı tür iki kez eklenemez
);

-- Asıl kayıtlar
CREATE TABLE guvenlik_bulgulari (
  id              SERIAL PRIMARY KEY,
  baslik          TEXT NOT NULL,
  lab_ortami      TEXT,                                -- ör. DVWA, OWASP Juice Shop (boş olabilir)
  cvss            NUMERIC(3,1) CHECK (cvss BETWEEN 0 AND 10),   -- 0.0–10.0 arası, tek ondalık
  durum           TEXT CHECK (durum IN ('açık','kapatıldı')),   -- yalnızca bu iki değer
  bulunma_tarihi  DATE,
  kategori_id     INT REFERENCES zafiyet_turleri(id) ON DELETE SET NULL,
                                                       -- tür silinirse bulgu kalır, kategorisi boşalır
  yayinda         BOOLEAN NOT NULL DEFAULT true,       -- false ise sitede gösterilmez
  olusturma       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Görev 6: Oturum zaman aşımı için yeni sütunlar
-- ---------------------------------------------------------------------
ALTER TABLE oturumlar
  ADD COLUMN son_aktivite TIMESTAMPTZ NOT NULL DEFAULT now(),   -- son işlem zamanı (30 dk kuralı)
  ADD COLUMN cihaz TEXT;                                        -- tarayıcı bilgisi (user-agent)

-- ---------------------------------------------------------------------
-- Görev 7: Son başarılı giriş bilgisi
-- ---------------------------------------------------------------------
ALTER TABLE yoneticiler
  ADD COLUMN son_giris TIMESTAMPTZ,
  ADD COLUMN son_giris_ip TEXT;
