(function(){
  'use strict';
  const progressBar=document.getElementById('progressBar');
  const menuButton=document.getElementById('menuButton');
  const mobileNav=document.getElementById('mobileNav');
  const year=document.getElementById('year');

  if(year) year.textContent=new Date().getFullYear();

  function updateProgress(){
    if(!progressBar)return;
    const doc=document.documentElement;
    const scrollable=doc.scrollHeight-window.innerHeight;
    const progress=scrollable>0?(window.scrollY/scrollable)*100:0;
    progressBar.style.width=Math.min(100,Math.max(0,progress))+'%';
  }
  window.addEventListener('scroll',updateProgress,{passive:true});
  window.addEventListener('resize',updateProgress);
  updateProgress();

  if(menuButton&&mobileNav){
    menuButton.addEventListener('click',function(){
      const open=mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(open));
      mobileNav.setAttribute('aria-hidden',String(!open));
      menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    mobileNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        mobileNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded','false');
        mobileNav.setAttribute('aria-hidden','true');
        menuButton.setAttribute('aria-label','Open menu');
      });
    });
  }

  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(function(entries,obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    revealItems.forEach(function(item){observer.observe(item);});
  }else{
    revealItems.forEach(function(item){item.classList.add('visible');});
  }

  const parallaxItems=document.querySelectorAll('[data-parallax]');
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && parallaxItems.length){
    let ticking=false;
    function parallax(){
      const y=window.scrollY;
      parallaxItems.forEach(function(item){
        const speed=parseFloat(item.getAttribute('data-parallax'))||0;
        const rect=item.getBoundingClientRect();
        if(rect.bottom>0&&rect.top<window.innerHeight){item.style.transform='translateY('+((y-window.innerHeight/2)*speed*-1)+'px)';}
      });
      ticking=false;
    }
    window.addEventListener('scroll',function(){if(!ticking){window.requestAnimationFrame(parallax);ticking=true;}},{passive:true});
  }
})();
