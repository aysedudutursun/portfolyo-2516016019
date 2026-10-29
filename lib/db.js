// Veritabanı bağlantısı (Neon PostgreSQL).
// DATABASE_URL, .env.local dosyasından (yerelde) veya Vercel ortam değişkeninden okunur.
//
// GÜVENLİK: Sorgularda değişkenleri her zaman sql`... ${degisken} ...` biçiminde verin.
// Kütüphane ${...} içindekileri SQL metnine yapıştırmaz, ayrı "parametre" olarak gönderir;
// böylece SQL injection mümkün olmaz. Metni + ile birleştirip SQL kurmak YASAKTIR.
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);
