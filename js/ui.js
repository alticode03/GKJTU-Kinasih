// ==================== TOAST & UI ====================
function showToast(msg, type) {
  type = type || 'info';
  var c = document.getElementById('toastContainer');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function() { t.style.animation = 'fadeInRight 0.3s ease reverse'; setTimeout(function() { t.remove(); }, 300); }, 3000);
}

function createRipple(event) {
  var button = event.currentTarget, ripple = document.createElement('span');
  ripple.className = 'ripple';
  var rect = button.getBoundingClientRect(), size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
  button.appendChild(ripple);
  setTimeout(function() { ripple.remove(); }, 600);
}

document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() { menu.classList.toggle('open'); });
    document.addEventListener('click', function(e) { if (!menu.contains(e.target) && !toggle.contains(e.target)) menu.classList.remove('open'); });
  }
  document.querySelectorAll('.btn-peach, .btn-soft, .btn-primary, .btn-sm').forEach(function(btn) { btn.addEventListener('click', createRipple); });
  var adminToggle = document.getElementById('adminMenuToggle'), adminNav = document.getElementById('adminNav');
  if (adminToggle && adminNav) {
    adminToggle.addEventListener('click', function() { adminNav.classList.toggle('open'); });
    adminNav.querySelectorAll('.admin-nav-link').forEach(function(link) { link.addEventListener('click', function() { adminNav.classList.remove('open'); }); });
  }
  if (window.IntersectionObserver) {
    var observer = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.style.animation = 'fadeIn 0.5s ease forwards'; observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.event-card, .schedule-card, .warta-card, .renungan-item').forEach(function(card) { card.style.opacity = '0'; observer.observe(card); });
  }
});