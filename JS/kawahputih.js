// Contoh interaksi sederhana, misal klik tombol See More
const seeMoreBtn = document.querySelector('.see-more');

seeMoreBtn.addEventListener('click', (e) => {
  e.preventDefault();
  alert("Redirecting to detail page...");
});

// Bisa ditambah interaksi lainnya seperti Payment, Lihat Rute, dsb.




