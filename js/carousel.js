// Carousel otomatis untuk section About
var carouselImages = ['/assets/images/Gereja-1.webp', '/assets/images/Gereja-3.webp', '/assets/images/Gereja-2.webp'];
var currentImageIndex = 0;
var carouselInterval;

function switchCarouselImage(index) {
  currentImageIndex = index;
  var carouselImg = document.getElementById('carouselImage');
  if (carouselImg) {
    carouselImg.style.opacity = '0';
    setTimeout(function() {
      carouselImg.src = carouselImages[currentImageIndex];
      carouselImg.style.opacity = '1';
      updateCarouselDots();
    }, 300);
  }
  clearInterval(carouselInterval);
  startCarouselAutoPlay();
}

function updateCarouselDots() {
  var dots = document.querySelectorAll('.carousel-dot');
  dots.forEach(function(dot, idx) {
    if (idx === currentImageIndex) {
      dot.style.background = '#fff';
      dot.style.borderColor = '#fff';
    } else {
      dot.style.background = 'rgba(255,255,255,0.5)';
      dot.style.borderColor = 'rgba(255,255,255,0.5)';
    }
  });
}

function autoPlayCarousel() {
  currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
  var carouselImg = document.getElementById('carouselImage');
  if (carouselImg) {
    carouselImg.style.opacity = '0';
    setTimeout(function() {
      carouselImg.src = carouselImages[currentImageIndex];
      carouselImg.style.opacity = '1';
      updateCarouselDots();
    }, 300);
  }
}

function startCarouselAutoPlay() {
  carouselInterval = setInterval(autoPlayCarousel, 5000);
}

// Inisialisasi carousel saat halaman load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    var carouselImg = document.getElementById('carouselImage');
    if (carouselImg) {
      carouselImg.style.transition = 'opacity 0.3s ease-in-out';
    }
    startCarouselAutoPlay();
  });
} else {
  var carouselImg = document.getElementById('carouselImage');
  if (carouselImg) {
    carouselImg.style.transition = 'opacity 0.3s ease-in-out';
  }
  startCarouselAutoPlay();
}
