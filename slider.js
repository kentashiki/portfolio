let currentSlideIndex = 0;
let autoSlideInterval = null;
const AUTO_SLIDE_DELAY =7000; // 7秒ごとに自動スライド

function slideCarousel(direction) {
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.dot');
  
  if (!track || cards.length === 0) return;
  
  // 現在のインデックスを更新
  currentSlideIndex += direction;
  
  // ループ処理
  if (currentSlideIndex < 0) {
    currentSlideIndex = cards.length - 1;
  } else if (currentSlideIndex >= cards.length) {
    currentSlideIndex = 0;
  }
  
  // スライドを移動
  const offset = -currentSlideIndex * 100;
  track.style.transform = `translateX(${offset}%)`;
  
  // ドットを更新
  updateDots(dots);
  
  // 自動再生をリセット
  resetAutoSlide();
}

function goToSlide(index) {
  const track = document.querySelector('.carousel-track');
  const dots = document.querySelectorAll('.dot');
  
  if (!track) return;
  
  currentSlideIndex = index;
  
  // スライドを移動
  const offset = -currentSlideIndex * 100;
  track.style.transform = `translateX(${offset}%)`;
  
  // ドットを更新
  updateDots(dots);
  
  // 自動再生をリセット
  resetAutoSlide();
}

function updateDots(dots) {
  dots.forEach((dot, i) => {
    if (i === currentSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// 自動スライド機能
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    slideCarousel(1);
  }, AUTO_SLIDE_DELAY);
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

// キーボード操作のサポート
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    slideCarousel(-1);
  } else if (e.key === 'ArrowRight') {
    slideCarousel(1);
  }
});

// タッチスワイプのサポート
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-container');
  
  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide(); // タッチ開始時に自動再生を停止
    });
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  
  if (container) {
    // マウスホバー時は自動再生を一時停止
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
  }
  
  // 自動スライドを開始
  startAutoSlide();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 左スワイプ - 次のスライド
      slideCarousel(1);
    } else {
      // 右スワイプ - 前のスライド
      slideCarousel(-1);
    }
  }
}