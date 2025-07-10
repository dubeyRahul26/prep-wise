export const applyTheme = () => {
  const userTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const html = document.documentElement;

  if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }
};

export const setTheme = (theme: 'light' | 'dark' | 'system') => {
  if (theme === 'system') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', theme);
  }

  applyTheme();
};
