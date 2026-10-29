// Yönetici şifresinin bcrypt özetini (hash) üretir.
// Kullanım:  npm run sifre -- "BuradaGucluBirSifre"
// Çıkan $2b$12$... metnini sql/03_yonetici.sql içindeki INSERT'e yapıştırın.
// Veritabanında şifrenin KENDİSİ değil, yalnızca bu özet tutulur.
import bcrypt from 'bcryptjs';

const sifre = process.argv[2];
if (!sifre || sifre.length < 10) {
  console.error('Lütfen en az 10 karakterlik bir şifre verin:  npm run sifre -- "Sifreniz"');
  process.exit(1);
}
console.log(bcrypt.hashSync(sifre, 12)); // 12 = maliyet (cost) faktörü
