
  const video = document.getElementById('bandungVideo');
  const playBtn = document.getElementById('playBtn');

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();                 // mainkan video
      playBtn.textContent = "⏸";   // ubah ikon jadi pause
      playBtn.style.opacity = 0.5;  // tetap terlihat tapi transparan
    } else {
      video.pause();                // pause video
      playBtn.textContent = "▶";   // ubah ikon jadi play
      playBtn.style.opacity = 1;    // lebih terlihat saat pause
    }
  });

