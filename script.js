// Maps.js - WebGIS Pariwisata Bandung (Lengkap & Interaktif - Versi Final 100% Full)
// =====================================================

// Global variables
let map;
let baseLayers = {};
let currentMarkers = L.layerGroup();
let routingControl = null;
let slideInterval;
let locations = []; // Data wisata (dummy awal, siap CSV)

// Data Dummy Lengkap (6 lokasi, dilengkapi reviews, images, keramaian)
locations = [
  {
    id: 1,
    name: "Kawah Putih",
    category: "alam",
    lat: -7.166,
    lng: 107.402,
    rating: 4.5,
    reviewCount: 234,
    image: "https://via.placeholder.com/300x200?text=Kawah+Putih",
    images: [
      "https://via.placeholder.com/800x400?text=Kawah+Putih+1",
      "https://via.placeholder.com/800x400?text=Kawah+Putih+2",
      "https://via.placeholder.com/800x400?text=Kawah+Putih+3"
    ],
    description: "Danau kawah vulkanik yang menakjubkan dengan air berwarna putih kehijauan. Terletak di ketinggian 2.434 meter di atas permukaan laut, kawah ini menawarkan pemandangan yang spektakuler dan udara yang sejuk. Keramaian: Sedang 🚦",
    address: "Ciwidey, Kabupaten Bandung",
    hours: "08:00 - 17:00",
    contact: "+62 22 5891234",
    price: "Rp 25.000",
    facilities: ["Parkir", "Toilet", "Warung", "Spot Foto"],
    reviews: ["Tempatnya keren! Pemandangan luar biasa.", "Sangat direkomendasikan untuk pecinta alam.", "Keramaian sedang, cocok untuk foto."]
  },
  {
    id: 2,
    name: "Gedung Sate",
    category: "budaya",
    lat: -6.902,
    lng: 107.619,
    rating: 4.3,
    reviewCount: 189,
    image: "https://via.placeholder.com/300x200?text=Gedung+Sate",
    images: [
      "https://via.placeholder.com/800x400?text=Gedung+Sate+1",
      "https://via.placeholder.com/800x400?text=Gedung+Sate+2"
    ],
    description: "Bangunan bersejarah yang menjadi ikon Kota Bandung. Dibangun pada tahun 1920, gedung ini merupakan kantor gubernur Jawa Barat dan memiliki arsitektur yang unik dengan menara yang menyerupai tusuk sate. Keramaian: Rendah 🚦",
    address: "Jl. Diponegoro No.22, Citarum",
    hours: "08:00 - 16:00",
    contact: "+62 22 4264813",
    price: "Gratis",
    facilities: ["Parkir", "Museum", "Taman", "Tur Gratis"],
    reviews: ["Sejarahnya menarik, wajib dikunjungi.", "Arsitektur indah, foto bagus."]
  },
  {
    id: 3,
    name: "Trans Studio Bandung",
    category: "rekreasi",
    lat: -6.973,
    lng: 107.63,
    rating: 4.4,
    reviewCount: 345,
    image: "https://via.placeholder.com/300x200?text=Trans+Studio",
    images: [
      "https://via.placeholder.com/800x400?text=Trans+Studio+1",
      "https://via.placeholder.com/800x400?text=Trans+Studio+2"
    ],
    description: "Taman hiburan indoor terbesar di Indonesia. Nikmati berbagai wahana seru dan pertunjukan spektakuler. Keramaian: Tinggi 🚦",
    address: "Jl. Gatot Subroto No.289",
    hours: "10:00 - 22:00",
    contact: "+62 22 87242000",
    price: "Rp 50.000",
    facilities: ["Parkir", "Restoran", "Game Corner", "Showroom"],
    reviews: ["Seru banget untuk keluarga!", "Wahana lengkap, worth it."]
  },
  {
    id: 4,
    name: "Jalan Braga",
    category: "kuliner",
    lat: -6.917,
    lng: 107.609,
    rating: 4.2,
    reviewCount: 456,
    image: "https://via.placeholder.com/300x200?text=Jalan+Braga",
    images: [
      "https://via.placeholder.com/800x400?text=Jalan+Braga+1",
      "https://via.placeholder.com/800x400?text=Jalan+Braga+2"
    ],
    description: "Jalan bersejarah dengan berbagai kuliner khas Bandung. Cicipi sate, nasi goreng, dan makanan street food autentik. Keramaian: Sedang 🚦",
    address: "Jl. Braga, Sumur Bandung",
    hours: "24 jam",
    contact: "-",
    price: "Rp 10.000",
    facilities: ["Parkir", "Warung", "Kafe", "Spot Foto"],
    reviews: ["Kuliner enak dan murah.", "Suasana malam ramai."]
  },
  {
    id: 5,
    name: "Tangkuban Perahu",
    category: "alam",
    lat: -6.76,
    lng: 107.609,
    rating: 4.6,
    reviewCount: 567,
    image: "https://via.placeholder.com/300x200?text=Tangkuban+Perahu",
    images: [
      "https://via.placeholder.com/800x400?text=Tangkuban+1",
      "https://via.placeholder.com/800x400?text=Tangkuban+2"
    ],
    description: "Gunung berapi aktif dengan kawah yang spektakuler. Keramaian: Tinggi 🚦",
    address: "Cikole, Lembang",
    hours: "08:00 - 17:00",
    contact: "+62 22 2786482",
    price: "Rp 30.000",
    facilities: ["Parkir", "Toilet", "Warung", "Spot Foto"],
    reviews: ["Kawahnya indah!", "Hati-hati dengan belerang."]
  },
  {
    id: 6,
    name: "Museum Geologi",
    category: "budaya",
    lat: -6.9,
    lng: 107.621,
    rating: 4.1,
    reviewCount: 678,
    image: "https://via.placeholder.com/300x200?text=Museum+Geologi",
    images: [
      "https://via.placeholder.com/800x400?text=Museum+1",
      "https://via.placeholder.com/800x400?text=Museum+2"
    ],
    description: "Museum yang menampilkan koleksi geologi Indonesia. Keramaian: Rendah 🚦",
    address: "Jl. Diponegoro No.57",
    hours: "08:00 - 16:00",
    contact: "+62 22 7213822",
    price: "Rp 15.000",
    facilities: ["Parkir", "Museum", "Taman", "Warung"],
    reviews: ["Koleksi fosil menarik.", "Pendidikan bagus untuk anak."]
  }
];

