Papa.parse("../Data/LokasiLengkap_Alam.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const grid = document.getElementById("teamGrid");
    const allData = results.data.filter(row => row.Nama);
    const maxColumns = 5;
    const maxRows = 5;
    const showingCount = maxColumns * maxRows;

    // Fungsi render card grid
    function renderCards(data, limit = showingCount) {
      grid.innerHTML = "";
      data.slice(0, limit).forEach(row => {
        const kategori = (row.Kategori || "").toLowerCase() === "camping" ? "camp" : (row.Kategori || "").toLowerCase();
        const imgUrl = row.gambar || "https://via.placeholder.com/180x120?text=No+Image";

        const card = document.createElement("div");
        card.className = "team-card";
        card.dataset.category = kategori;
        card.dataset.popularity = (row.Popularity || "popular").toLowerCase();

        card.innerHTML = `
          <div class="team-avatar" style="background-image: url('${imgUrl}');"></div>
          <h3>${row.Nama}</h3>
          <a href="#" class="see-more">See More</a>
        `;

        // Event klik See More → buka modal
        card.querySelector('.see-more').addEventListener('click', e => {
          e.preventDefault();
          openModal(row);
        });

        grid.appendChild(card);
      });
    }

    // Render awal
    renderCards(allData, showingCount);

    // Filtering
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        let filteredData;

        if (filter === "all") {
          filteredData = allData;
        } else {
          filteredData = allData.filter(row => {
            const cat = (row.Kategori || "").toLowerCase();
            const pop = (row.Popularity || "popular").toLowerCase();
            const normCat = cat === "camping" ? "camp" : cat;
            return normCat === filter || pop === filter;
          });
        }

        renderCards(filteredData, filter === "all" ? filteredData.length : showingCount);
      });
    });

    // MODAL
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const spanClose = document.querySelector('.modal .close');

    function openModal(data) {
      const imgUrl = data.gambar || "https://via.placeholder.com/300x200?text=No+Image";
      
      modalBody.innerHTML = `
        <div class="tour-card">
          <div class="card-image">
            <img src="${imgUrl}" alt="${data.Nama}">
          </div>
          <div class="card-content">
            <h2>${data.Nama} <span class="rating">⭐ ${data.Rating || '4.5'}</span></h2>
            <p class="category">${data.Kategori || '-'}</p>
            <p class="address">
                    ${[
                        data.Jalan,
                        data['Desa/Kelurahan'],
                        data.Kecamatan,
                        data['Kabupaten/Kota'],
                        data.Provinsi
                    ].filter(Boolean).join(', ')} </p>
            <p class="phone">${data.Kontak || '-'}</p>
          
             <div class="buttons">
                <button class="btn route-btn" onclick="openRoutingPage('${data.Nama}')">Lihat Rute</button>
                <button class="btn payment-btn">Payment</button>
                </div>
          </div>
        </div>
      `;
      modal.style.display = 'flex';
    }


    // Tutup modal
    spanClose.onclick = () => modal.style.display = 'none';
    window.onclick = e => {
      if(e.target === modal) modal.style.display = 'none';
    };
  }
});

function openRoutingPage(destinationName) {
  // simpan nama tujuan di localStorage atau query param
  localStorage.setItem('destination', destinationName);
  window.open('../HTML/routing.html', '_blank');
}








