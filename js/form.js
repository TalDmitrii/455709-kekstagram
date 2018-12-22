'use strict';

(function () {
  var ESC_CODE = 27;
  var MIN_SCALE_VALUE = 25;
  var MAX_SCALE_VALUE = 100;
  var HASHTAG_MAX_LENGTH = 20;
  var HASHTAG_MIN_LENGTH = 2;
  var HASHTAG_MAX_COUNT = 5;
  var blockPictures = document.querySelector('.pictures');

  var pageMain = document.querySelector('main');
  var form = document.querySelector('.img-upload__form');
  var uploadFile = document.querySelector('#upload-file');
  var previewMini = form.querySelectorAll('.effects__preview');
  var uploadForm = document.querySelector('.img-upload__overlay');
  var buttonUploadFormClose = document.querySelector('.img-upload__cancel');
  var imgSizeScale = form.querySelector('.img-upload__scale');
  var scaleControlValue = imgSizeScale.querySelector('.scale__control--value');
  var buttonSubmit = form.querySelector('.img-upload__submit');
  var inputHashtag = form.querySelector('.text__hashtags');
  var STEP_CONTROL = 25;
  var scaleValuePercent;

  var effectsList = document.querySelector('.effects__list');
  effectsList.style.userSelect = 'none';
  var currentEffect = document.querySelector('.img-upload__preview img');
  currentEffect.style.userSelect = 'none';
  var textHashtag = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');

  var effect = document.querySelector('.effect-level');
  var effectNone = document.querySelector('#effect-none');
  var effectHandle = effect.querySelector('.effect-level__pin');
  var effectLineDepth = effect.querySelector('.effect-level__depth');

  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');
  var message;
  var closeMessageButton;

  var imageElement = document.querySelector('.img-upload__preview img');

  uploadFile.addEventListener('change', function (evt) {
    // останавливаем действие по умолчанию
    evt.preventDefault();
    // останавливаем всплытие события
    evt.stopPropagation();

    // если файлы не равны undefined и их количество больше нуля
    if (uploadFile.files && uploadFile.files.length !== 0) {
      // берем первый файл
      var file = uploadFile.files[0];
      // создаем ридер
      var reader = new FileReader();
      var reader2 = new FileReader();

      // как только ридер загрузит бинарные данные - добавляем данные -
      // - в src картинки
      reader.onloadend = function () {
        imageElement.src = reader.result;
      };

      reader2.onloadend = function () {
        previewMini.forEach(function (elem) {
          elem.style.backgroundImage = 'url(' + reader.result + ')';
        });
      };

      // если файл есть
      if (file) {
        // читаем данные из файла
        reader.readAsDataURL(file);
        reader2.readAsDataURL(file);
      } else {
        imageElement.src = '';
      }
    }
  });

  // При клике по кнопке устанавливает размер изображения.
  imgSizeScale.addEventListener('click', onScaleSizeValueClick);

  // Расчитывает значение поля - 'размер изображения'.
  // @param {object} evt - Объект события, отлавливаемого на кнопках '-/+'.
  function onScaleSizeValueClick(evt) {
    // Переводит значение поля 'размер изображения' из процентов в десятичное число.
    var scaleValueInt = parseInt(scaleControlValue.value, 10);

    // Если событие происходит на кнопке '-', уменьшает значение поля 'размер изображения' на величину 'STEP_CONTROL'.
    if (evt.target.classList[1] === 'scale__control--smaller') {
      scaleValuePercent = (scaleValueInt - STEP_CONTROL) + '%';
      // Минимальное значение поля 'размер изображения' равно 25%.
      if (parseInt(scaleValuePercent, 10) < MIN_SCALE_VALUE) {
        scaleValuePercent = '25%';
      }
    // Если событие происходит на кнопке '+', увеличивает значение поля 'размер изображения' на величину 'STEP_CONTROL'.
    } else if (evt.target.classList[1] === 'scale__control--bigger') {
      scaleValuePercent = (scaleValueInt + STEP_CONTROL) + '%';
      // Максимальное значение поля 'размер изображения' равно 100%.
      if (parseInt(scaleValuePercent, 10) > MAX_SCALE_VALUE) {
        scaleValuePercent = '100%';
      }
    } else {
      scaleValuePercent = '55%';
    }

    // Записывает новое значение в поле 'размер изображения'.
    scaleControlValue.value = scaleValuePercent;

    // Устанавливает для изображения стиль 'transform' на основе рассчитанного значения.
    currentEffect.style.transform = 'scale(' + (parseInt(scaleValuePercent, 10) / 100) + ')';
  }

  // Отправляет данные формы.
  form.addEventListener('submit', function (evt) {
    // Сбрасывает стандартное поведение формы.
    evt.preventDefault();
    inputHashtag.style.border = '';

    window.backend.upload(new FormData(form), successUploadForm, errorUploadForm);
  });

  // Функция сообщает о неуспешной попытке загрузки данных.
  function errorUploadForm(xhr) {
    // Скрывает форму.
    uploadForm.classList.add('hidden');

    // Показывает сообщение о неудачной попытке загрузки данных.
    renderMessage(false);

    // Обрабатывает тип ошибки.
    handleError(xhr);
  }

  function handleError(xhr) {
    var errorTitle;

    // Обрабатывает текст сообщения, если загружаемый файл не изображение.
    if (xhr.response[0].errorMessage === 'should be an image') {
      errorTitle = message.querySelector('.error__title');
      errorTitle.textContent = 'Загружаемый файл должен быть в формате изображения';
      errorTitle.style.lineHeight = '32px';
    }

    // Обрабатывает текст сообщения, если текст хеш-тега не проходит валидацию.
    if (xhr.response[0].errorMessage === 'hashtags should start with \'#\' and splitted by \' \'') {
      errorTitle = message.querySelector('.error__title');
      errorTitle.textContent = 'Хеш-тег должен начинаться с \'#\'';
      errorTitle.style.lineHeight = '32px';
    }
  }

  // Функция сообщает об успешной попытке загрузки данных.
  function successUploadForm() {
    // Скрывает форму.
    uploadForm.classList.add('hidden');

    // Сбрасывает все значения формы.
    setCustomValue();

    // Показывает сообщение об удачной попытке загрузки данных.
    renderMessage(true);
  }

  // Сбрасывает все значения формы на начальные.
  function setCustomValue() {
    textHashtag.value = '';
    textDescription.value = '';
    currentEffect.className = '';
    currentEffect.style.filter = '';
    currentEffect.className = 'effects__preview--none';
    scaleControlValue.value = '100%';
    currentEffect.style.transform = 'scale(1)';
    effectNone.checked = true;
    effect.classList.add('visually-hidden');
  }

  // Создаёт сообщение о загрузке данных из формы, добавляет обработчики закрытия сообщения.
  // @param {object} isSuccess - Статус сообщения: отправлено или нет.
  function renderMessage(isSuccess) {
    // Создаёт сообщение на основе шаблона в зависимости от статуса 'успешно/неуспешно'.
    if (isSuccess) {
      message = successMessage.cloneNode(true);
      closeMessageButton = message.querySelector('.success__button');
    } else if (!isSuccess) {
      message = errorMessage.cloneNode(true);
      closeMessageButton = message.querySelector('.error__buttons');
    }

    // Добавляет сообщение в тег 'main'.
    pageMain.appendChild(message);

    // Обработчик закрывает сообщение об отправке данных по ESC.
    document.addEventListener('keydown', onCloseMessageKeydown);

    // Обработчик закрывает сообщение об отправке данных при клике по произвольной области.
    document.addEventListener('click', onWindowClick);

    // Обработчик закрывает сообщение об отправке данных при клике по кнопке.
    closeMessageButton.addEventListener('click', onButtonCloseClick);
  }

  // Закрывает сообщение об отправке данных по ESC.
  function onCloseMessageKeydown(evt) {
    if (evt.keyCode === ESC_CODE) {
      pageMain.removeChild(message);
      document.removeEventListener('keydown', onCloseMessageKeydown);
      closeMessageButton.removeEventListener('click', onButtonCloseClick);
    }
  }

  // Закрывает сообщение об отправке данных при клике по произвольной области.
  function onWindowClick(evt) {
    if (evt.target.className === message.className) {
      pageMain.removeChild(message);
      document.removeEventListener('click', onWindowClick);
      document.removeEventListener('keydown', onCloseMessageKeydown);
      blockPictures.addEventListener('click', window.preview.onImageClick);
    }
  }

  // Закрывает сообщение об отправке данных по клику.
  function onButtonCloseClick() {
    pageMain.removeChild(message);
    document.removeEventListener('keydown', onCloseMessageKeydown);
    closeMessageButton.removeEventListener('click', onButtonCloseClick);
  }

  // Закрывает форму загрузки изображения по ESC.
  function onEscKeydown(evt) {
    if (evt.keyCode === ESC_CODE) {
      uploadForm.classList.add('hidden');
      setCustomValue();

      blockPictures.addEventListener('click', window.preview.onImageClick);
    }
  }

  // Открывает форму загрузки изображения.
  function onInputUploadChange() {
    blockPictures.removeEventListener('click', window.preview.onImageClick);
    uploadForm.classList.remove('hidden');
    setCustomValue();

    document.addEventListener('keydown', onEscKeydown);
    document.addEventListener('click', onEdgeClick);
  }

  // Закрывает форму загрузки изображения при клике на произвольную область.
  function onEdgeClick(evt) {
    if (evt.target.className === 'img-upload__overlay') {
      uploadForm.classList.add('hidden');
      document.addEventListener('keydown', onEscKeydown);
      document.removeEventListener('click', onEdgeClick);
      blockPictures.addEventListener('click', window.preview.onImageClick);
    }
  }

  // Закрывает форму загрузки изображения.
  function onButtonUploadFormClick() {
    uploadForm.classList.add('hidden');
    setCustomValue();

    blockPictures.addEventListener('click', window.preview.onImageClick);
    document.addEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onEdgeClick);
  }

  // Открывает форму загрузки изображения при наступлении события 'change'.
  uploadFile.addEventListener('change', onInputUploadChange);

  // Удаляет значение в поле загрузки файла - 'input'.
  uploadFile.addEventListener('click', function () {
    uploadFile.value = '';
  });

  // Закрывает форму загрузки изображения.
  buttonUploadFormClose.addEventListener('click', onButtonUploadFormClick);

  // Обрабатывает переключение фильтра.
  function onFilterClick(evt) {
    var target = evt.target;

    if (target.tagName === 'INPUT') {
      currentEffect.className = '';
      var nextElem = target.nextElementSibling.children[0];
      currentEffect.classList.add(nextElem.classList[1]);

      // Если выбирается любой ненулевой фильтр, то слайдер показывается.
      if (currentEffect.className !== 'effects__preview--none') {
        effect.classList.remove('visually-hidden');
      }

      // При переключении фильтра, сбрасывает положение слайдера на 100%.
      effectHandle.style.left = '100%';
      effectLineDepth.style.width = '100%';

      // При переключении фильтра, сбрасывает свойство фильтра на максимальное значение.
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
  effectNone.addEventListener('click', onEffectNoneFilterClick);
  effectNone.addEventListener('blur', onEffectNoneFilterBlur);

  // Скрывает слайдер.
  function onEffectNoneFilterClick() {
    effect.classList.add('visually-hidden');
  }

  // Показывает слайдер.
  function onEffectNoneFilterBlur() {
    effect.classList.remove('visually-hidden');
  }

  // Добавляется обработчик переключения фильтра.
  effectsList.addEventListener('click', onFilterClick);

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
  // @param {object} evt - Объект события изменения содержимого поля 'input'.
  function onFieldHashtagInput(evt) {
    var target = evt.target;
    // Берёт содержимое поля 'input'.
    var stringHashtags = target.value;
    // Разбивает содержимое на строки, и создаёт массив из них.
    var arrayHashtags = stringHashtags.split(' ');

    validateArray(arrayHashtags, target);
  }

  // Проверяет массив строк на валидность.
  function validateArray(exampleArray, target) {
    var answer;

    exampleArray.forEach(function (hashtag) {
      var hashtagSymbols = hashtag.split('');

      if (!answer) {
        switch (hashtag !== '') {
          case ((hashtag.length > 1) && (hashtagSymbols[0] !== '#')):
            answer = 'Хеш-тег начинается с #';
            break;
          case (hashtagSymbols.length > HASHTAG_MAX_LENGTH):
            answer = 'Длина одного хеш-тега должна быть не более 20 символов';
            break;
          case (hashtagSymbols.length > 0 && hashtagSymbols.length < HASHTAG_MIN_LENGTH):
            answer = 'Длина одного хеш-тега должна быть не менее 2 символов';
            break;
          case (exampleArray.length > HASHTAG_MAX_COUNT):
            answer = 'Не более 5 хеш-тегов';
            break;
          case sortArray(exampleArray):
            answer = 'Одинаковых хеш-тегов не должно быть';
            break;

          default: answer = ''; inputHashtag.style.border = '';
        }
      }
    });

    target.setCustomValidity(answer);
  }

  // Проверяет поле с хеш-тегами на валидность.
  textHashtag.addEventListener('input', onFieldHashtagInput);

  buttonSubmit.addEventListener('click', function () {
    inputHashtag.style.border = '2px solid red';
  });

  // При фокусе на элементе 'textHashtag' удаляет обработчик закрытия формы по ESC.
  textHashtag.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscKeydown);
  });

  // При фокусе на элементе 'textDescription' удаляет обработчик закрытия формы по ESC.
  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscKeydown);
  });

  // При снятии фокуса с элемента 'textHashtag' добавляет обработчик закрытия формы по ESC.
  textHashtag.addEventListener('blur', function () {
    document.addEventListener('keydown', onEscKeydown);
  });

  // При снятии фокуса с элемента 'textDescription' добавляет обработчик закрытия формы по ESC.
  textDescription.addEventListener('blur', function () {
    document.addEventListener('keydown', onEscKeydown);
  });
})();
