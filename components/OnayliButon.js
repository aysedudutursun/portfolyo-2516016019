'use client';
// Silme gibi geri alınamaz işlemlerden önce onay soran düğme.
export default function OnayliButon({ soru = 'Emin misiniz?', children, className = 'btn tehlike kucuk' }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => { if (!window.confirm(soru)) e.preventDefault(); }}
    >
      {children}
    </button>
  );
}
