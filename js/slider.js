'use strict';

(function () {
  var currentEffect = document.querySelector('.img-upload__preview img');
  var effect = document.querySelector('.effect-level');
  var effectHandle = effect.querySelector('.effect-level__pin');
  var effectLine = effect.querySelector('.effect-level__line');
  var effectLineDepth = effect.querySelector('.effect-level__depth');
  var effectLevel = effect.querySelector('.effect-level__value');
  var isDraggable = false;
  var cursorStartX;
  var pinStartX;

  // Убирает у элемента стандартный drug-n-drop.
  effectHandle.ondragstart = function () {
    return false;
  };

  // Добавляет обработчик drug-n-drop.
  effectHandle.addEventListener('mousedown', function (evt) {
    isDraggable = true;

    cursorStartX = evt.clientX;
    pinStartX = evt.target.offsetLeft;

    document.addEventListener('mousemove', onPinMove);
    document.addEventListener('mouseup', function () {
      isDraggable = false;
      document.removeEventListener('mousemove', onPinMove);
    });
  });

  // Расчитывает и устанавливает положение ползунка при drug-n-drop.
  // @param {object} moveEvt - Объект event.
  function onPinMove(moveEvt) {
    var sliderWidth = effectLine.clientWidth;
    var percentSliderWidth = sliderWidth / 100;
    var minValuePinX = 0;
    var maxValuePinX = 100;

    if (moveEvt.buttons === 1 && isDraggable) {
      var cursorShiftX = moveEvt.clientX - cursorStartX;
      var pinShiftX = pinStartX + cursorShiftX;
      var pinShiftPercentX = pinShiftX / percentSliderWidth;

      if (pinShiftPercentX > maxValuePinX) {
        pinShiftPercentX = 100;
      } else if (pinShiftPercentX < minValuePinX) {
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
  function onSliderClick(evt) {
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
  effectLine.addEventListener('click', onSliderClick);
})();
