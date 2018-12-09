'use strict';

(function () {
  var ESC_CODE = 27;
  var uploadFile = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.img-upload__overlay');
  var buttonUploadFormClose = document.querySelector('.img-upload__cancel');
  var effectsList = document.querySelector('.effects__list');
  effectsList.style.userSelect = 'none';
  var currentEffect = document.querySelector('.img-upload__preview img');
  currentEffect.style.userSelect = 'none';
  var textHashtag = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');

  var effect = document.querySelector('.effect-level');
  var effectLevel = effect.querySelector('.effect-level__value');
  var effectHandle = effect.querySelector('.effect-level__pin');
  var effectLine = effect.querySelector('.effect-level__line');
  var effectLineDepth = effect.querySelector('.effect-level__depth');
  var isDraggable = false;
  var cursorStartX;
  var pinStartX;

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

  // Удаляет значение 'input'.
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
  var effectNone = document.querySelector('#effect-none');

  effectNone.addEventListener('click', addEffectLineHidden);
  effectNone.addEventListener('blur', removeEffectLineHidden);

  function addEffectLineHidden() {
    effect.classList.add('visually-hidden');
  }

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

  textHashtag.addEventListener('input', checkInput);

  // При фокусе на элементе 'textHashtag' удаляет обработчик закрытия формы по ESC.
  textHashtag.addEventListener('focus', function () {
    document.removeEventListener('keydown', escCloseUploadForm);
  });

  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', escCloseUploadForm);
  });

  // При снятии фокуса с элемента 'textHashtag' добавляет обработчик закрытия формы по ESC.
  textHashtag.addEventListener('blur', function () {
    document.addEventListener('keydown', escCloseUploadForm);
  });

  textDescription.addEventListener('blur', function () {
    document.addEventListener('keydown', escCloseUploadForm);
  });

  // Добавляет обработчик drug-n-drop.
  effectHandle.addEventListener('mousedown', function (evt) {
    isDraggable = true;

    cursorStartX = evt.clientX;
    pinStartX = evt.target.offsetLeft;

    document.addEventListener('mousemove', setPinPosition);
    document.addEventListener('mouseup', function () {
      isDraggable = false;
      document.removeEventListener('mousemove', setPinPosition);
    });
  });

  // Расчитывает и устанавливает положение ползунка при drug-n-drop.
  // @param {object} moveEvt - Объект event.
  function setPinPosition(moveEvt) {
    var sliderWidth = effectLine.clientWidth;
    var percentSliderWidth = sliderWidth / 100;

    if (moveEvt.buttons === 1 && isDraggable) {
      var cursorShiftX = moveEvt.clientX - cursorStartX;
      var pinShiftX = pinStartX + cursorShiftX;
      var pinShiftPercentX = pinShiftX / percentSliderWidth;

      if (pinShiftPercentX > 100) {
        pinShiftPercentX = 100;
      } else if (pinShiftPercentX < 0) {
        pinShiftPercentX = 0;
      }

      effectHandle.style.left = pinShiftPercentX + '%';
      effectLineDepth.style.width = pinShiftPercentX + '%';
      effectLevel.value = Math.round(pinShiftPercentX);

      setEffectValue(effectLevel.value, currentEffect);
    }
  }

  // Устанавливает глубину эффекта.
  // @param {number} percent - Значение глубины эффекта в процентах.
  // @param {object} currentEffect - Текущий эффект, к которому применяется изменение глубины.
  function setEffectValue(percent, effectImage) {
    if (effectImage.className === 'effects__preview--chrome') {
      effectImage.style.filter = 'grayscale(' + percent / 100 + ')';
    } else if (effectImage.className === 'effects__preview--sepia') {
      effectImage.style.filter = 'sepia(' + percent / 100 + ')';
    } else if (effectImage.className === 'effects__preview--marvin') {
      effectImage.style.filter = 'invert(' + percent + '%)';
    } else if (effectImage.className === 'effects__preview--phobos') {
      effectImage.style.filter = 'blur(' + percent / 33.3 + 'px)';
    } else if (effectImage.className === 'effects__preview--heat') {
      effectImage.style.filter = 'brightness(' + (1 + (percent / 50)) + ')';
    }
  }

  // Расчитывает и устанавливает положение ползунка при клике.
  // @param {object} evt - Объект event.
  function setSliderPosition(evt) {
    if (evt.target.className === 'effect-level__line' || evt.target.className === 'effect-level__depth') {
      var sliderWidth = effectLine.clientWidth;
      var percentSliderWidth = sliderWidth / 100;
      var pinPositionInPercent = evt.offsetX / percentSliderWidth;

      effectHandle.style.left = pinPositionInPercent + '%';
      effectLineDepth.style.width = pinPositionInPercent + '%';
      effectLevel.value = Math.round(pinPositionInPercent);

      setEffectValue(effectLevel.value, currentEffect);
    }
  }

  // Устанавливает положение ползунка и соответствующую глубину эффекта.
  effectLine.addEventListener('click', setSliderPosition);
})();
