// /giris, /iletisim ve /admin sayfalarının ortak çerçevesi.
// (Ana sayfa "/" ayrı: app/route.js)
import './panel.css';

export const metadata = {
  title: { default: 'Ayşe Dudu Tursun', template: '%s · Ayşe Dudu Tursun' },
  robots: { index: false }, // panel ve form sayfaları arama motorlarında listelenmesin
};

export default function Layout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
