'use client';
import { useActionState } from 'react';
import { mesajGonder } from '@/app/(sayfalar)/iletisim/actions';

export default function IletisimFormu() {
  const [durum, gonder, bekliyor] = useActionState(mesajGonder, null);
  const d = durum?.degerler || {};
  const h = durum?.hatalar || {};

  if (durum?.tamam) {
    return (
      <div className="uyari tamam" role="status">
        Mesajınız iletildi, teşekkürler! En kısa sürede dönüş yapacağım.
        <div className="bosluk" />
        <a className="btn" href="/">Portfolyoya dön</a>
      </div>
    );
  }

  return (
    <form action={gonder} noValidate>
      {Object.keys(h).length > 0 && (
        <div className="uyari hata" role="alert">Lütfen işaretli alanları düzeltin.</div>
      )}

      <label htmlFor="ad_soyad">Ad soyad</label>
      <input id="ad_soyad" name="ad_soyad" type="text" maxLength={100} required
             autoComplete="name" defaultValue={d.ad_soyad} aria-invalid={!!h.ad_soyad} />
      {h.ad_soyad && <div className="ipucu" style={{ color: 'var(--err)' }}>{h.ad_soyad}</div>}

      <label htmlFor="eposta">E-posta</label>
      <input id="eposta" name="eposta" type="email" maxLength={200} required
             autoComplete="email" defaultValue={d.eposta} aria-invalid={!!h.eposta} />
      {h.eposta && <div className="ipucu" style={{ color: 'var(--err)' }}>{h.eposta}</div>}

      <label htmlFor="mesaj">Mesaj</label>
      <textarea id="mesaj" name="mesaj" maxLength={2000} required
                defaultValue={d.mesaj} aria-invalid={!!h.mesaj} />
      <div className="ipucu">En fazla 2000 karakter.</div>
      {h.mesaj && <div className="ipucu" style={{ color: 'var(--err)' }}>{h.mesaj}</div>}

      {/* Botları yakalamak için gizli alan: insanlar görmez, doldurmaz */}
      <div className="gizli" aria-hidden="true">
        <label htmlFor="web_sitesi">Web sitesi</label>
        <input id="web_sitesi" name="web_sitesi" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="onay">
        <input type="checkbox" name="kvkk_onay" defaultChecked={d.kvkk_onay} />
        <span>
          Aşağıdaki aydınlatma metnini okudum; mesajıma yanıt verilebilmesi için ad, e-posta
          ve mesaj bilgilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {h.kvkk_onay && <div className="ipucu" style={{ color: 'var(--err)' }}>{h.kvkk_onay}</div>}

      <div className="bosluk" />
      <button className="btn dolu" type="submit" disabled={bekliyor}>
        {bekliyor ? 'Gönderiliyor…' : 'Mesajı gönder'}
      </button>
    </form>
  );
}
