'use strict';

(function () {
  var blockPictures = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var imgFilter = document.querySelector('.img-filters');

  // Показывает блок фильтрации фотографий.
  // Обрабатывает переключение фильтра.
  function filterImg(arrayPicture) {
    // После загрузки изображений открывает блок фильтрации.
    imgFilter.classList.remove('img-filters--inactive');

    imgFilter.addEventListener('click', function (evt) {
      var target = evt.target;
      var currentFilter = imgFilter.querySelector('.img-filters__button--active');
      var pictures = document.querySelectorAll('.picture');

      // Если у элемента на котором произошел 'клик' отсутствует класс 'active',
      // то у предыдущей цели убирает класс 'active', и добавляет его текущей цели.
      // Удаляет ранее отрисованные изображения
      if (target.classList[1] === undefined) {
        currentFilter.classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        deleteElems(pictures);

        // Обрабатывает отрисовку изображений в зависимости от 'id' элемента,
        // на котором произошел 'клик'.
        switch (target.id) {
          case ('filter-popular'):
            renderPicturesList(arrayPicture);
            break;
          case ('filter-new'):
            renderPicturesList(filterNew(arrayPicture));
            break;
          case ('filter-discussed'):
            renderPicturesList(filterCountComments(arrayPicture));
            break;
        }
      }
    });
  }

  // Удаляет элементы из родительского блока.
  // @param {array} elem - Массив элементов.
  function deleteElems(arrayElem) {
    arrayElem.forEach(function (elem) {
      elem.parentNode.removeChild(elem);
    });
  }

  // Фильтрует исходный массив так, чтобы в исходном массиве были только уникальные елементы.
  // @param {array} arrayPicture - Исходный массив элементов.
  // @returns {array} filterNewArray - Массив с отфильтрованными элементами.
  function filterNew(arrayPicture) {
    // Количество новых фотографий равно 10, цикл идёт пока длина нового массива с отфильтрованными фотографиями
    // не достигнет 10.
    for (var i = 0, countNewPhoto = 10, filterNewArray = []; filterNewArray.length < countNewPhoto; i++) {
      // Генерирует случайное изображение из исходного массива.
      var newRandomPicture = arrayPicture[getRandomInRange(0, arrayPicture.length - 1)];
      var iSsimilarPicture = false;

      // Если новый массив с отфильтрованными фотографиями пустой, добавляет ему первый элемент.
      if (filterNewArray.length === 0) {
        filterNewArray[0] = newRandomPicture;
      } else {
        // Если новый массив с отфильтрованными фотографиями не пустой, проверяет есть ли в нём элемент,
        // идентичный вновь сгенерированному случайному элементу.
        filterNewArray.forEach(function (item) {
          // Если массив содержит элемент, идентичный вновь сгенерированному случайному элементу,
          // то возвращает 'true'.
          if (item.url === newRandomPicture.url) {
            iSsimilarPicture = true;
          }
        });

        // Если идентичных элементов нет, добавляет сгенерированный случайный элемент в массив
        // с отфильтрованными фотографиями.
        if (!iSsimilarPicture) {
          filterNewArray.push(newRandomPicture);
        }
      }
    }

    return filterNewArray;
  }

  // Фильтрует изображения исходного массива по убыванию количества комментариев к изображению.
  // @param {array} arrayPicture - Исходный массив элементов.
  // @returns {array} arrayPictureCopy - Массив с отфильтрованными элементами.
  function filterCountComments(arrayPicture) {
    // Копируем исходный массив.
    var arrayPictureCopy = arrayPicture.slice();

    arrayPictureCopy.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });

    return arrayPictureCopy;
  }

  // Возвращает случайное число в интервале от min до max.
  // @param {number} min - Минимальное значение.
  // @param {number} max - Максимальное значение.
  // @returns {number} - Случайное число.
  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.backend.load(renderPicturesList);

  // Создаёт изображение.
  // @param {object} picture - На основе свойств этого объекта создаётся изображение.
  // @returns {pictureElement} - Создаёт изображение на основе шаблона.
  function renderPicture(picture) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  }

  // Создаёт множество изображений, и импортирует их в 'blockPictures'.
  // @param {array} arrayPicture - Массив объектов.
  function renderPicturesList(arrayPicture) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arrayPicture.length; i++) {
      fragment.appendChild(renderPicture(arrayPicture[i]));
    }

    blockPictures.appendChild(fragment);

    filterImg(arrayPicture);
  }
})();
