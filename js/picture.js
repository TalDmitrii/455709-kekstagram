'use strict';

(function () {
  var blockPictures = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

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
  function renderPicturesList(arrayPicture, block) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arrayPicture.length; i++) {
      fragment.appendChild(renderPicture(arrayPicture[i]));
    }

    block.appendChild(fragment);
  }

  renderPicturesList(window.data.arrayPhotos, blockPictures);
})();
