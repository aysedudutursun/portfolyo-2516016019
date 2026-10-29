-- =====================================================================
-- 03_yonetici.sql — Kendi yönetici hesabınızı oluşturun (Görev 1).
--
-- 1) Proje klasöründe terminalde şifrenizin özetini alın:
--        npm run sifre -- "GucluBirSifre2026!"
--    (ödevdeki komut da aynı işi yapar:
--     node -e "console.log(require('bcryptjs').hashSync('BURAYA_SIFRENIZ', 12))")
-- 2) Çıkan $2b$12$... metnini aşağıya yapıştırın, e-postayı KÜÇÜK harfle yazın.
-- 3) SQL Editor'de çalıştırın. Veritabanında şifrenin kendisi asla görünmez.
-- =====================================================================

INSERT INTO yoneticiler (eposta, sifre_hash)
VALUES ('aysedudutursun@gmail.com', 'BURAYA_$2b$12$_ILE_BASLAYAN_OZETI_YAPISTIRIN');

-- Kontrol: şifre sütununda yalnızca özet görünmeli
SELECT id, eposta, left(sifre_hash, 7) AS ozet_basi, olusturma FROM yoneticiler;
