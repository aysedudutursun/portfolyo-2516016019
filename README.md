# Ayşe Dudu Tursun — Portfolyo + Yönetim Paneli

BVA 2205 Siber Güvenlik ve Bilişim Hukuku · Bireysel ödev · **2516016019**

Next.js (App Router) + PostgreSQL (Neon). Portfolyo ana sayfada; "Güvenlik Laboratuvarı
Bulgularım" bölümü veritabanından gelir, ziyaretçiler iletişim formundan mesaj bırakır,
yönetici şifreli panelden her şeyi yönetir.

## Klasör yapısı

```
app/
  route.js                      → Ana sayfa (portfolyo). Bulguları veritabanından okur.
  (sayfalar)/
    layout.js, panel.css        → Giriş, iletişim ve panel sayfalarının ortak çerçevesi
    iletisim/                   → İletişim formu (KVKK onaylı) + sunucu tarafı kontrol
    giris/                      → Yönetici girişi + yasal uyarı, giriş/çıkış işlemleri
    admin/                      → Panel: özet, güvenlik bulguları, mesajlar, oturumlar
      actions.js                → Paneldeki bütün ekleme/güncelleme/silme işlemleri
components/                     → Formlar ve onaylı silme düğmesi
lib/
  db.js                         → Neon bağlantısı
  auth.js                       → Oturum: getAdmin, requireAdmin, çerez ayarları
public/
  profil.jpg                    → Profil fotoğrafı
  site/icerik.js                → Portfolyonun BÜTÜN YAZILARI (düzenlemek için burası)
  site/stil.css, site/motor.js  → Portfolyo tasarımı ve kodu
sql/
  01_tablolar.sql               → Tablolar (Görev 1, 2, 6, 7)
  02_veriler.sql                → Örnek kayıtlar (Görev 2)
  03_yonetici.sql               → Yönetici hesabı (Görev 1)
  sorgular.sql                  → Görev 3, 6 ve 7 sorguları
scripts/sifre-ozeti.mjs         → Şifrenin bcrypt özetini üretir
```

---

## Kurulum — adım adım

### 1) Neon veritabanı
1. https://neon.tech → GitHub ile giriş → **Create project**
   Ad: `portfolyo-2516016019`, bölge: **Europe (Frankfurt)**.
2. Soldaki **SQL Editor**'de sırayla çalıştırın:
   1. `sql/01_tablolar.sql`
   2. `sql/02_veriler.sql` → **önce bulguları kendi lab çalışmanıza göre düzenleyin**
3. **Connect** düğmesinden `postgresql://...` adresini kopyalayın. Bu adres şifredir, kimseyle paylaşmayın.

