

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
        btnHideModal = document.querySelector('[data-close]'),
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

        btnHideModal.addEventListener('click', closeModal)
  
        modalWindow.addEventListener('click', (e) => {
          if(e.target === modalWindow) {
            closeModal();
          }
        });

        document.addEventListener('keydown', (e) => {
          if(e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
          }
        })

        modalTimerId = setTimeout(openModal, 3000);

        function showModalByScroll() {
          if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
          };
        }

        window.addEventListener('scroll', showModalByScroll);


  // Class for creating menu cards

        class MenuCard {
          constructor(src, alt, title, descr, price, parentSelector) {
              this.src = src;
              this.alt = alt;
              this.title = title;
              this.descr = descr;
              this.price = price;
              this.transfer = 27;
              this.parent = document.querySelector(parentSelector);
              this.changeToUAH();
          }

          changeToUAH() {
            this.price = this.price * this.transfer
          }

          render() {
            const element = document.createElement('div')
            element.innerHTML = `
            <div class="menu__item">
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;         

            this.parent.append(element); 
            
          };
  };   
  
  new MenuCard(
    "img/tabs/vegy.jpg", 
    "vegy", 
    'Меню "Фитнес"', 
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 
    22, 
    '.menu .container')
    .render();

    new MenuCard(
      "img/tabs/elite.jpg", 
      "elite", 
      'Меню “Премиум”', 
      'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 
      25, 
      '.menu .container')
      .render();

      new MenuCard(
        "img/tabs/post.jpg", 
        "post", 
        'Меню "Постное"', 
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 
        12, 
        '.menu .container')
        .render();

});