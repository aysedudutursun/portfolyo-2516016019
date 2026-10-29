import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import GirisFormu from '@/components/GirisFormu';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Yönetici girişi' };

export default async function GirisSayfasi() {
  // Zaten giriş yapılmışsa doğrudan panele
  if (await getAdmin()) redirect('/admin');

  return (
    <main className="dar">
      <a className="marka" href="/">← ADT</a>
      <div className="kutu">
        <h1>Yönetici girişi</h1>
        <p className="mut">Bu sayfa yalnızca site yöneticisi içindir.</p>
        <GirisFormu />

        {/* Görev 7: Yasal uyarı */}
        <p className="yasal" role="note">
          <strong>Yasal uyarı:</strong> Bu sisteme yalnızca yetkili kişi erişebilir. Yetkisiz giriş veya
          girmeye çalışmak TCK 243, sistemdeki verileri bozmak, silmek veya değiştirmek TCK 244,
          kişisel verileri hukuka aykırı olarak ele geçirmek veya yaymak TCK 136 kapsamında suçtur.
          Tüm giriş denemeleri tarih, saat ve IP adresiyle kayıt altına alınmaktadır.
        </p>
      </div>
    </main>
  );
}