// Fungsi Load dari CSV (Siap digunakan - uncomment di init untuk aktif)
async function loadFromCSV() {
  try {
    // Ganti './data.csv' dengan path file CSV Anda
    const response = await fetch('./data.csv');
    if (!response.ok) throw new Error('CSV not found');
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { 
      header: true, 
      dynamicTyping: true, 
      skipEmptyLines: true 
    });
    locations = parsed.data
      .filter(row => row.name && row.lat && row.lng) // Filter row valid
      .map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        rating: parseFloat(row.rating) || 4.0,
        reviewCount: parseInt(row.reviewCount) || 100,
        image: row.image || `https://via.placeholder.com/300x200?text=${row.name}`,
        images: JSON.parse(row.images || '["https://via.placeholder.com/800x400?text=Default"]'), // Parse JSON array
        description: row.description || 'Deskripsi default.',
        address: row.address || 'Bandung',
        hours: row.hours || '08:00 - 17:00',
        contact: row.contact || '+62 ...',
        price: row.price || 'Rp 20.000',
        reviews: (row.reviews || '').split(';').filter(r => r.trim()) || ['Review default.'], // Split by ';'
        facilities: (row.facilities || '').split(',').map(f => f.trim()) || []
      }));
    console.log(`[Maps] Loaded ${locations.length} locations from CSV`);
    addMarkers(); // Refresh markers setelah load
  } catch (error) {
    console.error('[Maps] CSV load error:', error);
    alert('Gagal load data CSV. Menggunakan data dummy.');
  }
}