### 2) Bilgisayarda çalıştırma (isteğe bağlı ama önerilir)
Node.js 20 veya üstü gerekir (https://nodejs.org).
```bash
npm install
```
Proje klasöründe `.env.local` dosyası oluşturun (`.env.example`'ı kopyalayabilirsiniz):
```
DATABASE_URL=postgresql://...kopyaladığınız adres...
```
Yönetici şifrenizin özetini alın:
```bash
npm run sifre -- "GucluBirSifre2026!"
```
Çıkan `$2b$12$...` metnini `sql/03_yonetici.sql` içine yapıştırıp Neon SQL Editor'de çalıştırın.
Sonra:
```bash
npm run dev
```
http://localhost:3000 → portfolyo, http://localhost:3000/giris → panel.

### 3) GitHub'a yükleme
1. GitHub'da yeni bir depo açın: `portfolyo-2516016019`. Site artık GitHub Pages'te değil,
   Vercel'de yayınlanır; eski `aysedudutursun.github.io` deposu gerekmez.
2. Bu klasördeki her şeyi yükleyin. **Yüklenmemesi gerekenler** `.gitignore` sayesinde dışarıda kalır:
   `node_modules/`, `.next/`, **`.env.local`**.
   - Web üzerinden yüklüyorsanız (Add file → Upload files) bu üçünü sürüklemeyin.
   - `.env.local` depoda olursa ödevden puan alınamaz!
3. Terminalle yüklemek isterseniz:
   ```bash
   git init
   git add .
   git status            # .env.local listede OLMAMALI
   git commit -m "Portfolyo, veritabanı ve yönetim paneli"
   git branch -M main
   git remote add origin https://github.com/aysedudutursun/portfolyo-2516016019.git
   git push -u origin main
   ```

### 4) Vercel'de yayınlama
1. https://vercel.com → GitHub ile giriş → **Add New → Project** → depoyu seçin → **Import**.
2. Framework otomatik **Next.js** gelir. **Environment Variables** bölümüne ekleyin:
   - Name: `DATABASE_URL`  Value: Neon adresiniz
3. **Deploy**. Birkaç dakika sonra `https://....vercel.app` adresi açılır.
4. Sonradan GitHub'a yüklediğiniz her değişiklik otomatik yayınlanır.

### 5) Alan adı (domain)
Vercel → proje → **Settings → Domains**:
- Vercel'den alan adı satın alırsanız ayar kendiliğinden yapılır.
- Başka yerden aldıysanız Vercel'in gösterdiği DNS kayıtlarını (A / CNAME) alan adı firmanızın paneline girin.
HTTPS sertifikası otomatik verilir (çerezdeki `secure` ayarı bu yüzden çalışır).

---

## Kullanım

| Adres | Ne var |
|---|---|
| `/` | Portfolyo (TR/EN/ES/DE/AR) + Güvenlik Laboratuvarı Bulgularım |
| `/iletisim` | İletişim formu (KVKK onayı zorunlu) |
| `/giris` | Yönetici girişi + yasal uyarı |
| `/admin` | Okunmamış mesaj ve bulgu sayısı, son başarılı giriş (tarih, IP) |
| `/admin/guvenlik-bulgulari` | Listele (JOIN), ekle, düzenle, sil, yayında/yayında değil |
| `/admin/mesajlar` | Mesajlar (yeniden eskiye), okundu işaretle, sil |
| `/admin/oturumlar` | Açık oturumlar, tek tek veya "diğer tüm oturumları kapat" |

**Portfolyo yazılarını değiştirmek:** `public/site/icerik.js`. Bir `{ ... }` bloğunu kopyalayıp
yazıları değiştirin. Tasarım/kod değiştirirseniz `app/route.js` içindeki `v = '3'` sayısını artırın
ki tarayıcılar yeni dosyayı alsın.

---

## Güvenlik özeti (derste anlatmak için)

- **Şifre:** Veritabanında yalnızca bcrypt özeti (cost 12). Giriş `bcrypt.compare` ile kontrol edilir.
  Kullanıcı yoksa bile sahte bir özetle karşılaştırma yapılır; cevap süresinden e-postanın var
  olup olmadığı anlaşılmaz. Hata mesajı her zaman "E-posta veya şifre hatalı".
- **SQL injection:** Bütün sorgular `` sql`... ${deger}` `` biçiminde; değerler parametre olarak gider.
  Hiçbir yerde metin birleştirerek SQL kurulmaz.
- **Oturum:** `crypto.randomBytes(32)` ile 64 karakterlik token → `oturumlar` tablosu, 2 saat geçerli.
  Çerez `httpOnly` (XSS ile okunamaz), `secure` (yalnızca HTTPS), `sameSite=lax` (CSRF'e karşı).
- **Zaman aşımı (Görev 6):** 30 dakika işlem yoksa oturum geçersiz; her istekte `son_aktivite` güncellenir.
  Oturumlar sayfasında token'ın kendisi değil yalnızca md5 özetinin ilk 12 karakteri kullanılır.
- **Koruma:** Her `/admin` sayfası ve her Server Action başında `requireAdmin()` çağırır.
- **Girdi kontrolü:** İletişim formu ve bulgu formu sunucuda da kontrol edilir (boş/uzun alan,
  e-posta biçimi, CVSS 0–10, durum değeri). Formda bot tuzağı alanı var.
- **Kayıt (Görev 7):** Başarılı girişte `son_giris` ve `son_giris_ip` güncellenir; başarısız denemeler
  IP ile sunucu kayıtlarına yazılır (Vercel → Logs).
- **Başlıklar:** `X-Frame-Options: DENY` (clickjacking), `nosniff`, `Referrer-Policy`.

## Rapor için hatırlatma
Raporda istenen ekran görüntülerini (SQL sonuçları; giriş, hatalı giriş, liste, ekleme, mesajlar;
iki tarayıcıdan oturum kapatma) ve Görev 6–7 yorumlarını kendiniz hazırlamalısınız.
