'use strict';

(function () {
  var ESC_CODE = 27;
  var bigPicture = document.querySelector('.big-picture');
  var blockPictures = document.querySelector('.pictures');
  var commentCount = document.querySelector('.social__comment-count');
  commentCount.classList.add('visually-hidden');
  var commentsLoader = document.querySelector('.comments-loader');
  commentsLoader.classList.add('visually-hidden');
  var commentsList = document.querySelector('.social__comments');
  var closeButton = bigPicture.querySelector('.big-picture__cancel');
  var bigPictureImage = bigPicture.querySelector('.big-picture__img img');

  window.backend.load(renderComment);

  // Удаляет элементы списка.
  // @param {object} list - Список подвергающийся очистке.
  function clearList(list) {
    var listItems = list.querySelectorAll('li');

    for (var i = 0; i < listItems.length; i++) {
      list.removeChild(listItems[i]);
    }
  }

  // Создаёт комментарий к увеличенному изображению.
  // Комментарий является элементом списка, теги 'img' и 'p' будут в нём содержаться.
  // @param {object} someObject - На основе свойства 'comment' этого объекта создаются комментарии.
  // @param {object} listToThisComment - В этот список добавляются комментарии.
  function renderComment(someObject) {
    var countComments = 5;

    clearList(commentsList);

    for (var i = 0; i < someObject[0].comments.length; i++) {
      var comment = document.createElement('li');
      var avatarUser = document.createElement('img');
      var textComment = document.createElement('p');

      // Определяет свойства объекта(комментария), добавляет классы тегам.
      comment.classList.add('social__comment');
      avatarUser.classList.add('social__picture');
      avatarUser.src = someObject[0].comments[i].avatar;
      avatarUser.alt = 'Аватар комментатора фотографии';
      avatarUser.width = 35;
      avatarUser.height = 35;
      textComment.classList.add('social__text');
      textComment.textContent = someObject[0].comments[i].message;
      comment.appendChild(avatarUser);
      comment.appendChild(textComment);
      commentsList.appendChild(comment);

      if (i > countComments - 1) {
        comment.classList.add('visually-hidden');
      }
    }
  }

  // Создаёт описание для большой фотографии, и другую информацию для неё.
  // @param {object} element - На основе свойств этого объекта создаётся большое изображение, комментарии, количество лайков фотографии.
  function renderBigPictureValues(element) {
    var bigPictureSocial = document.querySelector('.big-picture__social');
    var bigPictureLikes = bigPictureSocial.querySelector('.likes-count');
    var bigPictureCountComments = bigPictureSocial.querySelector('.comments-count');

    // Переопределяет свойства объекта(фотографии), на основе свойств аргумента функции.
    bigPictureLikes.textContent = element.children[1].children[1].textContent;
    bigPictureCountComments.textContent = element.children[1].children[0].textContent;
  }

  // Открывает полноразмерное изображение.
  function openBigPicture(evt) {
    var target = evt.target;
    var parentTarget = evt.target.parentNode;

    if (target.tagName === 'IMG') {
      bigPictureImage.src = evt.target.attributes.src.nodeValue;
      renderBigPictureValues(parentTarget);
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
    openBigPicture: openBigPicture
  };
})();
