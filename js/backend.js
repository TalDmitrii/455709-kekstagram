'use strict';

(function () {
  // Отправляет данные на сервер.
  // @param {object} data - Содержит данные формы, которые будут отправлены на сервер.
  // @param {function} onLoad - Функция обратного вызова, которая срабатывает при успешном выполнении запроса.
  // @param {function} onError - Функция обратного вызова, которая срабатывает при неуспешном выполнении запроса.
  function upload(data, onLoad, onError) {
    var URL = 'https://js.dump.academy/kekstagram';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.status);
      } else {
        onError(xhr);
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  }

  // Получает данные с сервера, обрабатывает полученные запросы и передаёт полученную информацию в функцию обратного вызова.
  // @param {function} onLoad - Функция обратного вызова, которая срабатывает при успешном выполнении запроса.
  // @param {function} onError - Функция обратного вызова, которая срабатывает при неуспешном выполнении запроса.
  function load(onLoad, onError) {
    var URL = 'https://js.dump.academy/kekstagram/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', URL);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.send();
  }

  // Экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR.
  window.backend = {
    upload: upload,
    load: load
  };
})();
