export const loadYmaps = () => {
  return new Promise((resolve) => {
    if (window.ymaps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU ';
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(() => resolve());
    };

    document.body.appendChild(script);
  });
};