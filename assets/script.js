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

   IMPORTANT:

   The old version searched every gallery during page load.

   This version does NOT do that.

   Galleries are discovered only when:
   - The user opens a gallery
   - The user clicks a cover photo

   This dramatically reduces initial page loading time.
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

     Once a gallery has been discovered, its image list
     stays in memory.

     Opening the same gallery again will NOT search the
     files again.
     ========================================================= */

  const galleryCache = new Map();


  /* =========================================================
     FIND ONE IMAGE

     Supports:

       .jpg
       .JPG
       .jpeg
       .JPEG

     This function is only called when a gallery is actually
     needed.
     ========================================================= */

  function findImage(prefix, number) {

    return new Promise(function (resolve) {

      const padded =
        String(number).padStart(2, '0');

      const extensions = [
        '.jpg',
        '.JPG',
        '.jpeg',
        '.JPEG'
      ];

      let extensionIndex = 0;


      function tryNext() {

        if (
          extensionIndex >=
          extensions.length
        ) {

          resolve(null);
          return;

        }


        const path =
          IMAGE_FOLDER +
          prefix +
          '-' +
          padded +
          extensions[extensionIndex];


        const test =
          new Image();


        test.onload =
          function () {

            resolve(path);

          };


        test.onerror =
          function () {

            extensionIndex++;

            tryNext();

          };


        test.src = path;

      }


      tryNext();

    });

  }


  /* =========================================================
     DISCOVER GALLERY

     IMPORTANT PERFORMANCE CHANGE:

     This function is NOT called for every gallery during
     page load.

     It runs only when the gallery is actually requested.
     ========================================================= */

  async function discoverImages(prefix) {

    if (galleryCache.has(prefix)) {
      return galleryCache.get(prefix);
    }


    const images = [];

    /*
      Your galleries currently have relatively small,
      continuous numbering.

      We allow gaps, but stop after 4 consecutive missing
      numbers once images have already been found.

      This is much faster than the previous 10-gap search.
    */

    let consecutiveMissing = 0;

    const MAX_CONSECUTIVE_MISSING = 4;

    /*
      999 remains a safety limit.
    */

    for (
      let number = 1;
      number <= 999;
      number++
    ) {

      const path =
        await findImage(
          prefix,
          number
        );


      if (path) {

        images.push(path);

        consecutiveMissing = 0;

      } else {

        consecutiveMissing++;

        if (
          images.length > 0 &&
          consecutiveMissing >=
          MAX_CONSECUTIVE_MISSING
        ) {

          break;

        }

      }

    }


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

            /* Show lightweight loading animation */

            button.classList.add('gallery-loading');

            button.innerHTML =
              'Loading photos ' +
              '<span class="loading-dots">' +
                '<span></span>' +
                '<span></span>' +
                '<span></span>' +
              '</span>';


            await buildGallery();


            button.classList.remove('gallery-loading');


            if (
              !galleryImages.length
            ) {

              button.innerHTML =
                'Photos unavailable';

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

        There is NO initial discoverImages() call here.

        This is the main performance improvement.
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
