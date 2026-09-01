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
    const progress=
      scrollable>0
      ?(window.scrollY/scrollable)*100
      :0;

    progressBar.style.width=
      Math.min(100,Math.max(0,progress))+'%';
  }

  window.addEventListener(
    'scroll',
    updateProgress,
    {passive:true}
  );

  window.addEventListener(
    'resize',
    updateProgress
  );

  updateProgress();


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  if(menuButton&&mobileNav){

    menuButton.addEventListener(
      'click',
      function(){

        const open=
          mobileNav.classList.toggle('open');

        menuButton.setAttribute(
          'aria-expanded',
          String(open)
        );

        mobileNav.setAttribute(
          'aria-hidden',
          String(!open)
        );

        menuButton.setAttribute(
          'aria-label',
          open
          ?'Close menu'
          :'Open menu'
        );
      }
    );

    mobileNav.querySelectorAll('a').forEach(
      function(link){

        link.addEventListener(
          'click',
          function(){

            mobileNav.classList.remove('open');

            menuButton.setAttribute(
              'aria-expanded',
              'false'
            );

            mobileNav.setAttribute(
              'aria-hidden',
              'true'
            );

            menuButton.setAttribute(
              'aria-label',
              'Open menu'
            );
          }
        );

      }
    );

  }


  /* =========================================================
     REVEAL ANIMATIONS
     ========================================================= */

  const revealItems=
    document.querySelectorAll('.reveal');

  if('IntersectionObserver' in window){

    const observer=
      new IntersectionObserver(
        function(entries,obs){

          entries.forEach(
            function(entry){

              if(entry.isIntersecting){

                entry.target.classList.add(
                  'visible'
                );

                obs.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold:.12,
          rootMargin:'0px 0px -40px 0px'
        }
      );

    revealItems.forEach(
      function(item){
        observer.observe(item);
      }
    );

  }else{

    revealItems.forEach(
      function(item){
        item.classList.add('visible');
      }
    );

  }


  /* =========================================================
     PARALLAX
     ========================================================= */

  const parallaxItems=
    document.querySelectorAll('[data-parallax]');

  if(
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches &&
    parallaxItems.length
  ){

    let ticking=false;

    function parallax(){

      const y=window.scrollY;

      parallaxItems.forEach(
        function(item){

          const speed=
            parseFloat(
              item.getAttribute(
                'data-parallax'
              )
            )||0;

          const rect=
            item.getBoundingClientRect();

          if(
            rect.bottom>0 &&
            rect.top<window.innerHeight
          ){

            item.style.transform=
              'translateY('+
              ((y-window.innerHeight/2)*speed*-1)+
              'px)';

          }

        }
      );

      ticking=false;
    }


    window.addEventListener(
      'scroll',
      function(){

        if(!ticking){

          window.requestAnimationFrame(
            parallax
          );

          ticking=true;

        }

      },
      {passive:true}
    );

  }

})();


/* =========================================================
   AUTOMATIC TRAVEL GALLERIES + LIGHTBOX
   ========================================================= */

(function(){
  'use strict';

  const lb=
    document.getElementById('lightbox');

  const img=
    document.getElementById('lightboxImage');

  const title=
    document.getElementById('lightboxTitle');

  const counter=
    document.getElementById('lightboxCounter');

  if(!lb)return;


  /* =========================================================
     IMAGE FOLDER
     ========================================================= */

  const IMAGE_FOLDER='assets/images/';


  /* =========================================================
     LIGHTBOX STATE
     ========================================================= */

  let s={
    prefix:'',
    title:'',
    images:[],
    index:0
  };


  /* =========================================================
     FIND IMAGE

     Supports:
       .jpg
       .JPG
       .jpeg
       .JPEG

     IMPORTANT:
     The old version stopped at the first missing filename.
     This version checks all possible extensions and returns
     null only when that specific number truly doesn't exist.
     ========================================================= */

  function findImage(prefix,n){

    return new Promise(
      function(resolve){

        const number=
          String(n).padStart(2,'0');

        const extensions=[
          '.jpg',
          '.JPG',
          '.jpeg',
          '.JPEG'
        ];

        let current=0;

        function testNext(){

          if(current>=extensions.length){

            resolve(null);
            return;

          }

          const path=
            IMAGE_FOLDER+
            prefix+
            '-'+
            number+
            extensions[current];

          const test=
            new Image();

          test.onload=
            function(){

              resolve(path);

            };

          test.onerror=
            function(){

              current++;

              testNext();

            };

          test.src=path;

        }

        testNext();

      }
    );

  }


  /* =========================================================
     AUTOMATIC PHOTO DISCOVERY

     Finds:
       prefix-01
       prefix-02
       prefix-03
       ...

     Supports mixed JPG/JPG/JPEG/JPEG extensions.

     IMPORTANT:
     A missing number does NOT stop discovery.

     Example:

       manang-01.jpg
       manang-02.JPG
       manang-03.jpg
       manang-05.JPG

     All four can still be discovered.

     Maximum: 999 photos.
     ========================================================= */

  async function discoverImages(prefix){

    const images=[];

    /*
      We allow gaps between numbers.

      For example:
      01
      02
      04
      05

      will still work.

      We stop only after several consecutive
      missing numbers near the end.
    */

    let consecutiveMissing=0;

    const MAX_CONSECUTIVE_MISSING=10;

    for(
      let number=1;
      number<=999;
      number++
    ){

      const path=
        await findImage(
          prefix,
          number
        );

      if(path){

        images.push(path);

        consecutiveMissing=0;

      }else{

        consecutiveMissing++;

        /*
          If we have found photos before and then
          encounter many missing numbers in a row,
          assume the gallery has ended.
        */

        if(
          images.length>0 &&
          consecutiveMissing>=MAX_CONSECUTIVE_MISSING
        ){

          break;

        }

      }

    }

    return images;

  }


  /* =========================================================
     PRELOAD
     ========================================================= */

  function preload(path){

    if(!path)return;

    const x=
      new Image();

    x.src=path;

  }


  /* =========================================================
     RENDER LIGHTBOX
     ========================================================= */

  function render(){

    if(!s.images.length)return;

    const current=
      s.images[s.index];

    img.src=current;

    img.alt=
      s.title+
      ' photograph '+
      (s.index+1);

    title.textContent=
      s.title;

    counter.textContent=
      String(s.index+1).padStart(2,'0')+
      ' / '+
      String(s.images.length).padStart(2,'0');


    const nextIndex=
      s.index>=s.images.length-1
      ?0
      :s.index+1;

    const prevIndex=
      s.index<=0
      ?s.images.length-1
      :s.index-1;


    preload(
      s.images[nextIndex]
    );

    preload(
      s.images[prevIndex]
    );

  }


  /* =========================================================
     OPEN LIGHTBOX
     ========================================================= */

  function open(
    prefix,
    index,
    images,
    name
  ){

    if(
      !images||
      !images.length
    ){
      return;
    }

    s={
      prefix:prefix,
      title:name,
      images:images,
      index:index
    };

    render();

    lb.classList.add(
      'active'
    );

    lb.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow=
      'hidden';

  }


  /* =========================================================
     CLOSE LIGHTBOX
     ========================================================= */

  function close(){

    lb.classList.remove(
      'active'
    );

    lb.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow='';

    setTimeout(
      function(){

        if(
          !lb.classList.contains(
            'active'
          )
        ){

          img.removeAttribute(
            'src'
          );

        }

      },
      220
    );

  }


  /* =========================================================
     NEXT
     ========================================================= */

  function next(){

    if(!s.images.length)return;

    s.index=
      s.index>=s.images.length-1
      ?0
      :s.index+1;

    render();

  }


  /* =========================================================
     PREVIOUS
     ========================================================= */

  function prev(){

    if(!s.images.length)return;

    s.index=
      s.index<=0
      ?s.images.length-1
      :s.index-1;

    render();

  }


  /* =========================================================
     LIGHTBOX CONTROLS
     ========================================================= */

  const lightboxClose=
    document.getElementById(
      'lightboxClose'
    );

  const lightboxNext=
    document.getElementById(
      'lightboxNext'
    );

  const lightboxPrev=
    document.getElementById(
      'lightboxPrev'
    );


  if(lightboxClose){

    lightboxClose.addEventListener(
      'click',
      close
    );

  }


  if(lightboxNext){

    lightboxNext.addEventListener(
      'click',
      next
    );

  }


  if(lightboxPrev){

    lightboxPrev.addEventListener(
      'click',
      prev
    );

  }


  /* =========================================================
     CLICK OUTSIDE LIGHTBOX
     ========================================================= */

  lb.addEventListener(
    'click',
    function(e){

      if(e.target===lb){

        close();

      }

    }
  );


  /* =========================================================
     KEYBOARD CONTROLS
     ========================================================= */

  document.addEventListener(
    'keydown',
    function(e){

      if(
        !lb.classList.contains(
          'active'
        )
      ){
        return;
      }

      if(e.key==='Escape'){

        close();

      }

      if(e.key==='ArrowRight'){

        next();

      }

      if(e.key==='ArrowLeft'){

        prev();

      }

    }
  );


  /* =========================================================
     TOUCH SWIPE
     ========================================================= */

  let sx=0;
  let sy=0;


  lb.addEventListener(
    'touchstart',
    function(e){

      if(
        e.changedTouches.length
      ){

        sx=
          e.changedTouches[0].screenX;

        sy=
          e.changedTouches[0].screenY;

      }

    },
    {passive:true}
  );


  lb.addEventListener(
    'touchend',
    function(e){

      if(
        !e.changedTouches.length
      ){
        return;
      }

      const dx=
        sx-
        e.changedTouches[0].screenX;

      const dy=
        sy-
        e.changedTouches[0].screenY;


      if(
        Math.abs(dx)>50 &&
        Math.abs(dx)>Math.abs(dy)
      ){

        if(dx>0){

          next();

        }else{

          prev();

        }

      }

    },
    {passive:true}
  );


  /* =========================================================
     SET UP EVERY GALLERY
     ========================================================= */

  document.querySelectorAll(
    '[data-gallery]'
  ).forEach(
    function(g){

      const grid=
        g.querySelector(
          '.gallery-grid'
        );


      const btn=
        g.querySelector(
          '.gallery-toggle'
        );


      const headingSmall=
        g.querySelector(
          '.gallery-heading small'
        );


      const prefix=
        g.dataset.prefix;


      const name=
        g.dataset.title;


      /*
        The PHOTO fact inside the story.
      */

      const storyFacts=
        g.parentElement.querySelector(
          '.story-facts'
        );


      let photoFact=null;


      if(storyFacts){

        const facts=
          storyFacts.querySelectorAll(
            'span'
          );


        facts.forEach(
          function(fact){

            const b=
              fact.querySelector(
                'b'
              );


            if(
              b &&
              b.textContent
                .trim()
                .toUpperCase()==='PHOTOS'
            ){

              photoFact=fact;

            }

          }
        );

      }


      /*
        Actual images found in the folder.
      */

      let galleryImages=[];

      let built=false;

      let discovering=false;


      /* =====================================================
         UPDATE ALL PHOTO COUNTS
         ===================================================== */

      function updatePhotoCounts(){

        const count=
          galleryImages.length;


        if(!count){

          return;

        }


        /*
          1. STORY FACT
        */

        if(photoFact){

          photoFact.innerHTML=
            '<b>PHOTOS</b> '+
            count;

        }


        /*
          2. GALLERY HEADING
        */

        if(headingSmall){

          headingSmall.textContent=
            (count+1)+
            ' photographs · cover shown above';

        }


        /*
          3. GALLERY BUTTON
        */

        if(btn){

          btn.innerHTML=
            'Enter the Photo Chapter '+
            '<span>'+
            count+
            ' photos</span> ↓';

        }

      }


      /* =====================================================
         BUILD GALLERY
         ===================================================== */

      async function build(){

        if(
          built||
          discovering
        ){

          return;

        }


        discovering=true;


        /*
          Automatically find all images.
        */

        galleryImages=
          await discoverImages(
            prefix
          );


        /*
          Update every visible number.
        */

        updatePhotoCounts();


        /*
          Cover must exist.
        */

        if(
          galleryImages.length===0
        ){

          discovering=false;

          return;

        }


        /*
          Photo 1 is the cover.

          Photos 2 onward are placed
          inside the expandable gallery.
        */

        const f=
          document.createDocumentFragment();


        for(
          let i=1;
          i<galleryImages.length;
          i++
        ){

          const fig=
            document.createElement(
              'figure'
            );


          fig.className=
            'gallery-photo';


          const im=
            document.createElement(
              'img'
            );


          im.src=
            galleryImages[i];


          im.alt=
            name+
            ' photograph '+
            (i+1);


          im.loading='lazy';

          im.decoding='async';


          im.addEventListener(
            'load',
            function(){

              im.classList.add(
                'loaded'
              );

            },
            {once:true}
          );


          im.addEventListener(
            'error',
            function(){

              fig.remove();

            },
            {once:true}
          );


          fig.appendChild(im);


          /*
            Open lightbox at correct image.
          */

          fig.addEventListener(
            'click',
            function(){

              open(
                prefix,
                i,
                galleryImages,
                name
              );

            }
          );


          f.appendChild(fig);

        }


        grid.appendChild(f);


        built=true;

        discovering=false;


        updatePhotoCounts();

      }


      /* =====================================================
         GALLERY OPEN / CLOSE BUTTON
         ===================================================== */

      if(btn){

        btn.addEventListener(
          'click',
          async function(){

            const openState=
              grid.classList.contains(
                'open'
              );


            /* OPEN */

            if(!openState){

              await build();


              if(
                !galleryImages.length
              ){

                return;

              }


              requestAnimationFrame(
                function(){

                  grid.classList.add(
                    'open'
                  );

                  checkGalleryEnd();

                }
              );


              btn.setAttribute(
                'aria-expanded',
                'true'
              );


              btn.innerHTML=
                'Return to the Journey <span>↑</span>';


              btn.classList.add(
                'gallery-floating'
              );

            }


            /* CLOSE */

            else{

              btn.classList.remove(
                'gallery-floating'
              );


              btn.setAttribute(
                'aria-expanded',
                'false'
              );


              updatePhotoCounts();


              grid.classList.remove(
                'open'
              );

            }

          }
        );

      }


      /* =====================================================
         FLOATING BUTTON
         ===================================================== */

      function checkGalleryEnd(){

        if(
          !grid.classList.contains(
            'open'
          )
        ){

          return;

        }


        const galleryRect=
          g.getBoundingClientRect();


        const buttonHeight=
          btn.offsetHeight;


        const gap=35;


        const floatTop=
          window.innerHeight-
          buttonHeight-
          gap;


        const galleryTop=
          galleryRect.top;


        const galleryBottom=
          galleryRect.bottom;


        if(
          galleryTop<floatTop &&
          galleryBottom>floatTop
        ){

          btn.classList.add(
            'gallery-floating'
          );

        }else{

          btn.classList.remove(
            'gallery-floating'
          );

        }

      }


      window.addEventListener(
        'scroll',
        checkGalleryEnd,
        {passive:true}
      );


      window.addEventListener(
        'resize',
        checkGalleryEnd
      );


      /* =====================================================
         COVER IMAGE OPENS LIGHTBOX
         ===================================================== */

      const cover=
        g.parentElement.querySelector(
          '.feature-image'
        );


      if(cover){

        cover.style.cursor=
          'pointer';


        cover.addEventListener(
          'click',
          async function(){

            if(
              !galleryImages.length
            ){

              galleryImages=
                await discoverImages(
                  prefix
                );


              updatePhotoCounts();

            }


            if(
              galleryImages.length
            ){

              open(
                prefix,
                0,
                galleryImages,
                name
              );

            }

          }
        );

      }


      /* =====================================================
         INITIAL PHOTO COUNT
         ===================================================== */

      (async function(){

        galleryImages=
          await discoverImages(
            prefix
          );


        updatePhotoCounts();

      })();

    }
  );

})();


/* =========================================================
   SCROLL TO TOP BUTTON
   ========================================================= */

(function(){
  'use strict';

  const scrollTop=
    document.getElementById(
      'scrollTop'
    );

  if(!scrollTop)return;


  function updateScrollTop(){

    if(window.scrollY>500){

      scrollTop.classList.add(
        'visible'
      );

    }else{

      scrollTop.classList.remove(
        'visible'
      );

    }

  }


  window.addEventListener(
    'scroll',
    updateScrollTop,
    {passive:true}
  );


  scrollTop.addEventListener(
    'click',
    function(){

      window.scrollTo({
        top:0,
        behavior:'smooth'
      });

    }
  );


  updateScrollTop();

})();
