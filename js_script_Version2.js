// 1. Loader
(function(){
  const fill=document.getElementById('loader-fill');
  const pct=document.getElementById('loader-pct');
  const loader=document.getElementById('loader');
  let progress=0;
  const interval=setInterval(()=>{
    progress+=Math.random()*18;
    if(progress>=100){
      progress=100;
      clearInterval(interval);
      setTimeout(()=>loader.classList.add('hidden'),300);
    }
    fill.style.width=progress+'%';
    pct.textContent=Math.floor(progress)+'%';
  },80);
})();

// Footer year
(function(){
  const y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();
})();

// 2. Custom cursor
(function(){
  const ring=document.getElementById('cursor-ring');
  const dot=document.getElementById('cursor-dot');
  if(!ring||!dot) return;

  let mouseX=0,mouseY=0,ringX=0,ringY=0;

  document.addEventListener('mousemove',e=>{
    mouseX=e.clientX;mouseY=e.clientY;
    dot.style.left=mouseX+'px';
    dot.style.top=mouseY+'px';
  });

  function animateRing(){
    ringX+=(mouseX-ringX)*0.12;
    ringY+=(mouseY-ringY)*0.12;
    ring.style.left=ringX+'px';
    ring.style.top=ringY+'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a,button,.tag,.stat-card,.edu-card,.chip,.photo-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown',()=>document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',()=>document.body.classList.remove('cursor-click'));
})();

// 3. Particle field
(function(){
  const canvas=document.getElementById('particle-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,particles=[],mouse={x:-1000,y:-1000};

  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
  }
  resize();
  window.addEventListener('resize',resize);

  window.addEventListener('mousemove',e=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
  });

  const COUNT=110;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x:Math.random()*W,
      y:Math.random()*H,
      vx:(Math.random()-.5)*.35,
      vy:(Math.random()-.5)*.35,
      r:Math.random()*1.5+.3,
      alpha:Math.random()*.5+.1
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const dist=Math.hypot(dx,dy);
        if(dist<130){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(255,255,255,${(1-dist/130)*0.15})`;
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p=>{
      const dx=p.x-mouse.x;
      const dy=p.y-mouse.y;
      const d=Math.hypot(dx,dy);
      if(d<100 && d>0){
        p.x+=dx/d*1.1;
        p.y+=dy/d*1.1;
      }

      p.x+=p.vx;
      p.y+=p.vy;

      if(p.x<0) p.x=W;
      if(p.x>W) p.x=0;
      if(p.y<0) p.y=H;
      if(p.y>H) p.y=0;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// 4. Typewriter
(function(){
  const el=document.getElementById('typed-text');
  if(!el) return;

  const phrases=[
    'MBA Candidate · Supply Chain & Analytics',
    'Engineering + Management = Unique Edge',
    'Data-Driven Operational Thinker',
    'Bengaluru, India'
  ];

  let pi=0,ci=0,deleting=false;

  function tick(){
    const phrase=phrases[pi];

    if(!deleting){
      el.textContent=phrase.slice(0,++ci);
      if(ci===phrase.length){
        deleting=true;
        setTimeout(tick,1700);
        return;
      }
      setTimeout(tick,52);
    }else{
      el.textContent=phrase.slice(0,--ci);
      if(ci===0){
        deleting=false;
        pi=(pi+1)%phrases.length;
        setTimeout(tick,320);
        return;
      }
      setTimeout(tick,28);
    }
  }
  setTimeout(tick,900);
})();

// 5. Reveal observer + skills animation
(function(){
  const reveals=document.querySelectorAll('.reveal');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');

        e.target.querySelectorAll('.bar-fill').forEach(bar=>{
          bar.style.width=bar.dataset.width+'%';
        });

        e.target.querySelectorAll('.ring-fg').forEach(ring=>{
          const pct=parseFloat(ring.dataset.pct);
          const circ=2*Math.PI*40;
          ring.style.strokeDashoffset=circ*(1-pct/100);
        });
      }
    });
  },{threshold:.15});

  reveals.forEach(el=>observer.observe(el));

  const skillSection=document.getElementById('skills');
  if(skillSection){
    const bars=skillSection.querySelectorAll('.bar-fill');
    const rings=skillSection.querySelectorAll('.ring-fg');
    const so=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        bars.forEach(bar=>bar.style.width=bar.dataset.width+'%');
        rings.forEach(ring=>{
          const pct=parseFloat(ring.dataset.pct);
          const circ=2*Math.PI*40;
          ring.style.strokeDashoffset=circ*(1-pct/100);
        });
      }
    },{threshold:.2});
    so.observe(skillSection);
  }
})();

// 6. Navbar + active section + mobile menu
(function(){
  const navbar=document.getElementById('navbar');
  const links=document.querySelectorAll('.nav-links a');
  const sections=document.querySelectorAll('section[id]');

  window.addEventListener('scroll',()=>{
    if(navbar) navbar.classList.toggle('scrolled',window.scrollY>60);

    let current='';
    sections.forEach(s=>{
      if(window.scrollY>=s.offsetTop-140) current=s.id;
    });

    links.forEach(l=>{
      l.classList.toggle('active',l.getAttribute('href')==='#'+current);
    });
  },{passive:true});

  const ham=document.getElementById('nav-ham');
  const navLinks=document.getElementById('nav-links');
  if(ham && navLinks){
    ham.addEventListener('click',()=>navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',()=>navLinks.classList.remove('open'));
    });
  }
})();

// 7. Hero parallax
(function(){
  const hero=document.getElementById('hero');
  if(!hero) return;

  window.addEventListener('mousemove',e=>{
    const x=(e.clientX/window.innerWidth-.5)*14;
    const y=(e.clientY/window.innerHeight-.5)*14;
    hero.style.setProperty('--px',x+'px');
    hero.style.setProperty('--py',y+'px');
  },{passive:true});
})();

// 8. Photo tilt
(function(){
  const card=document.getElementById('tilt-card');
  if(!card) return;

  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=e.clientX-r.left;
    const y=e.clientY-r.top;
    const rx=((y/r.height)-.5)*-10;
    const ry=((x/r.width)-.5)*10;
    card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  });

  card.addEventListener('mouseleave',()=>{
    card.style.transform='rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
})();