// Inisialisasi saat DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Maps] Initializing WebGIS Pariwisata Bandung...');
  // loadFromCSV(); // Uncomment ini untuk load dari CSV (pastikan file data.csv ada)
  initializeMap();
  initializeEventListeners();
  initializeAnimations();
  console.log('[Maps] Initialization complete!');
});

// Inisialisasi Map
function initializeMap() {
  console.log('[Maps] Setting up Leaflet map...');
  // Buat map instance
  map = L.map('map', { 
    zoomControl: true,
    minZoom: 8,
    maxZoom: 18
  }).setView([-6.917, 107.619], 11); // Center Bandung

  // Base Layers (awal: dark cyberpunk)
  baseLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
    maxZoom: 19
  });

  baseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19
  });

  baseLayers.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  });

  // Tambah layer awal (dark)
  baseLayers.dark.addTo(map);

  // Efek cyberpunk: Filter tiles untuk neon/gelap
  map.getPanes().tilePane.style.filter = 'hue-rotate(200deg) saturate(1.2) brightness(0.7) contrast(1.1)';

  // Layers tambahan (dummy GeoJSON - ganti dengan data real)
  const roadLayer = L.geoJSON(roadGeoJSON, {
    style: { color: '#a855f7', weight: 3, opacity: 0.8 } // Neon ungu untuk jalan
  }).addTo(map);

  const waterLayer = L.geoJSON(waterGeoJSON, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 5, color: '#10b981' }) // Neon hijau untuk sungai
  }).addTo(map);

  const landmarkLayer = L.geoJSON(landmarkGeoJSON, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 8, color: '#ef4444' }) // Neon merah untuk landmark
  }).addTo(map);

  // Tambah markers awal
  addMarkers();

  // Layer control (untuk switch base map)
  L.control.layers(baseLayers).addTo(map);

  console.log('[Maps] Map setup complete with dark base layer.');
}

// Dummy GeoJSON untuk layers (ganti dengan data real dari CSV atau API)
const roadGeoJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "LineString", coordinates: [[107.619, -6.917], [107.620, -6.918], [107.621, -6.919]] }, properties: { name: "Jalan Utama Bandung" } }
  ]
};

const waterGeoJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [107.61, -6.92] }, properties: { name: "Sungai Citarum" } }
  ]
};

const landmarkGeoJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [107.62, -6.90] }, properties: { name: "Monas Bandung" } }
  ]
};

// Tambah Markers dengan Filter
function addMarkers() {
  currentMarkers.clearLayers();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
  let visibleLocations = locations;
  if (activeFilter !== 'all') {
    visibleLocations = locations.filter(loc => loc.category === activeFilter);
  }

  visibleLocations.forEach(loc => {
    const iconColor = getCategoryColor(loc.category);
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 0 10px ${iconColor}; transition: all 0.3s ease;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
    
    // Bind pop-up minimalist
    marker.bindPopup(createPopup(loc));
    
    // Hover glow & scale
    marker.on('mouseover', () => {
      const el = marker.getElement().querySelector('div');
      if (el) {
        el.style.boxShadow = `0 0 20px ${iconColor}, 0 0 30px ${iconColor}`;
        el.style.transform = 'scale(1.5)';
      }
    });
    marker.on('mouseout', () => {
      const el = marker.getElement().querySelector('div');
      if (el) {
        el.style.boxShadow = `0 0 10px ${iconColor}`;
        el.style.transform = 'scale(1)';
      }
    });

    currentMarkers.addLayer(marker);
  });
  currentMarkers.addTo(map);
  console.log(`[Maps] Added ${visibleLocations.length} markers for filter: ${activeFilter}`);
}

