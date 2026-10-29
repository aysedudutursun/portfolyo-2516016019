import IletisimFormu from '@/components/IletisimFormu';

export const metadata = { title: 'İletişim', robots: { index: true } };

export default function IletisimSayfasi() {
  return (
    <main className="orta">
      <a className="marka" href="/#contact">← Portfolyoya dön</a>
      <div className="kutu">
        <h1>İletişim</h1>
        <p className="mut">Staj, proje veya iş birliği için bana buradan yazabilirsiniz.</p>
        <IletisimFormu />

        <details>
          <summary>KVKK aydınlatma metni</summary>
          <p>
            <strong>Veri sorumlusu:</strong> Ayşe Dudu Tursun (aysedudutursun@gmail.com).
          </p>
          <p>
            <strong>İşlenen veriler ve amaç:</strong> Bu formla gönderdiğiniz ad soyad, e-posta adresi ve
            mesaj içeriği yalnızca mesajınıza yanıt verebilmek amacıyla, 6698 sayılı KVKK m.5/1
            uyarınca açık rızanıza dayanarak işlenir.
          </p>
          <p>
            <strong>Saklama ve aktarım:</strong> Veriler, barındırma hizmeti alınan veritabanında
            (Neon, Avrupa bölgesi) saklanır; üçüncü kişilerle paylaşılmaz, pazarlama amacıyla
            kullanılmaz ve yazışma tamamlandıktan sonra en geç 1 yıl içinde silinir.
          </p>
          <p>
            <strong>Haklarınız:</strong> KVKK m.11 kapsamında verilerinize erişme, düzeltilmesini veya
            silinmesini isteme haklarınızı yukarıdaki e-posta adresine yazarak kullanabilirsiniz.
          </p>
        </details>
      </div>
    </main>
  );
}
