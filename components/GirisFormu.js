'use client';
import { useActionState } from 'react';
import { girisYap } from '@/app/(sayfalar)/giris/actions';

export default function GirisFormu() {
  const [durum, gonder, bekliyor] = useActionState(girisYap, null);
  return (
    <form action={gonder} noValidate>
      {durum?.hata && <div className="uyari hata" role="alert">{durum.hata}</div>}
      <label htmlFor="eposta">E-posta</label>
      <input id="eposta" name="eposta" type="email" autoComplete="username" required
             maxLength={200} defaultValue={durum?.eposta || ''} />
      <label htmlFor="sifre">Şifre</label>
      <input id="sifre" name="sifre" type="password" autoComplete="current-password" required maxLength={200} />
      <div className="bosluk" />
      <button className="btn dolu" type="submit" disabled={bekliyor}>
        {bekliyor ? 'Kontrol ediliyor…' : 'Giriş yap'}
      </button>
    </form>
  );
}
