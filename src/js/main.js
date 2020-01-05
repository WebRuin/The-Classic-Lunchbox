window.addEventListener('load', () => {
  console.log('loaded');
  const openMenu = document.querySelector('.open-menu');
  const closeMenu = document.querySelector('.close-menu');
  const menu = document.querySelector('.nav-menu');

  openMenu.onclick = () => {
    console.log('clicked');
    menu.classList.toggle('open');
  };
  openMenu.addEventListener('keyup', event => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      menu.classList.toggle('open');
    }
  });

  closeMenu.onclick = () => menu.classList.toggle('open');
  closeMenu.addEventListener('keyup', event => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      menu.classList.toggle('open');
    }
  });
});
