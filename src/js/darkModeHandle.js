export const darkModeHandle = () => {
  const htmlElement = document.documentElement;
  const darkModeSwitcher = document.getElementById('toggleDarkMode');

  if (localStorage.getItem('mode') === 'light') {
    htmlElement.classList.remove('dark');
    darkModeSwitcher.checked = false;
  }

  darkModeSwitcher.addEventListener('input', () => {
    htmlElement.classList.toggle('dark');

    htmlElement.classList.contains('dark') ? localStorage.setItem('mode', 'dark') : localStorage.setItem('mode', 'light');
  });
};
