(function () {
  'use strict';

  /* =========================================================
     BASIC PAGE FEATURES
     ========================================================= */

  const progressBar = document.getElementById('progressBar');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  function updateProgress() {
    if (!progressBar) return;

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progressBar.style.width =
      Math.min(100, Math.max(0, progress)) + '%';
  }

  window.addEventListener(
    'scroll',
    updateProgress,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    updateProgress
  );

  updateProgress();


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  if (menuButton && mobileNav) {

    menuButton.addEventListener('click', function () {

      const open =
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
        open ? 'Close menu' : 'Open menu'
      );

    });


    mobileNav.querySelectorAll('a').forEach(
      function (link) {

        link.addEventListener(
          'click',
          function () {

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

  const revealItems =
    document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {

    const observer =
      new IntersectionObserver(
        function (entries, obs) {

          entries.forEach(
            function (entry) {

              if (entry.isIntersecting) {

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
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px'
        }
      );


    revealItems.forEach(
      function (item) {
        observer.observe(item);
      }
    );

  } else {

    revealItems.forEach(
      function (item) {
        item.classList.add('visible');
      }
    );

  }


  /* =========================================================
     PARALLAX
     ========================================================= */

  const parallaxItems =
    document.querySelectorAll('[data-parallax]');

  if (
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches &&
    parallaxItems.length
  ) {

    let ticking = false;


    function parallax() {

      const y = window.scrollY;

      parallaxItems.forEach(
        function (item) {

          const speed =
            parseFloat(
              item.getAttribute(
                'data-parallax'
              )
            ) || 0;

          const rect =
            item.getBoundingClientRect();

          if (
            rect.bottom > 0 &&
            rect.top < window.innerHeight
          ) {

            item.style.transform =
              'translateY(' +
              ((y - window.innerHeight / 2) *
                speed * -1) +
              'px)';

          }

        }
      );

      ticking = false;

    }


    window.addEventListener(
      'scroll',
      function () {

        if (!ticking) {

          window.requestAnimationFrame(
            parallax
          );

          ticking = true;

        }

      },
      { passive: true }
    );

  }


})();



/* =========================================================
   TRAVEL GALLERIES + LIGHTBOX
   OPTIMIZED VERSION

   Galleries are loaded only when requested.

   IMPORTANT:
   The actual filenames are listed below so the browser
   does NOT waste time trying .jpg, .JPG, .jpeg and .JPEG.
   ========================================================= */

(function () {
  'use strict';


  /* =========================================================
     LIGHTBOX ELEMENTS
     ========================================================= */

  const lb =
    document.getElementById('lightbox');

  const img =
    document.getElementById('lightboxImage');

  const title =
    document.getElementById('lightboxTitle');

  const counter =
    document.getElementById('lightboxCounter');

  if (!lb || !img || !title || !counter) {
    return;
  }


  /* =========================================================
     IMAGE FOLDER
     ========================================================= */

  const IMAGE_FOLDER = 'assets/images/';


  /* =========================================================
     EXACT GALLERY FILES

     These match the current files in GitHub exactly.
     ========================================================= */

  const GALLERY_FILES = {

    amayangri: [
      'amayangri-01.jpg',
      'amayangri-02.JPG',
      'amayangri-03.JPG',
      'amayangri-04.JPG',
      'amayangri-05.JPG',
      'amayangri-06.JPG',
      'amayangri-07.JPG',
      'amayangri-08.jpg',
      'amayangri-09.JPG',
      'amayangri-10.JPG',
      'amayangri-11.JPG',
      'amayangri-12.JPG',
      'amayangri-13.jpg',
      'amayangri-14.JPG',
      'amayangri-15.JPG',
      'amayangri-16.JPG',
      'amayangri-17.jpg',
      'amayangri-18.JPG',
      'amayangri-19.JPG',
      'amayangri-20.jpg',
      'amayangri-21.JPG',
      'amayangri-22.JPG',
      'amayangri-23.JPG',
      'amayangri-24.jpg',
      'amayangri-25.JPG',
      'amayangri-26.JPG'
    ],

    ilam: [
      'ilam-01.jpg',
      'ilam-02.jpg',
      'ilam-03.jpg',
      'ilam-04.JPG',
      'ilam-05.JPG',
      'ilam-06.JPG'
    ],

    kuri: [
      'kuri-01.jpg',
      'kuri-02.JPG',
      'kuri-03.JPG',
      'kuri-04.JPG',
      'kuri-05.jpg',
      'kuri-06.JPG',
      'kuri-07.JPG',
      'kuri-08.JPG',
      'kuri-09.JPG',
      'kuri-10.JPG',
      'kuri-11.JPG',
      'kuri-12.JPG',
      'kuri-13.JPG',
      'kuri-14.JPG',
      'kuri-15.JPG',
      'kuri-16.JPG',
      'kuri-17.JPG',
      'kuri-18.JPG'
    ],

    manang: [
      'manang-01.jpg',
      'manang-02.jpg',
      'manang-03.JPG',
      'manang-04.JPG',
      'manang-05.JPG',
      'manang-06.JPG',
      'manang-07.jpg',
      'manang-08.jpg',
      'manang-09.jpg',
      'manang-10.JPG',
      'manang-11.jpg',
      'manang-12.JPG',
      'manang-13.jpg',
      'manang-14.JPG',
      'manang-15.JPG',
      'manang-16.JPG',
      'manang-17.JPG',
      'manang-18.JPG',
      'manang-19.JPG',
      'manang-20.jpg',
      'manang-21.JPG',
      'manang-22.JPG',
      'manang-23.JPG',
      'manang-24.JPG',
      'manang-25.jpg',
      'manang-26.JPG',
      'manang-27.jpg',
      'manang-28.JPG',
      'manang-29.jpg',
      'manang-30.JPG',
      'manang-31.JPG',
      'manang-32.JPG',
      'manang-33.JPG',
      'manang-34.JPG',
      'manang-35.JPG',
      'manang-36.jpg',
      'manang-37.JPG',
      'manang-38.JPG',
      'manang-39.JPG',
      'manang-40.JPG',
      'manang-41.JPG',
      'manang-42.jpg',
      'manang-43.jpg',
      'manang-44.JPG',
      'manang-45.JPG',
      'manang-46.JPG',
      'manang-47.JPG',
      'manang-48.JPG',
      'manang-49.JPG',
      'manang-50.jpg',
      'manang-51.jpg',
      'manang-52.JPG'
    ],

    manungkot: [
      'manungkot-01.jpg',
      'manungkot-02.jpg',
      'manungkot-03.jpg',
      'manungkot-04.jpg',
      'manungkot-05.jpg',
      'manungkot-06.jpg'
    ],

    mustang: [
      'mustang-01.jpg',
      'mustang-02.jpg',
      'mustang-03.jpg',
      'mustang-04.jpg',
      'mustang-05.jpg',
      'mustang-06.jpg',
      'mustang-07.jpg',
      'mustang-08.jpg',
      'mustang-09.jpg',
      'mustang-10.jpg',
      'mustang-11.jpg',
      'mustang-12.jpg',
      'mustang-13.jpg',
      'mustang-14.jpg',
      'mustang-15.jpg',
      'mustang-16.jpg',
      'mustang-17.jpg',
      'mustang-18.jpg',
      'mustang-19.jpg',
      'mustang-20.jpg',
      'mustang-21.jpg',
      'mustang-22.jpg',
      'mustang-23.jpg'
    ],

    pathibhara: [
      'pathibhara-01.jpg',
      'pathibhara-02.JPG',
      'pathibhara-03.jpg',
      'pathibhara-04.jpg',
      'pathibhara-05.JPG',
      'pathibhara-06.JPG',
      'pathibhara-07.jpg',
      'pathibhara-08.JPG',
      'pathibhara-09.JPG',
      'pathibhara-10.JPG',
      'pathibhara-11.JPG',
      'pathibhara-12.JPG',
      'pathibhara-13.JPG',
      'pathibhara-14.JPG',
      'pathibhara-15.jpg',
      'pathibhara-16.JPG',
      'pathibhara-17.jpg'
    ],

    pikey: [
      'pikey-01.jpg',
      'pikey-02.jpg',
      'pikey-03.jpg',
      'pikey-04.jpg',
      'pikey-05.jpg',
      'pikey-06.jpg',
      'pikey-07.jpg',
      'pikey-08.jpg',
      'pikey-09.jpg',
      'pikey-10.jpg',
      'pikey-11.jpg',
      'pikey-12.jpg',
      'pikey-13.jpg',
      'pikey-14.jpg',
      'pikey-15.jpg',
      'pikey-16.jpg',
      'pikey-17.jpg',
      'pikey-18.jpg',
      'pikey-19.jpg',
      'pikey-20.jpg',
      'pikey-21.jpg',
      'pikey-22.jpg',
      'pikey-23.jpg',
      'pikey-24.jpg',
      'pikey-25.jpg'
    ],

    sandakpur: [
      'sandakpur-01.jpg',
      'sandakpur-02.JPG',
      'sandakpur-03.JPG',
      'sandakpur-04.JPG',
      'sandakpur-05.JPG',
      'sandakpur-06.JPG',
      'sandakpur-07.JPG',
      'sandakpur-08.JPG',
      'sandakpur-09.JPG',
      'sandakpur-10.JPG',
      'sandakpur-11.JPG',
      'sandakpur-12.jpg'
    ]

  };


  /* =========================================================
     LIGHTBOX STATE
     ========================================================= */

  let state = {
    prefix: '',
    title: '',
    images: [],
    index: 0
  };


  /* =========================================================
     GALLERY CACHE
     ========================================================= */

  const galleryCache = new Map();


  /* =========================================================
     DISCOVER GALLERY

     No network requests are needed here.

     The exact filenames are already known.
     ========================================================= */

  async function discoverImages(prefix) {

    if (galleryCache.has(prefix)) {
      return galleryCache.get(prefix);
    }


    const files =
      GALLERY_FILES[prefix] || [];


    const images =
      files.map(
        function (filename) {

          return IMAGE_FOLDER +
            filename;

        }
      );


    galleryCache.set(
      prefix,
      images
    );


    return images;

  }


  /* =========================================================
     PRELOAD LIGHTBOX IMAGE
     ========================================================= */

  function preload(path) {

    if (!path) return;

    const image =
      new Image();

    image.src = path;

  }


  /* =========================================================
     RENDER LIGHTBOX
     ========================================================= */

  function render() {

    if (!state.images.length) {
      return;
    }


    const current =
      state.images[state.index];


    img.src = current;

    img.alt =
      state.title +
      ' photograph ' +
      (state.index + 1);


    title.textContent =
      state.title;


    counter.textContent =
      String(state.index + 1).padStart(2, '0') +
      ' / ' +
      String(state.images.length).padStart(2, '0');


    const nextIndex =
      state.index >=
      state.images.length - 1
        ? 0
        : state.index + 1;


    const previousIndex =
      state.index <= 0
        ? state.images.length - 1
        : state.index - 1;


    /*
      Only preload the two adjacent images.
    */

    preload(
      state.images[nextIndex]
    );

    preload(
      state.images[previousIndex]
    );

  }


  /* =========================================================
     OPEN LIGHTBOX
     ========================================================= */

  function openLightbox(
    prefix,
    index,
    images,
    name
  ) {

    if (
      !images ||
      !images.length
    ) {
      return;
    }


    state = {
      prefix: prefix,
      title: name,
      images: images,
      index: index
    };


    render();


    lb.classList.add('active');

    lb.setAttribute(
      'aria-hidden',
      'false'
    );


    document.body.style.overflow =
      'hidden';

  }


  /* =========================================================
     CLOSE LIGHTBOX
     ========================================================= */

  function closeLightbox() {

    lb.classList.remove('active');

    lb.setAttribute(
      'aria-hidden',
      'true'
    );


    document.body.style.overflow =
      '';


    setTimeout(
      function () {

        if (
          !lb.classList.contains('active')
        ) {

          img.removeAttribute('src');

        }

      },
      220
    );

  }


  /* =========================================================
     NEXT PHOTO
     ========================================================= */

  function nextPhoto() {

    if (!state.images.length) {
      return;
    }


    state.index =
      state.index >=
      state.images.length - 1
        ? 0
        : state.index + 1;


    render();

  }


  /* =========================================================
     PREVIOUS PHOTO
     ========================================================= */

  function previousPhoto() {

    if (!state.images.length) {
      return;
    }


    state.index =
      state.index <= 0
        ? state.images.length - 1
        : state.index - 1;


    render();

  }


  /* =========================================================
     LIGHTBOX BUTTONS
     ========================================================= */

  const lightboxClose =
    document.getElementById(
      'lightboxClose'
    );

  const lightboxNext =
    document.getElementById(
      'lightboxNext'
    );

  const lightboxPrev =
    document.getElementById(
      'lightboxPrev'
    );


  if (lightboxClose) {

    lightboxClose.addEventListener(
      'click',
      closeLightbox
    );

  }


  if (lightboxNext) {

    lightboxNext.addEventListener(
      'click',
      nextPhoto
    );

  }


  if (lightboxPrev) {

    lightboxPrev.addEventListener(
      'click',
      previousPhoto
    );

  }


  /* =========================================================
     CLICK BACKGROUND TO CLOSE
     ========================================================= */

  lb.addEventListener(
    'click',
    function (e) {

      if (e.target === lb) {

        closeLightbox();

      }

    }
  );


  /* =========================================================
     KEYBOARD
     ========================================================= */

  document.addEventListener(
    'keydown',
    function (e) {

      if (
        !lb.classList.contains('active')
      ) {
        return;
      }


      if (e.key === 'Escape') {

        closeLightbox();

      }


      if (e.key === 'ArrowRight') {

        nextPhoto();

      }


      if (e.key === 'ArrowLeft') {

        previousPhoto();

      }

    }
  );


  /* =========================================================
     TOUCH SWIPE
     ========================================================= */

  let startX = 0;
  let startY = 0;


  lb.addEventListener(
    'touchstart',
    function (e) {

      if (
        e.changedTouches.length
      ) {

        startX =
          e.changedTouches[0].screenX;

        startY =
          e.changedTouches[0].screenY;

      }

    },
    { passive: true }
  );


  lb.addEventListener(
    'touchend',
    function (e) {

      if (
        !e.changedTouches.length
      ) {
        return;
      }


      const deltaX =
        startX -
        e.changedTouches[0].screenX;


      const deltaY =
        startY -
        e.changedTouches[0].screenY;


      if (
        Math.abs(deltaX) > 50 &&
        Math.abs(deltaX) >
        Math.abs(deltaY)
      ) {

        if (deltaX > 0) {

          nextPhoto();

        } else {

          previousPhoto();

        }

      }

    },
    { passive: true }
  );


  /* =========================================================
     GALLERIES
     ========================================================= */

  document.querySelectorAll(
    '[data-gallery]'
  ).forEach(
    function (gallery) {

      const grid =
        gallery.querySelector(
          '.gallery-grid'
        );


      const button =
        gallery.querySelector(
          '.gallery-toggle'
        );


      const headingSmall =
        gallery.querySelector(
          '.gallery-heading small'
        );


      const prefix =
        gallery.dataset.prefix;


      const name =
        gallery.dataset.title;


      if (!grid || !button || !prefix) {
        return;
      }


      /* =====================================================
         PHOTO FACT
         ===================================================== */

      const storyFacts =
        gallery.parentElement
          ? gallery.parentElement.querySelector(
              '.story-facts'
            )
          : null;


      let photoFact = null;


      if (storyFacts) {

        const facts =
          storyFacts.querySelectorAll(
            'span'
          );


        facts.forEach(
          function (fact) {

            const bold =
              fact.querySelector('b');


            if (
              bold &&
              bold.textContent
                .trim()
                .toUpperCase() ===
                'PHOTOS'
            ) {

              photoFact = fact;

            }

          }
        );

      }


      /* =====================================================
         GALLERY STATE
         ===================================================== */

      let galleryImages = [];

      let built = false;

      let loading = false;


      /* =====================================================
         UPDATE COUNTS
         ===================================================== */

      function updatePhotoCounts() {

        const count =
          galleryImages.length;


        if (!count) {
          return;
        }


        /*
          Story fact
        */

        if (photoFact) {

          photoFact.innerHTML =
            '<b>PHOTOS</b> ' +
            count;

        }


        /*
          Gallery heading
        */

        if (headingSmall) {

          headingSmall.textContent =
            (count + 1) +
            ' photographs · cover shown above';

        }


        /*
          Button
        */

        if (button) {

          button.innerHTML =
            'Enter the Photo Chapter ' +
            '<span>' +
            count +
            ' photos</span> ↓';

        }

      }


      /* =====================================================
         BUILD GALLERY
         ===================================================== */

      async function buildGallery() {

        if (built) {
          return galleryImages;
        }


        if (loading) {
          return galleryImages;
        }


        loading = true;


        /*
          Discover only this gallery.
          This is now instant.
        */

        galleryImages =
          await discoverImages(prefix);


        updatePhotoCounts();


        if (
          !galleryImages.length
        ) {

          loading = false;

          return galleryImages;

        }


        /*
          Photos 2 onward are displayed inside
          the expandable gallery.

          Photo 1 is the cover.
        */

        const fragment =
          document.createDocumentFragment();


        for (
          let i = 1;
          i < galleryImages.length;
          i++
        ) {

          const figure =
            document.createElement(
              'figure'
            );


          figure.className =
            'gallery-photo';


          const image =
            document.createElement(
              'img'
            );


          image.src =
            galleryImages[i];


          image.alt =
            name +
            ' photograph ' +
            (i + 1);


          /*
            Lazy loading is retained.
          */

          image.loading =
            'lazy';


          image.decoding =
            'async';


          image.addEventListener(
            'load',
            function () {

              image.classList.add(
                'loaded'
              );

            },
            { once: true }
          );


          image.addEventListener(
            'error',
            function () {

              figure.remove();

            },
            { once: true }
          );


          figure.appendChild(
            image
          );


          /*
            Open corresponding photo.
          */

          figure.addEventListener(
            'click',
            function () {

              openLightbox(
                prefix,
                i,
                galleryImages,
                name
              );

            }
          );


          fragment.appendChild(
            figure
          );

        }


        grid.appendChild(
          fragment
        );


        built = true;

        loading = false;


        updatePhotoCounts();


        return galleryImages;

      }


      /* =====================================================
         GALLERY FLOATING BUTTON
         ===================================================== */

      function checkGalleryEnd() {

        if (
          !grid.classList.contains('open')
        ) {
          return;
        }


        const galleryRect =
          gallery.getBoundingClientRect();


        const buttonHeight =
          button.offsetHeight;


        const gap = 35;


        const floatTop =
          window.innerHeight -
          buttonHeight -
          gap;


        const galleryTop =
          galleryRect.top;


        const galleryBottom =
          galleryRect.bottom;


        if (
          galleryTop < floatTop &&
          galleryBottom > floatTop
        ) {

          button.classList.add(
            'gallery-floating'
          );

        } else {

          button.classList.remove(
            'gallery-floating'
          );

        }

      }


      window.addEventListener(
        'scroll',
        checkGalleryEnd,
        { passive: true }
      );


      window.addEventListener(
        'resize',
        checkGalleryEnd
      );


      /* =====================================================
         OPEN / CLOSE GALLERY
         ===================================================== */

      button.addEventListener(
        'click',
        async function () {

          const isOpen =
            grid.classList.contains('open');


          /*
            OPEN
          */

          if (!isOpen) {

            /* -----------------------------------------------
               Show lightweight loading animation
               ----------------------------------------------- */

            button.classList.add(
              'gallery-loading'
            );


            button.innerHTML =
              'Loading photos ' +
              '<span class="loading-dots">' +
                '<span></span>' +
                '<span></span>' +
                '<span></span>' +
              '</span>';


            /*
              IMPORTANT:

              Give the browser one frame to paint the
              loading animation before continuing.
            */

            await new Promise(
              function (resolve) {

                requestAnimationFrame(
                  function () {

                    resolve();

                  }
                );

              }
            );


            /*
              Build the gallery.
            */

            await buildGallery();


            /*
              Keep the loading animation visible briefly
              so it can actually be seen.
            */

            await new Promise(
              function (resolve) {

                setTimeout(
                  resolve,
                  350
                );

              }
            );


            button.classList.remove(
              'gallery-loading'
            );


            if (
              !galleryImages.length
            ) {

              button.innerHTML =
                'Photos unavailable';

              return;

            }


            /*
              Open gallery after loading.
            */

            requestAnimationFrame(
              function () {

                grid.classList.add(
                  'open'
                );

                checkGalleryEnd();

              }
            );


            button.setAttribute(
              'aria-expanded',
              'true'
            );


            button.innerHTML =
              'Return to the Journey <span>↑</span>';


            button.classList.add(
              'gallery-floating'
            );


            return;

          }


          /*
            CLOSE
          */

          button.classList.remove(
            'gallery-floating'
          );


          button.setAttribute(
            'aria-expanded',
            'false'
          );


          updatePhotoCounts();


          grid.classList.remove(
            'open'
          );

        }
      );


      /* =====================================================
         COVER IMAGE
         ===================================================== */

      const cover =
        gallery.parentElement
          ? gallery.parentElement.querySelector(
              '.feature-image'
            )
          : null;


      if (cover) {

        cover.style.cursor =
          'pointer';


        cover.addEventListener(
          'click',
          async function () {

            /*
              Discover only when cover is clicked.
            */

            if (
              !galleryImages.length
            ) {

              galleryImages =
                await discoverImages(
                  prefix
                );


              updatePhotoCounts();

            }


            if (
              galleryImages.length
            ) {

              openLightbox(
                prefix,
                0,
                galleryImages,
                name
              );

            }

          }
        );

      }


      /*
        IMPORTANT:

        There is NO initial gallery loading here.

        Galleries are still loaded only when requested.
      */

    }
  );

})();



/* =========================================================
   SCROLL TO TOP BUTTON
   ========================================================= */

(function () {
  'use strict';

  const scrollTop =
    document.getElementById(
      'scrollTop'
    );


  if (!scrollTop) {
    return;
  }


  function updateScrollTop() {

    if (window.scrollY > 500) {

      scrollTop.classList.add(
        'visible'
      );

    } else {

      scrollTop.classList.remove(
        'visible'
      );

    }

  }


  window.addEventListener(
    'scroll',
    updateScrollTop,
    { passive: true }
  );


  scrollTop.addEventListener(
    'click',
    function () {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }
  );


  updateScrollTop();

})();
// =====================================
// EXPLORE WITH AI
// =====================================
// =====================================
// EXPLORE WITH AI — DYNAMIC PROMPTS
// =====================================

const aiPromptPool = [

  // JOURNEYS & DESTINATIONS

  "What makes Pikey Peak special?",
  "Tell me something interesting about Upper Mustang.",
  "What makes Tilicho Lake worth visiting?",
  "What is special about the Manang region?",
  "Tell me about Ama Yangri.",
  "What makes Pathibhara interesting?",
  "Why do people visit Sandakpur?",
  "What is Kuri Village like?",
  "Tell me about Kalinchowk.",
  "What makes Ilam different from the high Himalayas?",
  "Tell me about Manungkot.",
  "What makes eastern Nepal worth exploring?",
  "Which place in Nepal feels the most peaceful?",
  "Which places in Nepal are still relatively quiet?",
  "What are some underrated destinations in Nepal?",

  // TREKKING

  "Which Himalayan trek is good for solitude?",
  "Which Nepal treks are less crowded?",
  "What is a good short trek in Nepal?",
  "Which trek gives the best mountain views for fewer days?",
  "What is a good trek for someone new to high altitude?",
  "Which Nepal trek feels the most adventurous?",
  "What are some underrated trekking routes in Nepal?",
  "Which trek is best for someone who dislikes crowds?",
  "What should I know before my first Himalayan trek?",
  "How should I prepare for a high-altitude trek?",
  "What should I pack for a week-long Himalayan trek?",
  "How do I know if I am acclimatizing properly?",
  "What makes a trekking route genuinely difficult?",
  "How much should I walk each day on a Himalayan trek?",
  "What are the biggest mistakes people make while trekking in Nepal?",

  // MOUNTAINS & LANDSCAPES

  "Which mountains can you see from Nepal?",
  "Where can I get incredible Himalayan sunrise views?",
  "Which Himalayan landscapes are the most unusual?",
  "Why do the Himalayas look so different from valley to valley?",
  "What makes high-altitude landscapes so dramatic?",
  "Where can I find wide Himalayan panoramas?",
  "Which places in Nepal have dramatic mountain valleys?",
  "What makes Himalayan passes so interesting?",
  "Why do some Himalayan valleys look almost Tibetan?",
  "Where can I experience a truly remote mountain landscape?",
  "What are some beautiful Himalayan viewpoints?",
  "Which mountains are easiest to recognize from Nepal?",
  "Why does the landscape change so quickly with altitude?",

  // QUIET & REMOTE PLACES

  "Where can I go in Nepal to escape the crowds?",
  "Suggest a peaceful mountain destination in Nepal.",
  "Where can I find a quieter trail in Nepal?",
  "Which places in Nepal still feel remote?",
  "Where can I experience a slower side of Nepal?",
  "What are some quiet places near the Himalayas?",
  "Where can I go for a few days without a busy tourist scene?",
  "Which Nepal destinations feel least commercial?",
  "Where can I find solitude in the mountains?",
  "Suggest a lesser-known place in Nepal for a short adventure.",
  "What are some overlooked mountain destinations in Nepal?",

  // ROUTES & ADVENTURE

  "What is the most interesting way to explore Nepal overland?",
  "Which mountain routes are worth taking slowly?",
  "What makes a good trekking route?",
  "How do I choose between two trekking routes?",
  "Which routes combine villages and mountain scenery?",
  "What are some scenic road journeys in Nepal?",
  "Which Nepal routes are good for an adventurous road trip?",
  "Where can I combine a motorcycle ride with trekking?",
  "What should I consider before taking a remote mountain road?",
  "Which routes are good for a four-day adventure?",
  "What makes a route worth taking even if it is longer?",

  // PHOTOGRAPHY

  "What is the best season for mountain photography in Nepal?",
  "Where can I photograph Himalayan sunrises?",
  "What makes a good mountain photograph?",
  "Which Nepal landscapes are best for photography?",
  "When is the best light for Himalayan photography?",
  "How do I photograph mountains in changing weather?",
  "What should I carry for trekking photography?",
  "How can I take better travel photographs while trekking?",
  "Where can I find dramatic landscapes for photography?",
  "What makes sunrise in the Himalayas look so different?",

  // CULTURE & PLACES

  "Why are prayer flags so common in the Himalayas?",
  "What makes Sherpa culture unique?",
  "Why are monasteries important in Himalayan villages?",
  "What are mani walls?",
  "Why do Himalayan villages look the way they do?",
  "How does altitude affect life in mountain communities?",
  "What are some interesting traditions in the Himalayas?",
  "How is life different in high-altitude villages?",
  "Why do different regions of Nepal feel culturally different?",
  "What makes Mustang culturally different from other parts of Nepal?",

  // SEASONS & CONDITIONS

  "When is the best time to trek in Nepal?",
  "What is trekking in Nepal like during winter?",
  "Can you trek in Nepal during monsoon?",
  "Which season gives the clearest Himalayan views?",
  "Why is autumn popular for trekking in Nepal?",
  "What changes when you trek in the Himalayas during spring?",
  "What should I expect from mountain weather?",
  "Why can Himalayan weather change so quickly?",
  "Which season is best for quiet trekking?",
  "What should I know about trekking during the colder months?",

  // GENERAL TRAVEL CURIOSITY

  "What is a place in Nepal more people should know about?",
  "If I had only four days in Nepal, where could I go?",
  "Suggest an unusual Nepal adventure.",
  "What is one Himalayan experience people often overlook?",
  "Where should I go if I want mountains without a famous trekking route?",
  "What is the difference between trekking and a mountain expedition?",
  "Why do people become so attached to the Himalayas?",
  "What makes a journey memorable?",
  "Why does travelling slowly change the experience?",
  "What makes a destination feel authentic?",
  "Tell me something surprising about Nepal.",
  "Give me a mountain destination I probably haven't heard of.",
  "What is one place in Nepal worth visiting before it becomes crowded?",
  "What kind of traveller would enjoy the quieter side of Nepal?",
  "What is the most underrated thing about travelling through Nepal?"
];

function showRandomAIPrompts() {
  const container = document.getElementById("ai-suggestions");

  if (!container) return;

  const journeyPrompts = aiPromptPool.filter(prompt =>
    /Pikey|Mustang|Tilicho|Manang|Ama Yangri|Pathibhara|Sandakpur|Kuri|Kalinchowk|Ilam|Manungkot/i.test(prompt)
  );

  const nepalPrompts = aiPromptPool.filter(prompt =>
    /Nepal|Himalayan|trek|mountain|trail|altitude|village|Himalayas/i.test(prompt)
  );

  const curiosityPrompts = aiPromptPool.filter(prompt =>
    !journeyPrompts.includes(prompt) && !nepalPrompts.includes(prompt)
  );

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  const selectedPrompts = [
    randomItem(journeyPrompts),
    randomItem(nepalPrompts),
    randomItem(curiosityPrompts)
  ];

  container.innerHTML = selectedPrompts
    .map(prompt => `
      <button type="button">${prompt}</button>
    `)
    .join("");

  const buttons = container.querySelectorAll("button");

  buttons.forEach((button, index) => {
    button.addEventListener("click", function() {
      askAI(selectedPrompts[index]);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  showRandomAIPrompts();
});
document.addEventListener("DOMContentLoaded", function() {
  showRandomAIPrompts();
});
let previousInteractionId = null;

async function sendAIMessage() {
  const input = document.getElementById("ai-input");
  const chat = document.getElementById("ai-chat");

  const message = input.value.trim();

  if (!message) return;

  addAIMessage("YOU", message, "user");
  input.value = "";

  addAIMessage("THE JOURNAL", '<span class="ai-thinking"><span></span><span></span><span></span></span>', "bot");

  try {
    const response = await fetch("https://beyond-the-trail-ai.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        previousInteractionId: previousInteractionId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    previousInteractionId = data.interactionId;

    chat.lastElementChild.remove();

    addAIMessage("THE JOURNAL", data.reply, "bot");

  } catch (error) {
    console.error("AI error:", error);

    chat.lastElementChild.remove();

    addAIMessage(
      "THE JOURNAL",
      "I could not connect to the journal right now. Please make sure the AI server is running.",
      "bot"
    );
  }
}


function addAIMessage(label, text, type) {
  const chat = document.getElementById("ai-chat");

  const message = document.createElement("div");

  message.className =
    type === "user"
      ? "ai-message ai-message-user"
      : "ai-message ai-message-bot";

  const formattedText =
    text.includes('class="ai-thinking"')
      ? text
      : formatAIText(text);

  message.innerHTML = `
    <span class="ai-label">${label}</span>
    <div class="ai-text">${formattedText}</div>
  `;

  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
}
function formatAIText(text) {
  let formatted = escapeAIText(text);
  formatted = formatted.replace(/【\d+†[^】]+】/g, "");

  // Remove escaped Markdown characters
  formatted = formatted.replace(/\\([*_#-])/g, "$1");

  // Convert headings
  formatted = formatted.replace(
    /^(#{1,6})\s+(.+)$/gm,
    function(match, hashes, title) {
      const level = Math.min(hashes.length + 1, 6);
      return `<h${level}>${title.trim()}</h${level}>`;
    }
  );

  // Convert bold
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Convert italic
  formatted = formatted.replace(
    /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
    "<em>$1</em>"
  );

  // Convert bullet lists
  formatted = formatted.replace(
    /(?:^|\n)((?:[-*]\s+.+(?:\n|$))+)/g,
    function(match, list) {
      const items = list
        .trim()
        .split("\n")
        .map(item => item.replace(/^[-*]\s+/, "").trim())
        .filter(Boolean)
        .map(item => `<li>${item}</li>`)
        .join("");

      return `<ul>${items}</ul>`;
    }
  );

  // Fix repeated numbered headings
  let routeNumber = 0;

  formatted = formatted.replace(
    /^1\.\s+(.+)$/gm,
    function(match, title) {
      routeNumber++;
      return `${routeNumber}. ${title}`;
    }
  );

  // Convert paragraphs
  const blocks = formatted
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(Boolean);

  formatted = blocks
    .map(block => {
      if (
        block.startsWith("<h") ||
        block.startsWith("<ul>") ||
        block.startsWith("<ol>")
      ) {
        return block;
      }

      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return formatted;
}

function escapeAIText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


function askAI(question) {
  const input = document.getElementById("ai-input");

  input.value = question;

  sendAIMessage();
}


document.getElementById("ai-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendAIMessage();
  }
});
