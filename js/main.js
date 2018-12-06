'use strict';

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var description = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var arrayPhotos = getArrayObjects(25);
var commentCount = document.querySelector('.social__comment-count');
commentCount.classList.add('visually-hidden');
var commentsLoader = document.querySelector('.comments-loader');
commentsLoader.classList.add('visually-hidden');
var bigPicture = document.querySelector('.big-picture');
var bigPictureImage = bigPicture.querySelector('.big-picture__img img');
var ESC_CODE = 27;
var closeButton = bigPicture.querySelector('.big-picture__cancel');
var blockPictures = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var uploadFile = blockPictures.querySelector('#upload-file');
var uploadForm = blockPictures.querySelector('.img-upload__overlay');
var buttonUploadFormClose = blockPictures.querySelector('.img-upload__cancel');
var effectsList = blockPictures.querySelector('.effects__list');
var currentEffect = document.querySelector('.img-upload__preview img');
var textHashtag = blockPictures.querySelector('.text__hashtags');
var commentsList = document.querySelector('.social__comments');


// Возвращает случайное число в интервале от min до max.
// @param {number} min - Минимальное значение.
// @param {number} max - Максимальное значение.
// @returns {number} - Случайное число.
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создаёт комментарий, из одного или двух случайных предложений.
// @param {array} arrayComments - Массив строк.
// @returns {string} comment - Комментарий.
function getComment(arrayComments) {
  var comment = '';
  var randomValue = Math.round(Math.random() + 1);

  for (var i = 0, space = ' '; i < randomValue; i++) {
    if (space === i) {
      space = '';
    }
    comment += getRandomElementFromArray(arrayComments) + space;
  }

  return comment;
}

// Создаёт случайное количество комментариев к одному объекту в виде массива строк.
// @param {array} arrayComments - Массив строк.
// @returns {array} assistArray - Комментарий, в виде массива строк.
function getArrayComments(arrayComments) {
  var countComments = getRandomInRange(1, 10);
  var assistArray = [];

  for (var i = 0; i < countComments; i++) {
    assistArray.push(getComment(arrayComments));
  }

  return assistArray;
}

// Возвращает случайный элемент массива.
// @param {array} array - Массив строк.
// @returns {array[i]} - Случайный элемент массива.
function getRandomElementFromArray(array) {
  return array[getRandomInRange(0, array.length - 1)];
}

// Создаёт массив объектов.
// @param {number} count - Количество объектов.
// @returns {array} - Массив объектов, изображений-миниатюр, с адресами изображений, количеством лайков, описанием.
function getArrayObjects(count) {
  for (var i = 0, array = []; i < count; i++) {
    array[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomInRange(15, 200),
      comments: getArrayComments(comments),
      description: getRandomElementFromArray(description)
    };
  }

  return array;
}

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

renderPicturesList(arrayPhotos, blockPictures);

// Удаляет элементы списка.
// @param {object} list - Список подвергающийся очистке.
function clearList(list) {
  var customComments = list.querySelectorAll('li');

  for (var i = 0; i < customComments.length; i++) {
    list.removeChild(customComments[i]);
  }
}

// Создаёт комментарий к увеличенному изображению.
// Комментарий является элементом списка, теги 'img' и 'p' будут в нём содержаться.
// @param {object} someObject - На основе свойства 'comment' этого объекта создаются комментарии.
// @param {object} listToThisComment - В этот список добавляются комментарии.

function renderComment(someObject, listToPushComment) {
  var countComments = 5;

  clearList(listToPushComment);

  for (var i = 0; i < someObject.comments.length; i++) {
    var comment = document.createElement('li');
    var avatarUser = document.createElement('img');
    var textComment = document.createElement('p');

    // Определяет свойства объекта(комментария), добавляет классы тегам.
    comment.classList.add('social__comment');
    avatarUser.classList.add('social__picture');
    avatarUser.src = 'img/avatar-' + getRandomInRange(1, 6) + '.svg';
    avatarUser.alt = 'Аватар комментатора фотографии';
    avatarUser.width = 35;
    avatarUser.height = 35;
    textComment.classList.add('social__text');
    textComment.textContent = someObject.comments[i];
    comment.appendChild(avatarUser);
    comment.appendChild(textComment);
    listToPushComment.appendChild(comment);

    if (i > countComments - 1) {
      comment.classList.add('visually-hidden');
    }
  }
}

// Комментарии к увеличенному изображению.
renderComment(arrayPhotos[0], commentsList);

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
  }
}

// Добавляется обработчик переключения фильтра.
effectsList.addEventListener('click', useFilter);

// Проверяет наличие в массиве одинаковых элементов.
// @param {array} valuesArray - Проверяемый массив.
// @returns {bool}.
function sortArray(valuesArray) {
  var x = false;

  for (var i = 0; i < valuesArray.length; i++) {
    for (var j = i + 1; j < valuesArray.length; j++) {
      if (valuesArray[i].toLowerCase() === valuesArray[j].toLowerCase()) {
        x = true;
      }
    }
  }

  return x;
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

// При снятии фокуса с элемента 'textHashtag' добавляет обработчик закрытия формы по ESC.
textHashtag.addEventListener('blur', function () {
  document.addEventListener('keydown', escCloseUploadForm);
});
