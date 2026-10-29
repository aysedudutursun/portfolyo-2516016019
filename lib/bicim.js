// Tarih ve tarayıcı bilgisini okunur hâle getiren küçük yardımcılar.
export function tarihSaat(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function cihazAdi(ua) {
  if (!ua) return 'Bilinmeyen cihaz';
  const tarayici =
    /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' :
    /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Tarayıcı';
  const sistem =
    /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' :
    /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'bilinmeyen sistem';
  return `${tarayici} · ${sistem}`;
}
