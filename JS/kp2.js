// Tab switching
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        tabContents.forEach(content => content.style.display = 'none');
        const selectedTab = document.getElementById(tab.dataset.tab);
        selectedTab.style.display = 'block';
    });
});

// Button actions (example)
document.getElementById('lihatRute').addEventListener('click', () => {
    alert('Fungsi lihat rute belum tersedia.');
});

document.getElementById('payment').addEventListener('click', () => {
    alert('Fungsi payment belum tersedia.');
});
