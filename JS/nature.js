// Inisialisasi peta Leaflet
const map = L.map('map').setView([-6.9175, 107.6191], 10); // contoh koordinat Bandung

// Tambahkan tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tambahkan marker
const markers = [
    { lat: -6.9175, lng: 107.6191, popup: "Pusat Bandung" },
    { lat: -6.9235, lng: 107.6036, popup: "Taman Hutan" },
    { lat: -6.9500, lng: 107.6200, popup: "Curug Cimahi" }
];

markers.forEach(m => {
    L.marker([m.lat, m.lng]).addTo(map)
     .bindPopup(m.popup);
});

// Tombol lihat maps
document.getElementById('lihatMapsBtn').addEventListener('click', () => {
    map.flyTo([-6.9175, 107.6191], 12); // contoh zoom ke pusat Bandung
});

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.team-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    const group = btn.parentElement; // kategori atau popularity

    // Jika tombol All diklik → reset semua di grup
    if(filter === 'all') {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    } else {
      btn.classList.toggle('active');
      // hapus active pada All jika ada
      const allBtn = group.querySelector('.filter-btn[data-filter="all"]');
      if(allBtn) allBtn.classList.remove('active');
    }

    // Ambil semua filter aktif kecuali All
    const activeFilters = Array.from(document.querySelectorAll('.filter-btn.active'))
                               .filter(b => b.dataset.filter !== 'all')
                               .map(b => b.dataset.filter);

    // Tampilkan atau sembunyikan card
    cards.forEach(card => {
      let show = true;
      if(activeFilters.length > 0) {
        show = activeFilters.some(f => card.dataset.category === f || card.dataset.popularity === f);
      }
      card.classList.toggle('hide', !show);
    });
  });
});
