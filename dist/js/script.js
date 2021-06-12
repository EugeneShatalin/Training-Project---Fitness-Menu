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

  deadline = '2021-06-20';

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

        btnShowModal.forEach( btn => {
            btn.addEventListener('click', () => {
              modalWindow.classList.remove('hide');
              modalWindow.classList.add('show');
              document.body.style.overflow = 'hidden';
            })
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
  
});