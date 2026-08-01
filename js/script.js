/* ==========================================================================
   Happy Friendship Day — script.js
   Shared logic used across all pages. Every feature checks for the
   relevant DOM element before running, so this single file is safe
   to include on every page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Loading Screen ---------------- */
  const loader = document.getElementById('loading-screen');
  if (loader){
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    // fallback in case 'load' already fired
    setTimeout(() => loader.classList.add('hidden'), 2200);
  }

  /* ---------------- Custom Cursor ---------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && matchMedia('(hover:hover)').matches){
    let rx=0, ry=0, mx=0, my=0;
    window.addEventListener('mousemove', e=>{
      mx=e.clientX; my=e.clientY;
      dot.style.left = mx+'px'; dot.style.top = my+'px';
    });
    (function loop(){
      rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.frame,.gift-card,.envelope,.slide-dots span').forEach(el=>{
      el.addEventListener('mouseenter', ()=>ring.classList.add('active'));
      el.addEventListener('mouseleave', ()=>ring.classList.remove('active'));
    });
  }

  /* ---------------- Scroll Progress Bar ---------------- */
  const progress = document.getElementById('scroll-progress');
  if (progress){
    window.addEventListener('scroll', ()=>{
      const h = document.documentElement;
      const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = pct + '%';
    });
  }

  /* ---------------- Navbar: hide on scroll down, active link, mobile toggle ---------------- */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  if (navbar){
    window.addEventListener('scroll', ()=>{
      const cur = window.scrollY;
      if (cur > lastScroll && cur > 140) navbar.classList.add('nav-hidden');
      else navbar.classList.remove('nav-hidden');
      lastScroll = cur;
    });
  }
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks){
    navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>navLinks.classList.remove('open')));
  }
  // mark active nav link
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  /* ---------------- Back to top ---------------- */
  const backTop = document.getElementById('back-to-top');
  if (backTop){
    window.addEventListener('scroll', ()=>{
      backTop.classList.toggle('show', window.scrollY > 500);
    });
    backTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* ---------------- Dark / Light Mode ---------------- */
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('fd-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  function syncThemeIcon(){
    if (!themeBtn) return;
    themeBtn.textContent = root.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';
  }
  syncThemeIcon();
  if (themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const isLight = root.getAttribute('data-theme') === 'light';
      root.setAttribute('data-theme', isLight ? 'dark' : 'light');
      localStorage.setItem('fd-theme', isLight ? 'dark' : 'light');
      syncThemeIcon();
    });
  }

  /* ---------------- Background Music ---------------- */
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  const eq = document.querySelector('.eq');
  if (music && musicBtn){
    let playing = false;
    const tryPlay = ()=>{
      music.volume = 0.35;
      music.play().then(()=>{ playing = true; musicBtn.textContent='🔊'; eq && eq.classList.remove('paused'); }).catch(()=>{});
    };
    musicBtn.addEventListener('click', ()=>{
      if (playing){ music.pause(); playing=false; musicBtn.textContent='🔈'; eq && eq.classList.add('paused'); }
      else tryPlay();
    });
    // start on first user interaction anywhere on the page (autoplay policy)
    const starter = ()=>{ tryPlay(); document.removeEventListener('click', starter); };
    document.addEventListener('click', starter, {once:true});
  }

  /* ---------------- Floating Hearts + Sparkles Canvas (ambient, all pages) ---------------- */
  const fx = document.getElementById('fx-canvas');
  if (fx){
    const ctx = fx.getContext('2d');
    let W,H;
    function resize(){ W = fx.width = innerWidth; H = fx.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const items = [];
    const glyphs = ['💗','💖','✨','💫'];
    const count = innerWidth < 700 ? 16 : 28;
    for(let i=0;i<count;i++){
      items.push({
        x: Math.random()*W, y: Math.random()*H + H,
        s: 12 + Math.random()*18,
        v: 0.3 + Math.random()*0.6,
        drift: (Math.random()-0.5)*0.6,
        g: glyphs[Math.floor(Math.random()*glyphs.length)],
        o: 0.25 + Math.random()*0.5,
        r: Math.random()*360
      });
    }
    function animate(){
      ctx.clearRect(0,0,W,H);
      items.forEach(p=>{
        p.y -= p.v; p.x += p.drift; p.r += 0.2;
        if (p.y < -30){ p.y = H+30; p.x = Math.random()*W; }
        ctx.save();
        ctx.globalAlpha = p.o;
        ctx.translate(p.x,p.y);
        ctx.font = p.s+'px serif';
        ctx.fillText(p.g, 0, 0);
        ctx.restore();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ---------------- PAGE 1: Typewriter ---------------- */
  const tw = document.getElementById('typewriter');
  if (tw){
    const lines = JSON.parse(tw.dataset.lines || '["A special surprise just for you ❤️"]');
    let li=0, ci=0, deleting=false;
    tw.innerHTML = '<span class="tw-text"></span><span class="caret">&nbsp;</span>';
    const textEl = tw.querySelector('.tw-text');
    function tick(){
      const full = lines[li];
      if (!deleting){
        textEl.textContent = full.slice(0, ++ci);
        if (ci === full.length){ deleting = true; setTimeout(tick, 1600); return; }
      } else {
        textEl.textContent = full.slice(0, --ci);
        if (ci === 0){ deleting = false; li = (li+1)%lines.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  }

  /* ---------------- PAGE 2: Slideshow + Lightbox ---------------- */
  const slides = document.querySelectorAll('.slide');
  if (slides.length){
    let si = 0;
    const dots = document.querySelectorAll('.slide-dots span');
    function showSlide(i){
      slides.forEach(s=>s.classList.remove('active'));
      dots.forEach(d=>d.classList.remove('active'));
      slides[i].classList.add('active');
      dots[i] && dots[i].classList.add('active');
    }
    showSlide(0);
    setInterval(()=>{ si = (si+1)%slides.length; showSlide(si); }, 3000);
    dots.forEach((d,i)=>d.addEventListener('click', ()=>{ si=i; showSlide(si); }));
  }
  const lightbox = document.getElementById('lightbox');
  if (lightbox){
    const lbImg = document.getElementById('lightbox-img');
    document.querySelectorAll('[data-lightbox]').forEach(el=>{
      el.addEventListener('click', ()=>{
        const src = el.dataset.lightbox;
        if (!src) return;
        lbImg.src = src;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', (e)=>{
      if (e.target === lightbox || e.target.id === 'lightbox-close') lightbox.classList.remove('open');
    });
    document.addEventListener('keydown', e=>{ if (e.key==='Escape') lightbox.classList.remove('open'); });
  }

  /* ---------------- PAGE 3: Message typing ---------------- */
  const msgEl = document.getElementById('message-type');
  if (msgEl){
    const full = msgEl.dataset.message || '';
    let i=0;
    msgEl.textContent = '';
    (function type(){
      if (i <= full.length){
        msgEl.textContent = full.slice(0,i);
        i++;
        setTimeout(type, 28);
      }
    })();
  }

  /* ---------------- PAGE 4: Timeline reveal on scroll ---------------- */
  const tlItems = document.querySelectorAll('.tl-item');
  if (tlItems.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if (en.isIntersecting) en.target.classList.add('in-view'); });
    }, {threshold:0.25});
    tlItems.forEach(t=>io.observe(t));
  }
  // generic reveal-on-scroll for .reveal elements
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length){
    const io2 = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if (en.isIntersecting) en.target.classList.add('in-view'); });
    }, {threshold:0.15});
    revealEls.forEach(r=>io2.observe(r));
  }

  /* ---------------- PAGE 5: Gift cards open ---------------- */
  document.querySelectorAll('.gift-card').forEach(card=>{
    card.addEventListener('click', ()=> card.classList.toggle('opened'));
  });

  /* ---------------- PAGE 6: Celebration effects ---------------- */
  const celebrateCanvas = document.getElementById('celebrate-canvas');
  if (celebrateCanvas){ runCelebration(celebrateCanvas, 9000); }

  /* ---------------- PAGE 7: Envelope / Secret Letter ---------------- */
  const envelope = document.getElementById('envelope');
  if (envelope){
    envelope.addEventListener('click', ()=>{
      envelope.classList.add('open');
      const full = document.getElementById('letter-full');
      const letterText = document.getElementById('letter-text');
      setTimeout(()=>{
        full.classList.add('show');
        if (letterText && !letterText.dataset.typed){
          letterText.dataset.typed = '1';
          const msg = letterText.dataset.message || '';
          let i=0; letterText.textContent='';
          (function type(){
            if (i<=msg.length){ letterText.textContent = msg.slice(0,i); i++; setTimeout(type, 32); }
          })();
        }
        full.scrollIntoView({behavior:'smooth', block:'center'});
      }, 900);
    });
  }

  /* ---------------- PAGE 9: Countdown to next Friendship Day ---------------- */
  const cd = document.getElementById('countdown');
  if (cd){
    function nextFriendshipDay(){
      // First Sunday of August
      const now = new Date();
      let year = now.getFullYear();
      function firstSundayOfAugust(y){
        const d = new Date(y,7,1);
        const day = d.getDay();
        const offset = day === 0 ? 0 : 7-day;
        return new Date(y,7,1+offset, 0,0,0);
      }
      let target = firstSundayOfAugust(year);
      if (target < now) target = firstSundayOfAugust(year+1);
      return target;
    }
    const target = nextFriendshipDay();
    const dEl = document.getElementById('cd-days'), hEl = document.getElementById('cd-hours'),
          mEl = document.getElementById('cd-mins'), sEl = document.getElementById('cd-secs');
    function update(){
      const diff = Math.max(0, target - new Date());
      const d = Math.floor(diff/86400000);
      const h = Math.floor(diff%86400000/3600000);
      const m = Math.floor(diff%3600000/60000);
      const s = Math.floor(diff%60000/1000);
      if(dEl) dEl.textContent = String(d).padStart(2,'0');
      if(hEl) hEl.textContent = String(h).padStart(2,'0');
      if(mEl) mEl.textContent = String(m).padStart(2,'0');
      if(sEl) sEl.textContent = String(s).padStart(2,'0');
    }
    update();
    setInterval(update, 1000);
  }

  /* ---------------- PAGE 10: Final surprise + replay ---------------- */
  const finalCanvas = document.getElementById('final-canvas');
  if (finalCanvas){ runCelebration(finalCanvas, 999999, true); }
  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn){
    replayBtn.addEventListener('click', ()=>{ location.href = 'index.html'; });
  }

}); // DOMContentLoaded

