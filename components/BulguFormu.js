'use client';
// Güvenlik bulgusu ekleme / düzenleme formu.
import { useActionState } from 'react';
import { bulguEkle, bulguGuncelle } from '@/app/(sayfalar)/admin/actions';

export default function BulguFormu({ kategoriler, bulgu = null }) {
  const duzenleme = !!bulgu;
  const [durum, gonder, bekliyor] = useActionState(duzenleme ? bulguGuncelle : bulguEkle, null);

  // Hata varsa kullanıcının yazdıkları, yoksa kaydın mevcut değerleri (ekleme için boş)
  const d = durum?.degerler || {
    baslik: bulgu?.baslik || '',
    lab_ortami: bulgu?.lab_ortami || '',
    cvss: bulgu?.cvss ?? '',
    durum: bulgu?.durum || '',
    bulunma_tarihi: bulgu?.bulunma_tarihi || '',
    kategori_id: bulgu?.kategori_id ?? '',
    yayinda: bulgu ? bulgu.yayinda : true,
  };

  return (
    <form action={gonder} key={durum?.anahtar ?? 'ilk'}>
      {duzenleme && <input type="hidden" name="id" value={bulgu.id} />}
      {durum?.hatalar?.length > 0 && (
        <div className="uyari hata" role="alert">{durum.hatalar.map((h) => <div key={h}>{h}</div>)}</div>
      )}
      {durum?.tamam && <div className="uyari tamam" role="status">{durum.tamam}</div>}

      <label htmlFor="baslik">Başlık *</label>
      <input id="baslik" name="baslik" type="text" required maxLength={200} defaultValue={d.baslik} />

      <div className="izgara">
        <div>
          <label htmlFor="lab_ortami">Lab ortamı</label>
          <input id="lab_ortami" name="lab_ortami" type="text" maxLength={120}
                 placeholder="ör. DVWA (Docker, localhost)" defaultValue={d.lab_ortami} />
        </div>
        <div>
          <label htmlFor="kategori_id">Zafiyet türü</label>
          <select id="kategori_id" name="kategori_id" defaultValue={String(d.kategori_id)}>
            <option value="">— seçilmedi —</option>
            {kategoriler.map((k) => <option key={k.id} value={String(k.id)}>{k.ad}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cvss">CVSS (0–10)</label>
          <input id="cvss" name="cvss" type="number" min="0" max="10" step="0.1" defaultValue={d.cvss} />
        </div>
        <div>
          <label htmlFor="durum">Durum</label>
          <select id="durum" name="durum" defaultValue={d.durum}>
            <option value="">— belirtilmedi —</option>
            <option value="açık">açık</option>
            <option value="kapatıldı">kapatıldı</option>
          </select>
        </div>
        <div>
          <label htmlFor="bulunma_tarihi">Bulunma tarihi</label>
          <input id="bulunma_tarihi" name="bulunma_tarihi" type="date" defaultValue={d.bulunma_tarihi} />
        </div>
      </div>

      <label className="onay" style={{ marginTop: 16 }}>
        <input type="checkbox" name="yayinda" defaultChecked={d.yayinda} />
        <span>Sitede yayında olsun</span>
      </label>

      <div className="bosluk" />
      <button className="btn dolu" type="submit" disabled={bekliyor}>
        {bekliyor ? 'Kaydediliyor…' : duzenleme ? 'Değişiklikleri kaydet' : 'Kaydı ekle'}
      </button>
      {duzenleme && <> <a className="btn ikincil" href="/admin/guvenlik-bulgulari">Vazgeç</a></>}
    </form>
  );
}
