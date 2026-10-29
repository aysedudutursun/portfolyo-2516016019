// Ana sayfa ("/"): portfolyo.
//
// Portfolyonun tasarımı ve yazıları public/site/ klasöründeki dosyalardadır:
//   stil.css   → tasarım
//   icerik.js  → bütün yazılar (düzenlemek için bu dosyayı açın)
//   motor.js   → sayfayı oluşturan kod
// Bu dosya her istekte veritabanından "Güvenlik Laboratuvarı Bulgularım" kayıtlarını okur
// ve sayfaya window.BULGULAR olarak verir. Böylece panelden eklenen kayıt, sayfa
// yenilenince hemen görünür (önbellek yok: force-dynamic).
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function bulgulariGetir() {
  try {
    // Sitede yalnızca yayinda = true olan kayıtlar gösterilir.
    const tumu = await sql`
      SELECT b.id, b.baslik, b.lab_ortami, b.cvss, b.durum,
             to_char(b.bulunma_tarihi, 'YYYY-MM-DD') AS bulunma_tarihi,
             z.ad AS kategori
      FROM guvenlik_bulgulari b
      LEFT JOIN zafiyet_turleri z ON z.id = b.kategori_id
      WHERE b.yayinda = true
      ORDER BY b.bulunma_tarihi DESC NULLS LAST, b.id DESC`;

    // "Öne çıkanlar": Görev 3.2 sorgusu (en yüksek CVSS puanlı 4 bulgu), yalnızca yayındakiler.
    const onecikan = await sql`
      SELECT b.id, b.baslik, b.lab_ortami, b.cvss, b.durum,
             to_char(b.bulunma_tarihi, 'YYYY-MM-DD') AS bulunma_tarihi,
             z.ad AS kategori
      FROM guvenlik_bulgulari b
      LEFT JOIN zafiyet_turleri z ON z.id = b.kategori_id
      WHERE b.yayinda = true AND b.cvss IS NOT NULL
      ORDER BY b.cvss DESC
      LIMIT 4`;

    return { onecikan, tumu };
  } catch (e) {
    console.error('Bulgular okunamadı:', e.message);
    return null; // sayfa yine açılır, bölümde "yüklenemedi" yazar
  }
}

// JSON'u <script> içine güvenle gömmek için: "</script>" gibi dizileri etkisiz bırakır.
function guvenliJson(veri) {
  return JSON.stringify(veri)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(String.fromCharCode(0x2028)).join('\\u2028')
    .split(String.fromCharCode(0x2029)).join('\\u2029');
}

export async function GET() {
  const bulgular = await bulgulariGetir();
  const v = '3'; // stil/js dosyalarını değiştirdiğinizde bu sayıyı artırın (tarayıcı önbelleği için)

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Ayşe Dudu Tursun</title>
<meta name="description" content="Ayşe Dudu Tursun — Büyük Veri Analistliği öğrencisi. Veri analizi, makine öğrenmesi, büyük veri ve güvenlik laboratuvarı çalışmaları.">
<meta name="theme-color" content="#070a14">
<meta property="og:type" content="website">
<meta property="og:title" content="Ayşe Dudu Tursun">
<meta property="og:description" content="Büyük Veri Analistliği öğrencisi · Portfolyo">
<meta property="og:image" content="/profil.jpg">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23070a14'/%3E%3Ctext x='32' y='43' font-size='30' font-family='Arial' font-weight='700' fill='%2300f0ff' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E">
<link rel="preload" as="image" href="/profil.jpg">
<script>try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme:light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}</script>
<link rel="stylesheet" href="/site/stil.css?v=${v}">
</head>
<body>
<div id="amb" aria-hidden="true"></div>
<canvas id="cv" aria-hidden="true"></canvas>
<nav id="nav"></nav>
<div id="page"></div>
<noscript><p style="position:relative;z-index:2;padding:120px 24px;text-align:center;color:#8ea0c0">Bu sayfanın görüntülenmesi için JavaScript gerekir. / This page requires JavaScript.</p></noscript>
<script>window.BULGULAR = ${guvenliJson(bulgular)};</script>
<script src="/site/icerik.js?v=${v}"></script>
<script src="/site/motor.js?v=${v}"></script>
<script>
setTimeout(function(){var p=document.getElementById("page");if(p&&!p.children.length){
var d=document.createElement("p");d.style.cssText="position:relative;z-index:2;padding:120px 24px;text-align:center;color:#ff6b6b;font:16px/1.6 system-ui,sans-serif";
d.textContent="Sayfa oluşturulamadı. public/site/icerik.js dosyasında silinmiş bir virgül, tırnak veya parantez olabilir.";document.body.appendChild(d)}},1500);
</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
