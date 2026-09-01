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
