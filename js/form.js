'use strict';

(function () {
  var ESC_CODE = 27;
  var pageMain = document.querySelector('main');
  var form = document.querySelector('.img-upload__form');
  var uploadFile = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.img-upload__overlay');
  var buttonUploadFormClose = document.querySelector('.img-upload__cancel');
  var effectsList = document.querySelector('.effects__list');
  effectsList.style.userSelect = 'none';
  var currentEffect = document.querySelector('.img-upload__preview img');
  currentEffect.style.userSelect = 'none';
  var textHashtag = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');
  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');

  var effect = document.querySelector('.effect-level');
  var effectNone = document.querySelector('#effect-none');
  var effectHandle = effect.querySelector('.effect-level__pin');
  var effectLineDepth = effect.querySelector('.effect-level__depth');

  // Отправляет данные формы.
  form.addEventListener('submit', function (evt) {
    // Сбрасывает стандартное поведение формы.
    evt.preventDefault();

    // Отправляет данные, обрабатывает ответ.
    window.backend.upload(new FormData(form), successUploadForm, errorUploadForm);
  });

  // Функция сообщает о неуспешной попытке загрузки данных.
  function errorUploadForm() {
    // Скрывает форму.
    uploadForm.classList.add('hidden');

    // Открывает сообщение о неудачной попытке загрузки данных.
    renderMessage(false);
  }

  // Функция сообщает о успешной попытке загрузки данных.
  function successUploadForm() {
    // Скрывает форму.
    uploadForm.classList.add('hidden');

    // Сбрасывает значения формы на дефолтные.
    textHashtag.value = '';
    textDescription.value = '';
    currentEffect.className = '';
    currentEffect.style.filter = '';

    // Открывает сообщение о удачной попытке загрузки данных.
    renderMessage(true);
  }

  // Создаёт сообщение о загрузке данных из формы.
  // @param {object} isSuccess - Статус сообщения: отправлено или нет.
  function renderMessage(isSuccess) {
    var message;

    // Клонирует шаблон в зависимости от статуса.
    if (isSuccess) {
      message = successMessage.cloneNode(true);
    } else {
      message = errorMessage.cloneNode(true);
    }

    // Добавляет сообщение в тег 'main'.
    pageMain.appendChild(message);

    // TODO: пока не работает.
    // Обработчик закрывает сообщение об отправке.
    // document.addEventListener('keydown', escCloseMessage);
  }

  // TODO: пока не работает.
  // Закрывает сообщение об отправке по ESC.
  // function escCloseMessage(evt) {
  //   if (evt.keyCode === ESC_CODE) {
  //     document.querySelector('.success').classList.add('visually-hidden');
  //   }
  // }

  // Закрывает форму загрузки изображения по ESC.
  function escCloseUploadForm(evt) {
    if (evt.keyCode === ESC_CODE) {
      uploadForm.classList.add('hidden');
    }
  }

  // Открывает форму загрузки изображения.
  function openUploadForm() {
    uploadForm.classList.remove('hidden');

    document.addEventListener('keydown', escCloseUploadForm);
  }

  // Закрывает форму загрузки изображения.
  function closeUploadForm() {
    uploadForm.classList.add('hidden');
  }

  // Открывает форму загрузки изображения при наступлении события 'change'.
  uploadFile.addEventListener('change', openUploadForm);

  // Удаляет значение в поле загрузки файла - 'input'.
  uploadFile.addEventListener('click', function () {
    uploadFile.value = '';
  });

  // Закрывает форму загрузки фотографии.
  buttonUploadFormClose.addEventListener('click', closeUploadForm);

  // Обрабатывает переключение фильтра.
  function useFilter(evt) {
    var target = evt.target;

    if (target.tagName === 'INPUT') {
      currentEffect.className = '';
      var nextElem = target.nextElementSibling.children[0];
      currentEffect.classList.add(nextElem.classList[1]);

      // При переключении фильтра, сбрасывает положение слайдера на 100%.
      effectHandle.style.left = '100%';
      effectLineDepth.style.width = '100%';

      // При переключении фильтра, сбрасывает свойство фильтра на 100%.
      if (currentEffect.className === 'effects__preview--none') {
        currentEffect.style.filter = '';
      } else if (currentEffect.className === 'effects__preview--chrome') {
        currentEffect.style.filter = 'grayscale(1)';
      } else if (currentEffect.className === 'effects__preview--sepia') {
        currentEffect.style.filter = 'sepia(1)';
      } else if (currentEffect.className === 'effects__preview--marvin') {
        currentEffect.style.filter = 'invert(100%)';
      } else if (currentEffect.className === 'effects__preview--phobos') {
        currentEffect.style.filter = 'blur(3px)';
      } else if (currentEffect.className === 'effects__preview--heat') {
        currentEffect.style.filter = 'brightness(3)';
      }
    }
  }

  // При клике на первом элементе без эффекта, скрывает слайдер.
  effectNone.addEventListener('click', addEffectLineHidden);
  effectNone.addEventListener('blur', removeEffectLineHidden);

  // Скрывает слайдер.
  function addEffectLineHidden() {
    effect.classList.add('visually-hidden');
  }

  // Показывает слайдер.
  function removeEffectLineHidden() {
    effect.classList.remove('visually-hidden');
  }

  // Добавляется обработчик переключения фильтра.
  effectsList.addEventListener('click', useFilter);

  // Проверяет наличие в массиве одинаковых элементов.
  // @param {array} valuesArray - Проверяемый массив.
  // @returns {bool}.
  function sortArray(valuesArray) {
    var isSimilarValue = false;

    for (var i = 0; i < valuesArray.length; i++) {
      for (var j = i + 1; j < valuesArray.length; j++) {
        if (valuesArray[i].toLowerCase() === valuesArray[j].toLowerCase()) {
          isSimilarValue = true;
        }
      }
    }

    return isSimilarValue;
  }

  // Проверяет значение поля 'input', на соответствие заданным условиям.
  // @param {object} evt - ???????????????
  function checkInput(evt) {
    var target = evt.target;
    var stringHashtags = evt.target.value;
    var arrayHashtags = stringHashtags.split(' ');

    for (var i = 0; i < arrayHashtags.length; i++) {
      var hashtag = arrayHashtags[i];
      var hashtagSymbols = hashtag.split('');

      if ((hashtag.length > 0) && (hashtagSymbols[0] !== '#')) {
        target.setCustomValidity('Хеш-тег начинается с #');
      } else if (hashtagSymbols.length > 20) {
        target.setCustomValidity('Длина одного хеш-тега должна быть не более 20 символов');
      } else if (hashtagSymbols.length > 0 && hashtagSymbols.length < 2) {
        target.setCustomValidity('Длина одного хеш-тега должна быть не менее 2 символов');
      } else if (arrayHashtags.length > 5) {
        target.setCustomValidity('Не более 5 хеш-тегов');
      } else if (sortArray(arrayHashtags)) {
        target.setCustomValidity('Одинаковых хеш-тегов не должно быть');
      } else {
        target.setCustomValidity('');
      }
    }
  }

  // Проверяет поле с хеш-тегами на валидность.
  textHashtag.addEventListener('input', checkInput);

  // При фокусе на элементе 'textHashtag' удаляет обработчик закрытия формы по ESC.
  textHashtag.addEventListener('focus', function () {
    document.removeEventListener('keydown', escCloseUploadForm);
  });

  // При фокусе на элементе 'textDescription' удаляет обработчик закрытия формы по ESC.
  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', escCloseUploadForm);
  });

  // При снятии фокуса с элемента 'textHashtag' добавляет обработчик закрытия формы по ESC.
  textHashtag.addEventListener('blur', function () {
    document.addEventListener('keydown', escCloseUploadForm);
  });

  // При снятии фокуса с элемента 'textDescription' добавляет обработчик закрытия формы по ESC.
  textDescription.addEventListener('blur', function () {
    document.addEventListener('keydown', escCloseUploadForm);
  });
})();
