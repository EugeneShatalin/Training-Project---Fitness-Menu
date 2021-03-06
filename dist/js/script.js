

window.addEventListener('DOMContentLoaded', () => {
  
  //Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
        tabcontent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabcontent.forEach(item => {
      item.style.display = 'none';
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    })
  }

  function showTabContent(i = 0) {
    tabcontent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if(target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if(target === item) {
          hideTabContent();
          showTabContent(i);
        };
      });
    };
  });

  //Timer

  deadline = `2021-06-20`;

  function getTimeRemaining(endTime) {
    const t = Date.parse(endTime) - Date.parse(new Date()),
          days = Math.floor(t / (1000 * 60 * 60 * 24)),
          hours = Math.floor(t / (1000 * 60 * 60) % 24),
          minutes = Math.floor(t / (1000 * 60) % 60),
          seconds = Math.floor(t / 1000 % 60);

          return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds, 
          };
  };

  function getZero(num) {
    if(num >= 0 && num <= 9){
      return `0${num}`;
    } else {  return num }
  }

  function setClock (selector, endTime) {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

          updateClock();

          function updateClock() {
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0) {
              clearInterval(timeInterval);
            }
          }
  }

  setClock('.timer', deadline);

  //modal

  const btnShowModal = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal');

        function closeModal() {
          modalWindow.classList.remove('show');
          modalWindow.classList.add('hide');
          document.body.style.overflow = '';
        }

        function openModal() {
          modalWindow.classList.remove('hide');
          modalWindow.classList.add('show');
          document.body.style.overflow = 'hidden';
          clearInterval(modalTimerId);
        }

        btnShowModal.forEach( btn => {
            btn.addEventListener('click', openModal)
        });        
  
        modalWindow.addEventListener('click', (e) => {
          if(e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal();
          }
        });

        document.addEventListener('keydown', (e) => {
          if(e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
          }
        })

        modalTimerId = setTimeout(openModal, 50000);

        function showModalByScroll() {
          if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
          };
        }

        window.addEventListener('scroll', showModalByScroll);


  // Class for creating menu cards

        class MenuCard {
          constructor(src, alt, title, descr, price, parentSelector, ...classes) {
              this.src = src;
              this.alt = alt;
              this.title = title;
              this.descr = descr;
              this.price = price;
              this.transfer = 27;
              this.parent = document.querySelector(parentSelector);
              this.classes = classes;
              this.changeToUAH();
          }

          changeToUAH() {
            this.price = this.price * this.transfer
          }

          render() {
            const element = document.createElement('div')
            
            if(this.classes.length === 0) {
                element.classList.add('menu__item')
            } else {
              this.classes.forEach( className => element.classList.add(className) )
            }

            element.innerHTML = `            
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">????????:</div>
                <div class="menu__item-total"><span>${this.price}</span> ??????/????????</div>            
            `;         

            this.parent.append(element); 
            
          };
  };   

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  }

  getResource('http://localhost:3000/menu')
    .then(data => {
      data.forEach(({img, altimg, title, descr, price}) => {
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

  // forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: '??????????????! ?????????? ???? ?? ???????? ????????????????.',
    failure: '??????-???? ?????????? ???? ??????...',
  }

  forms.forEach( form => {
    bindPostData(form);
  })

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })

    return await res.json();
  }

    function bindPostData(form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
          display: block;
          margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMessage);
        
        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()))

        postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        })
      })
    }

    function showThanksModal(message) {
      const prevModalDialog = document.querySelector('.modal__dialog');

      prevModalDialog.classList.add('hide');
      openModal();

      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
        <div class="modal__content">
          <div class="modal__close" data-close>??</div>
          <div class="modal__title" data-close>${message}</div>
        </div>
      `

      document.querySelector('.modal').append(thanksModal);

      setTimeout( () => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
      }, 4000)
    }

  // slider
  
  const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider')
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if(slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
    } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
      slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 15;
      display: flex;
      justify-content: center;
      margin-right: 15%;
      margin-left: 15%;
      list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
      const dot =document.createElement('li');
      dot.setAttribute('data-slide-to', i+1);
      dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
      `;

      if(i == 0) {
        dot.style.opacity = 1;
      }

      indicators.append(dot);
      dots.push(dot);
    }

    next.addEventListener('click', () => {
      if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)){
        offset = 0;
      } else {
        offset += +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length) {
        slideIndex = 1;
      } else {
        slideIndex++;
      }

      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
    });

    prev.addEventListener('click', () => {
      if (offset == 0){        
        offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
        offset -= +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
        slideIndex = slides.length;
      } else {
        slideIndex--;
      }

      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideTo = e.target.getAttribute('data-slide-to');
        
        slideIndex = slideTo;
        offset = +width.slice(0, width.length - 2) * (slideTo - 1);

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slides.length < 10) {
          current.textContent = `0${slideIndex}`;
        } else {
          current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
      });
    });
  
  // slider version-1
  /* let indexSlide = 2;

  showSlides(indexSlide);

  if(slides.length < 10) {
    total.textContent = `0${slides.length}`;
  } else {
    total.textContent = slides.length;
  }

  function showSlides(n) {
    if(n > slides.length) {
      indexSlide = 1;
    }

    if(n < 1) {
      indexSlide = slides.length;
    }

    slides.forEach(item => item.style.display = 'none');
    slides[indexSlide - 1].style.display = 'block';

    if(indexSlide < 10) {
      current.textContent = `0${indexSlide}`;
    } else {
      current.textContent = indexSlide;
    }
  };

  function plusSlide(n) {
    showSlides(indexSlide += n);
  };

  prev.addEventListener('click', () => {
    plusSlide(-1);
  });

  next.addEventListener('click', () => {
    plusSlide(1);
  }); */

});