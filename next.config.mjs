/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tüm sayfalara temel güvenlik başlıkları
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' }, // panel başka sitede iframe içine alınamaz (clickjacking)
        ],
      },
    ];
  },
};

export default nextConfig;
