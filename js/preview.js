'use strict';

(function () {
  var ESC_CODE = 27;
  var bigPicture = document.querySelector('.big-picture');
  var blockPictures = document.querySelector('.pictures');
  var commentCount = document.querySelector('.social__comment-count');
  commentCount.classList.add('visually-hidden');
  var commentsLoader = document.querySelector('.comments-loader');
  commentsLoader.classList.add('visually-hidden');
  var bigPictureSocial = document.querySelector('.big-picture__social');
  var blockComments = bigPictureSocial.querySelector('.social__comments');
  var closeButton = bigPicture.querySelector('.big-picture__cancel');
  var bigPictureImage = bigPicture.querySelector('.big-picture__img img');
  var pictureElems = blockComments.querySelectorAll('li');

  // Создаёт комментарий к увеличенному изображению.
  // Комментарий является элементом списка, теги 'img' и 'p' будут в нём содержаться.
  // @param {object} someObject - На основе свойства 'comment' этого объекта создаются комментарии.
  // @param {object} listToThisComment - В этот список добавляются комментарии.
  function renderComment(elem, blockToComments) {
    var comment = document.createElement('li');
    var avatarUser = document.createElement('img');
    var textComment = document.createElement('p');

    // Определяет свойства объекта(комментария), добавляет классы тегам.
    comment.classList.add('social__comment');
    avatarUser.classList.add('social__picture');
    avatarUser.src = elem.avatar;
    avatarUser.alt = 'Аватар комментатора фотографии';
    avatarUser.width = 35;
    avatarUser.height = 35;
    textComment.classList.add('social__text');
    textComment.textContent = elem.message;
    comment.appendChild(avatarUser);
    comment.appendChild(textComment);
    blockToComments.appendChild(comment);
  }

  // Создаёт описание для большой фотографии, и другую информацию для неё.
  // @param {object} element - На основе свойств этого объекта создаётся большое изображение, комментарии, количество лайков фотографии.
  function renderBigPictureValues(element) {
    var bigPictureLikes = bigPictureSocial.querySelector('.likes-count');
    var bigPictureCountComments = bigPictureSocial.querySelector('.comments-count');
    var bigPictureDescription = bigPictureSocial.querySelector('.social__caption');

    // Переопределяет свойства объекта(фотографии), на основе свойств аргумента функции.
    bigPictureLikes.textContent = element.children[1].children[1].textContent;
    bigPictureCountComments.textContent = element.children[1].children[0].textContent;
    bigPictureDescription.textContent = element.children[2].textContent;
  }

  // Открывает полноразмерное изображение.
  function openBigPicture(evt) {
    var target = evt.target;
    var parentTarget = evt.target.parentNode;
    var currentComment = parentTarget.children[3].children[0].cloneNode(true);

    if (target.tagName === 'IMG') {
      // Присваивает новый адрес для увеличенного изображения.
      bigPictureImage.src = evt.target.attributes.src.nodeValue;

      // Отображает новые значения для увеличенного изображения.(Количество комментариев, лайков)
      renderBigPictureValues(parentTarget);

      // Удаляет старые комментарии.
      window.picture.deleteElems(pictureElems);

      // Отображает новые комментарии для увеличенного изображения.
      blockComments.appendChild(currentComment);

      bigPicture.classList.remove('hidden');
    }
  }

  // Добавляется обработчик, открывающий полноразмерное изображение.
  blockPictures.addEventListener('click', openBigPicture);

  // Закрывает полноразмерное изображение.
  function closeFullSizePhoto() {
    bigPicture.classList.add('hidden');
  }

  // Закрывает полноразмерное изображение по клику.
  closeButton.addEventListener('click', closeFullSizePhoto);

  // Закрывает полноразмерное изображение по клавише ESC.
  window.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_CODE) {
      closeFullSizePhoto();
    }
  });

  window.preview = {
    openBigPicture: openBigPicture,
    renderComment: renderComment
  };
})();