// Get category color untuk icon neon
function getCategoryColor(category) {
  const colors = { 
    alam: '#10b981',      // Green
    budaya: '#ef4444',    // Red
    kuliner: '#f59e0b',   // Orange
    rekreasi: '#a855f7'   // Purple
  };
  return colors[category] || '#6366f1'; // Default blue
}

// Create Pop-up Minimalist
function createPopup(loc) {
  return `
    <div class="popup-content" style="min-width: 200px; padding: 10px; background: var(--sidebar-bg); border-radius: 10px; backdrop-filter: blur(10px); border: 1px solid var(--neon-blue); color: var(--text-primary);">
      <img src="${loc.image}" alt="${loc.name}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
      <h4 style="margin: 0 0 5px 0; color: var(--neon-purple); font-size: 1.1rem;">${loc.name}</h4>
      <p style="margin: 0 0 5px 0; color: var(--neon-orange);">${'⭐'.repeat(Math.floor(loc.rating))}</p>
      <p style="margin: 0 0 10px 0; color: var(--text-secondary); font-size: 0.9rem;">${loc.category.charAt(0).toUpperCase() + loc.category.slice(1)}</p>
      <button onclick="openFullscreenPanel(${loc.id})" style="background: var(--neon-blue); color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; width: 100%; transition: all 0.3s;">Selengkapnya</button>
    </div>
  `;
}

// Open Fullscreen Panel
window.openFullscreenPanel = function(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return console.error('[Maps] Location not found:', id);

  // Update konten panel
 

  // Update konten
  document.getElementById('panelTitle').textContent = loc.name;
  document.getElementById('panelRating').innerHTML = `${'⭐'.repeat(Math.floor(loc.rating))} ${loc.rating} (${loc.reviewCount} ulasan)`;
  document.getElementById('panelCategory').textContent = loc.category.toUpperCase();
  document.getElementById('panelDescription').innerHTML = `
    <p>${loc.description}</p>
    <p><strong>Alamat:</strong> ${loc.address}</p>
    <p><strong>Kontak:</strong> ${loc.contact}</p>
    <p><strong>Jam Operasional:</strong> ${loc.hours}</p>
    <p><strong>Harga:</strong> ${loc.price}</p>
  `;
  document.getElementById('panelReviews').innerHTML = `
    <h4>Reviews (${loc.reviews.length})</h4>
    <div style="max-height: 200px; overflow-y: auto;">
      ${loc.reviews.map(review => `<p style="margin: 5px 0; color: var(--text-secondary);">"${review}"</p>`).join('')}
    </div>
  `;

  const slider = document.getElementById('photoSlider');
slider.innerHTML = `
  <div class="slider-images" style="position: relative; height: 300px; overflow: hidden; border-radius: 10px;">
    ${loc.images.map((img, i) => `
      <img src="${img}" alt="${loc.name}" style="
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: ${i === 0 ? 1 : 0};
        transition: opacity 0.5s;
      ">
    `).join('')}
  </div>
  <div class="slider-dots" style="text-align: center; margin-top: 10px;">
    ${loc.images.map((_, i) => `
      <span class="dot ${i === 0 ? 'active' : ''}" 
            onclick="currentSlide(${i}, ${loc.images.length})" 
            style="
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: ${i === 0 ? 'var(--neon-blue)' : 'var(--text-secondary)'};
              margin: 0 5px;
              cursor: pointer;
            ">
      </span>
    `).join('')}
  </div>
`;
    }

    function currentSlide(index, total) {
  const images = document.querySelectorAll('.slider-images img');
  const dots = document.querySelectorAll('.slider-dots .dot');

  images.forEach((img, i) => {
    img.style.opacity = i === index ? 1 : 0;
  });

  dots.forEach((dot, i) => {
    dot.style.background = i === index ? 'var(--neon-blue)' : 'var(--text-secondary)';
  });
}
