var theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);

var navbar = document.getElementById('navbar');
var menuToggle = document.getElementById('menuToggle');
var mobileOverlay = document.getElementById('mobileOverlay');
var cursorFollower = document.getElementById('cursorFollower');
var backToTop = document.getElementById('backToTop');
var heroDesc = document.getElementById('heroDesc');
var modalOverlay = document.getElementById('modalOverlay');
var modalBody = document.getElementById('modalBody');
var toast = document.getElementById('toast');
var contactForm = document.getElementById('contactForm');
var themeToggle = document.getElementById('themeToggle');
var loader = document.getElementById('loader');
var printCv = document.getElementById('printCv');

var projects = [
  {
    name: 'DOrSU Program Recommender',
    tagline: 'Davao Oriental State University',
    description: 'An intelligent recommendation system built to help incoming college students identify the most suitable academic program based on their personal interests, strengths, and academic preferences. The system uses a structured evaluation approach to match students with programs offered at DOrSU.',
    tech: ['Python', 'Flask', 'HTML & CSS', 'JavaScript', 'Render'],
    features: [
      'Personalized program recommendations based on student input',
      'Interactive questionnaire interface',
      'Real-time result generation',
      'Mobile-responsive design'
    ],
    url: 'https://dorsu-recommender.onrender.com/'
  },
  {
    name: 'SweetWorks Pastry Shop',
    tagline: 'Artisan pastries, custom cakes & dessert services',
    description: 'A full web presence for SweetWorks, an artisan pastry shop based in Mati City, Davao Oriental. The site showcases their product offerings, highlights their custom cake design services, and provides an online storefront experience for customers.',
    tech: ['Python', 'Flask', 'Bootstrap', 'JavaScript', 'Render'],
    features: [
      'Product catalog with categories',
      'Custom cake ordering inquiries',
      'Business information and location',
      'Social media integration'
    ],
    url: 'https://sweetworks.onrender.com/'
  },
  {
    name: 'Resibooth',
    tagline: 'Self-service photo booth platform',
    description: 'A self-service photo booth platform that brings the photo booth experience online. Users can capture photos, apply customizations, and share their creations digitally without needing physical photo booth hardware.',
    tech: ['Python', 'Flask', 'JavaScript', 'HTML & CSS', 'Render'],
    features: [
      'Virtual photo capture and customization',
      'Digital photo sharing capabilities',
      'User-friendly interface',
      'Fully browser-based, no downloads needed'
    ],
    url: 'https://resibooth.onrender.com/'
  }
];

window.addEventListener('load', function () {
  loader.classList.add('hidden');
});

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

themeToggle.addEventListener('click', function () {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

menuToggle.addEventListener('click', function () {
  this.classList.toggle('active');
  mobileOverlay.classList.toggle('open');
  document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
});

mobileOverlay.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    menuToggle.classList.remove('active');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('mousemove', function (e) {
  cursorFollower.style.left = e.clientX + 'px';
  cursorFollower.style.top = e.clientY + 'px';
  cursorFollower.style.opacity = '1';
});

document.addEventListener('mouseleave', function () {
  cursorFollower.style.opacity = '0';
});

document.querySelectorAll('a, button, .project-card').forEach(function (el) {
  el.addEventListener('mouseenter', function () {
    cursorFollower.style.width = '40px';
    cursorFollower.style.height = '40px';
  });
  el.addEventListener('mouseleave', function () {
    cursorFollower.style.width = '24px';
    cursorFollower.style.height = '24px';
  });
});

function typeWriter(element, text, speed) {
  var index = 0;
  element.innerHTML = '';

  function type() {
    if (index < text.length) {
      element.innerHTML = text.substring(0, index + 1) + '<span class="cursor-blink"></span>';
      index++;
      setTimeout(type, speed);
    } else {
      element.innerHTML = text + '<span class="cursor-blink"></span>';
    }
  }

  type();
}

if (heroDesc) {
  var text = heroDesc.getAttribute('data-text') || heroDesc.textContent;
  typeWriter(heroDesc, text, 18);
}

backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (printCv) {
  printCv.addEventListener('click', function () {
    window.print();
  });
}

function openModal(index) {
  var project = projects[index];
  if (!project) return;

  modalBody.innerHTML = [
    '<div class="modal-header">',
    '  <h2>' + project.name + '</h2>',
    '  <p>' + project.tagline + '</p>',
    '</div>',
    '<div class="modal-tech">',
    project.tech.map(function (t) { return '<span>' + t + '</span>'; }).join(''),
    '</div>',
    '<p class="modal-description">' + project.description + '</p>',
    '<ul class="modal-features">',
    project.features.map(function (f) { return '<li>' + f + '</li>'; }).join(''),
    '</ul>',
    '<div class="modal-footer">',
    '  <a href="' + project.url + '" target="_blank" class="btn btn-primary">Visit Live</a>',
    '</div>'
  ].join('');

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(function (card) {
  card.addEventListener('click', function () {
    var index = parseInt(this.getAttribute('data-project'));
    openModal(index);
  });
});

modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);

modalOverlay.addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    var name = this.querySelector('input[name="name"]').value.trim();
    var email = this.querySelector('input[name="_replyto"]').value.trim();
    var message = this.querySelector('textarea[name="message"]').value.trim();

    if (name && email && message) {
      showToast('Message received -- thanks for reaching out');
    } else {
      e.preventDefault();
      showToast('Please fill in all fields');
    }
  });
}

var revealElements = document.querySelectorAll('.reveal');

var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach(function (el) { revealObserver.observe(el); });

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    var href = this.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
