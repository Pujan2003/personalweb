(function () {
  'use strict';

  /* =========================================================
     BASIC SITE FUNCTIONS
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

    const progress =
      scrollable > 0
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

    menuButton.addEventListener(
      'click',
      function () {

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
          open
            ? 'Close menu'
            : 'Open menu'
        );
      }
    );


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
                speed *
                -1) +
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
   ========================================================= */

(function () {
  'use strict';

  const lb =
    document.getElementById('lightbox');

  const img =
    document.getElementById('lightboxImage');

  const title =
    document.getElementById('lightboxTitle');

  const counter =
    document.getElementById('lightboxCounter');

  if (!lb || !img) return;


  /* =========================================================
     IMAGE FOLDER
     ========================================================= */

  const IMAGE_FOLDER =
    'assets/images/';


  /* =========================================================
     EXACT PHOTO COUNTS

     These match the files currently in your folder.
     ========================================================= */

  const PHOTO_COUNTS = {

    amayangri: 26,

    ilam: 6,

    kuri: 18,

    manang: 52,

    manungkot: 6,

    pathibhara: 17,

    sandakpur: 12

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
     CREATE IMAGE PATHS

     Example:
       manang-01.jpg
       manang-02.jpg
       ...
       manang-52.jpg
     ========================================================= */

  function createImages(prefix, count) {

    const images = [];

    for (let i = 1; i <= count; i++) {

      const number =
        String(i).padStart(2, '0');

      images.push(
        IMAGE_FOLDER +
        prefix +
        '-' +
        number +
        '.jpg'
      );

    }

    return images;

  }


  /* =========================================================
     GET GALLERY IMAGES
     ========================================================= */

  function getGalleryImages(prefix) {

    const key =
      String(prefix || '')
        .trim()
        .toLowerCase();

    const count =
      PHOTO_COUNTS[key];

    if (!count) {

      console.warn(
        'No photo count configured for gallery:',
        prefix
      );

      return [];

    }

    return createImages(
      key,
      count
    );

  }


  /* =========================================================
     PRELOAD IMAGE
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

    if (!state.images.length) return;

    const current =
      state.images[state.index];


    img.src =
      current;


    img.alt =
      state.title +
      ' photograph ' +
      (state.index + 1);


    if (title) {

      title.textContent =
        state.title;

    }


    if (counter) {

      counter.textContent =
        String(
          state.index + 1
        ).padStart(2, '0') +
        ' / ' +
        String(
          state.images.length
        ).padStart(2, '0');

    }


    const nextIndex =
      state.index >=
      state.images.length - 1
        ? 0
        : state.index + 1;


    const prevIndex =
      state.index <= 0
        ? state.images.length - 1
        : state.index - 1;


    preload(
      state.images[nextIndex]
    );

    preload(
      state.images[prevIndex]
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

      title: name || prefix,

      images: images,

      index: Math.max(
        0,
        Math.min(
          index,
          images.length - 1
        )
      )

    };


    render();


    lb.classList.add(
      'active'
    );


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

    lb.classList.remove(
      'active'
    );


    lb.setAttribute(
      'aria-hidden',
      'true'
    );


    document.body.style.overflow =
      '';


    setTimeout(
      function () {

        if (
          !lb.classList.contains(
            'active'
          )
        ) {

          img.removeAttribute(
            'src'
          );

        }

      },
      220
    );

  }


  /* =========================================================
     NEXT PHOTO
     ========================================================= */

  function nextPhoto() {

    if (!state.images.length) return;

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

    if (!state.images.length) return;

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
     CLICK OUTSIDE LIGHTBOX
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
     KEYBOARD CONTROLS
     ========================================================= */

  document.addEventListener(
    'keydown',
    function (e) {

      if (
        !lb.classList.contains(
          'active'
        )
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


      const dx =
        startX -
        e.changedTouches[0].screenX;


      const dy =
        startY -
        e.changedTouches[0].screenY;


      if (
        Math.abs(dx) > 50 &&
        Math.abs(dx) > Math.abs(dy)
      ) {

        if (dx > 0) {

          nextPhoto();

        } else {

          previousPhoto();

        }

      }

    },
    { passive: true }
  );


  /* =========================================================
     SET UP EVERY GALLERY
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


      if (!grid) return;


      const prefix =
        String(
          gallery.dataset.prefix || ''
        )
        .trim()
        .toLowerCase();


      const name =
        gallery.dataset.title ||
        prefix;


      /* =====================================================
         GET EXACT IMAGE LIST
         ===================================================== */

      const galleryImages =
        getGalleryImages(
          prefix
        );


      /* =====================================================
         STORY PHOTO COUNT
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

            const b =
              fact.querySelector(
                'b'
              );


            if (
              b &&
              b.textContent
                .trim()
                .toUpperCase() ===
              'PHOTOS'
            ) {

              photoFact =
                fact;

            }

          }
        );

      }


      /* =====================================================
         UPDATE COUNTS
         ===================================================== */

      function updatePhotoCounts() {

        const count =
          galleryImages.length;


        if (!count) return;


        /* STORY FACT */

        if (photoFact) {

          photoFact.innerHTML =
            '<b>PHOTOS</b> ' +
            count;

        }


        /* GALLERY HEADING */

        if (headingSmall) {

          headingSmall.textContent =
            (count + 1) +
            ' photographs · cover shown above';

        }


        /* GALLERY BUTTON */

        if (button) {

          button.innerHTML =
            'Enter the Photo Chapter ' +
            '<span>' +
            count +
            ' photos</span> ↓';

        }

      }


      updatePhotoCounts();


      /* =====================================================
         BUILD GALLERY

         Photo 1 = cover.
         Photos 2 onward = gallery grid.
         ===================================================== */

      let built = false;


      function buildGallery() {

        if (built) return;


        if (!galleryImages.length) {

          console.warn(
            'No images configured for:',
            prefix
          );

          return;

        }


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

              console.warn(
                'Image failed to load:',
                image.src
              );

              figure.remove();

            },
            { once: true }
          );


          figure.appendChild(
            image
          );


          /* OPEN LIGHTBOX */

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

      }


      /* =====================================================
         GALLERY OPEN / CLOSE
         ===================================================== */

      if (button) {

        button.addEventListener(
          'click',
          function () {

            const isOpen =
              grid.classList.contains(
                'open'
              );


            /* OPEN */

            if (!isOpen) {

              buildGallery();


              if (
                !galleryImages.length
              ) {
                return;
              }


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

            }


            /* CLOSE */

            else {

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

          }
        );

      }


      /* =====================================================
         FLOATING BUTTON
         ===================================================== */

      function checkGalleryEnd() {

        if (
          !grid.classList.contains(
            'open'
          )
        ) {
          return;
        }


        if (!button) return;


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
          function () {

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

  if (!scrollTop) return;


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
