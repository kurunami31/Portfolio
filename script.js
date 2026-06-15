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
    url: 'https://dorsu-recommender.onrender.com/',
    caseStudy: 'case-studies/dorsu-recommender.html'
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
    url: 'https://sweetworks.onrender.com/',
    caseStudy: 'case-studies/sweetworks.html'
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
    url: 'https://resibooth.onrender.com/',
    caseStudy: 'case-studies/resibooth.html'
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
    '  <a href="' + project.caseStudy + '" class="btn btn-secondary">Case Study</a>',
    '  <span class="modal-note">Render free tier &mdash; may take a moment to wake</span>',
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
  var workerUrl = contactForm.getAttribute('data-worker-url');

  contactForm.addEventListener('submit', function (e) {
    var name = this.querySelector('input[name="name"]').value.trim();
    var email = this.querySelector('input[name="_replyto"]').value.trim();
    var message = this.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      showToast('Please fill in all fields');
      return;
    }

    if (workerUrl) {
      e.preventDefault();
      var btn = this.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch(workerUrl, {
        method: 'POST',
        body: new FormData(this)
      }).then(function (r) {
        if (r.ok) {
          showToast('Message sent -- check spam folder if not received');
          contactForm.reset();
        } else {
          showToast('Something went wrong. Try emailing directly.');
        }
      }).catch(function () {
        showToast('Something went wrong. Try emailing directly.');
      }).finally(function () {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      });
    }
  });
}

function animateSkillBars(container) {
  var fills = container.querySelectorAll('.skill-bar-fill');
  fills.forEach(function (fill, i) {
    var percent = parseInt(fill.getAttribute('data-width')) || 0;
    if (fill._animated) return;
    fill._animated = true;
    fill.style.transitionDelay = (i * 80) + 'ms';
    fill.style.width = percent + '%';
  });
}

var revealElements = document.querySelectorAll('.reveal');

var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateSkillBars(entry.target);
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

var navLinks = document.getElementById('navLinks');
var sectionDots = document.querySelectorAll('.dot');
var sections = [];

sectionDots.forEach(function (dot) {
  var id = dot.getAttribute('data-target');
  var el = document.getElementById(id);
  if (el) {
    sections.push(el);
    dot.addEventListener('click', function () {
      el.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

function updateActiveDot() {
  var scrollPos = window.scrollY + 150;
  var active = null;
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].offsetTop <= scrollPos) {
      active = i;
    }
  }
  if (active !== null) {
    sectionDots.forEach(function (d) { d.classList.remove('active'); });
    sectionDots[active].classList.add('active');
    if (navLinks) {
      var links = navLinks.querySelectorAll('a');
      links.forEach(function (l) { l.classList.remove('active'); });
      if (links[active]) links[active].classList.add('active');
    }
  }
}

window.addEventListener('scroll', updateActiveDot, { passive: true });
updateActiveDot();

var repoGrid = document.getElementById('repoGrid');

function fetchRepos() {
  fetch('https://api.github.com/users/kurunami31/repos?sort=updated&per_page=6&type=public')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      repoGrid.innerHTML = data.map(function (repo) {
        var langColor = repo.language ? langColors[repo.language] || '#666' : '#666';
        return '<div class="repo-card">' +
          '<a href="' + repo.html_url + '" target="_blank" class="repo-name">' + repo.name + '</a>' +
          (repo.description ? '<p class="repo-desc">' + repo.description + '</p>' : '') +
          '<div class="repo-meta">' +
          '<span><span class="repo-lang-dot" style="background:' + langColor + '"></span>' + (repo.language || 'N/A') + '</span>' +
          '<span>&#9733; ' + (repo.stargazers_count || 0) + '</span>' +
          '<span>&#9660; ' + (repo.forks_count || 0) + '</span>' +
          '</div></div>';
      }).join('');
    })
    .catch(function () {
      repoGrid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;font-size:14px;">Could not load repos.</p>';
    });
}

var langColors = {
  'JavaScript': '#f1e05a', 'Python': '#3572A5', 'HTML': '#e34c26',
  'CSS': '#563d7c', 'PHP': '#4F5D95', 'TypeScript': '#3178c6',
  'Java': '#b07219', 'C++': '#f34b7d', 'C': '#555555',
  'Ruby': '#701516', 'Go': '#00ADD8', 'Rust': '#dea584',
  'Swift': '#ffac45', 'Kotlin': '#F18E33', 'Dart': '#00B4AB',
  'Shell': '#89e051', 'Jupyter Notebook': '#DA5B0B'
};

fetchRepos();

var favIcon = document.querySelector('link[rel="icon"]');
var favicons = ['favicon.svg', 'camera-favicon.svg'];
var favIndex = 0;

function toggleFavicon() {
  favIndex = (favIndex + 1) % favicons.length;
  if (favIcon) favIcon.setAttribute('href', favicons[favIndex]);
}

document.addEventListener('visibilitychange', function () {
  if (document.hidden) toggleFavicon();
});

// -- Keyboard shortcuts --

var shortcutsOverlay = document.getElementById('shortcutsOverlay');
var sectionIds = ['hero', 'career', 'projects', 'writing'];

document.addEventListener('keydown', function (e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === '?' && !e.shiftKey) return;
  if (e.key === '?' && e.shiftKey) {
    e.preventDefault();
    shortcutsOverlay.classList.toggle('open');
    return;
  }

  if (e.key === 'Escape') {
    if (shortcutsOverlay.classList.contains('open')) {
      shortcutsOverlay.classList.remove('open');
      return;
    }
  }

  if (e.key === 't') {
    e.preventDefault();
    themeToggle.click();
    return;
  }

  if (e.key === 'j' || e.key === 'k') {
    e.preventDefault();
    var current = -1;
    var scrollPos = window.scrollY + 200;
    for (var si = 0; si < sectionIds.length; si++) {
      var sec = document.getElementById(sectionIds[si]);
      if (sec && sec.offsetTop <= scrollPos) current = si;
    }
    var next = e.key === 'j' ? Math.min(current + 1, sectionIds.length - 1) : Math.max(current - 1, 0);
    var target = document.getElementById(sectionIds[next]);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  var num = parseInt(e.key);
  if (num >= 1 && num <= 4) {
    e.preventDefault();
    var sec = document.getElementById(sectionIds[num - 1]);
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  }
});

shortcutsOverlay.querySelector('.shortcuts-close').addEventListener('click', function () {
  shortcutsOverlay.classList.remove('open');
});