/* ==========================================================================
   Celebration engine: confetti + fireworks + heart rain + balloons
   Reusable across Page 6 (Celebration) and Page 10 (Final Surprise).
   ========================================================================== */
function runCelebration(canvas, durationMs, gentle){
  const ctx = canvas.getContext('2d');
  let W,H;
  function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const colors = ['#ff6fa5','#e8b84b','#c2185b','#ffd9ec','#ffffff'];
  const confetti = Array.from({length: gentle?60:110}, ()=>({
    x: Math.random()*W, y: -20-Math.random()*H,
    w: 6+Math.random()*6, h: 10+Math.random()*8,
    speed: 2+Math.random()*3, drift: (Math.random()-0.5)*2,
    rot: Math.random()*360, rotSpeed:(Math.random()-0.5)*8,
    color: colors[Math.floor(Math.random()*colors.length)]
  }));
  const hearts = Array.from({length: gentle?18:30}, ()=>({
    x: Math.random()*W, y: -20-Math.random()*H, size:14+Math.random()*16,
    speed:1+Math.random()*2, drift:(Math.random()-0.5)*1
  }));
  const balloons = Array.from({length:8}, (_,i)=>({
    x: (i+0.5)*(W/8) + (Math.random()-0.5)*40, y: H + Math.random()*300,
    size: 34+Math.random()*22, speed:0.6+Math.random()*0.8,
    color: colors[Math.floor(Math.random()*colors.length)]
  }));
  let fireworks = [];
  function spawnFirework(){
    const fx = Math.random()*W*0.8+W*0.1, fy = Math.random()*H*0.5+H*0.1;
    const particles = [];
    const color = colors[Math.floor(Math.random()*colors.length)];
    for(let i=0;i<40;i++){
      const angle = (Math.PI*2*i)/40;
      const speed = 2+Math.random()*3;
      particles.push({x:fx,y:fy,vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, life:1, color});
    }
    fireworks.push(particles);
  }
  const fwInterval = setInterval(spawnFirework, gentle?1400:900);

  const start = performance.now();
  function loop(t){
    ctx.clearRect(0,0,W,H);

    confetti.forEach(c=>{
      c.y += c.speed; c.x += c.drift; c.rot += c.rotSpeed;
      if (c.y > H+20){ c.y = -20; c.x = Math.random()*W; }
      ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot*Math.PI/180);
      ctx.fillStyle = c.color; ctx.fillRect(-c.w/2,-c.h/2,c.w,c.h);
      ctx.restore();
    });

    ctx.font = '20px serif';
    hearts.forEach(h=>{
      h.y += h.speed; h.x += h.drift;
      if (h.y > H+20){ h.y=-20; h.x = Math.random()*W; }
      ctx.save(); ctx.globalAlpha=0.85; ctx.font = h.size+'px serif';
      ctx.fillText('💗', h.x, h.y); ctx.restore();
    });

    balloons.forEach(b=>{
      b.y -= b.speed;
      if (b.y < -60){ b.y = H+60; b.x = Math.random()*W; }
      ctx.save();
      ctx.fillStyle = b.color; ctx.beginPath();
      ctx.ellipse(b.x,b.y,b.size*0.5,b.size*0.62,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath();
      ctx.moveTo(b.x,b.y+b.size*0.6); ctx.lineTo(b.x,b.y+b.size*0.9); ctx.stroke();
      ctx.restore();
    });

    fireworks.forEach(group=>{
      group.forEach(p=>{
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life -= 0.012;
        ctx.save(); ctx.globalAlpha = Math.max(p.life,0);
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x,p.y,2.4,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });
    });
    fireworks = fireworks.filter(g=>g.some(p=>p.life>0));

    if (performance.now()-start < durationMs){
      requestAnimationFrame(loop);
    } else {
      clearInterval(fwInterval);
      ctx.clearRect(0,0,W,H);
    }
  }
  requestAnimationFrame(loop);
}
