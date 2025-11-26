// js/main.js - shared by all pages
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle (persist)
  function applyTheme(){
    if(localStorage.getItem('eco_theme') === 'dark'){
      document.documentElement.style.background = '#051615';
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  applyTheme();
  document.querySelectorAll('[id^="themeToggle"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = localStorage.getItem('eco_theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('eco_theme', cur);
      applyTheme();
    });
  });

  // Nav active state (mark current page)
  document.querySelectorAll('.main-nav a').forEach(a => {
    try {
      const href = a.getAttribute('href');
      const current = location.pathname.split('/').pop() || 'index.html';
      if(href === current || (href === 'index.html' && current === '')) {
        a.classList.add('active');
      }
    } catch(e){}
  });

  // Demo localStorage seeded user
  (function seed(){
    const users = JSON.parse(localStorage.getItem('eco_users') || '{}');
    if(!users['demo@eco.org']){
      users['demo@eco.org'] = { name:'Demo User', email:'demo@eco.org', password:'password', credits:12 };
      localStorage.setItem('eco_users', JSON.stringify(users));
    }
  })();

  // Register page handler
  const registerForm = document.getElementById('registerPageForm') || document.getElementById('registerForm');
  if(registerForm){
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = (document.getElementById('name') || document.getElementById('r_name')).value.trim();
      const email = (document.getElementById('email') || document.getElementById('r_email')).value.trim().toLowerCase();
      const pwd = (document.getElementById('password') || document.getElementById('r_password')).value || 'password';
      const msgEl = document.getElementById('registerMsg') || document.getElementById('regMsg');
      if(!name || !email){ if(msgEl) msgEl.textContent = 'Name and email are required'; return; }
      const users = JSON.parse(localStorage.getItem('eco_users') || '{}');
      if(users[email]) { if(msgEl) msgEl.textContent = 'Email already registered (demo)'; return; }
      users[email] = { name, email, password: pwd, credits: 0 };
      localStorage.setItem('eco_users', JSON.stringify(users));
      if(msgEl) msgEl.textContent = 'Registered (demo). Use password: ' + pwd;
      setTimeout(()=> location.href = 'login.html', 900);
    });
  }

  // Login page handler
  const loginForm = document.getElementById('loginPageForm') || document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = (document.getElementById('loginEmail') || document.getElementById('l_email')).value.trim().toLowerCase();
      const pass = (document.getElementById('loginPass') || document.getElementById('l_pass')).value;
      const msgEl = document.getElementById('loginMsgPage') || document.getElementById('loginMsg');
      const users = JSON.parse(localStorage.getItem('eco_users') || '{}');
      if(!users[email]) { if(msgEl) msgEl.textContent = 'No account found'; return; }
      if(users[email].password !== pass) { if(msgEl) msgEl.textContent = 'Incorrect password (demo)'; return; }
      localStorage.setItem('eco_session', email);
      if(msgEl) msgEl.textContent = 'Logged in as ' + users[email].name;
      setTimeout(()=> location.href = 'index.html', 700);
    });
  }

  // Volunteer page
  const volForm = document.getElementById('volunteerPageForm') || document.getElementById('volForm');
  if(volForm){
    volForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('volName') ? document.getElementById('volName').value.trim() : document.getElementById('v_name').value.trim();
      const mobile = document.getElementById('volMobile') ? document.getElementById('volMobile').value.trim() : document.getElementById('v_mobile').value.trim();
      const loc = document.getElementById('volLoc') ? document.getElementById('volLoc').value.trim() : document.getElementById('v_loc').value.trim();
      const msgEl = document.getElementById('volMsgPage') || document.getElementById('volMsg');
      if(!name){ if(msgEl) msgEl.textContent = 'Please enter your name'; return; }
      const vols = JSON.parse(localStorage.getItem('eco_vols') || '[]');
      vols.push({ name, mobile, loc, ts: Date.now() });
      localStorage.setItem('eco_vols', JSON.stringify(vols));
      if(msgEl) msgEl.textContent = 'Thanks — volunteer registered (demo).';
      volForm.reset();
    });
  }

  // Claim credits function (map popup uses this)
  window.claimPoint = function(placeName){
    const session = localStorage.getItem('eco_session');
    if(!session){ alert('Please login to claim credits'); window.location = 'login.html'; return; }
    const users = JSON.parse(localStorage.getItem('eco_users') || '{}');
    users[session].credits = (users[session].credits || 0) + 5;
    localStorage.setItem('eco_users', JSON.stringify(users));
    alert('5 credits added to your account for visiting ' + placeName);
  };

  // Populate any header-cta login state
  (function updateHeaderCTAs(){
    const session = localStorage.getItem('eco_session');
    if(session){
      document.querySelectorAll('.header-cta .primary').forEach(btn => btn.textContent = 'Dashboard');
    }
  })();

});
// simple entry animations for feature cards and badges
document.addEventListener('DOMContentLoaded', () => {
  // stagger reveal for .step elements
  const steps = document.querySelectorAll('.step');
  steps.forEach((el,i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(12px)';
    setTimeout(() => {
      el.style.transition = 'all .45s cubic-bezier(.2,.9,.2,1)';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 140 + i*120);
  });

  // small pulse loop on badges
  const badges = document.querySelectorAll('.badge');
  badges.forEach((b, idx) => {
    setTimeout(() => {
      b.animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }, { transform:'scale(1)' }], { duration: 1400 + idx*200, iterations: Infinity });
    }, 600 + idx*120);
  });
});
