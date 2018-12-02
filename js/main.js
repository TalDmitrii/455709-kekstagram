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
var ESC_CODE = 27;

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

  for (var i = 0, space = ' '; i < Math.round(Math.random() + 1); i++) {
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

// Подготовка к созданию изображений на основе шаблона, с их последующей вставкой в блок 'pictures'.
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

renderPicturesList(arrayPhotos, blockPictures);

// Создаёт комментарий к увеличенному изображению.
// Комментарий является элементом списка, теги 'img' и 'p' будут в нём содержаться.
// @param {object} someObject - На основе свойства 'comment' этого объекта создаются комментарии.
// @param {object} listToThisComment - В этот список добавляются комментарии.
function renderComment(someObject, listToThisComment) {
  // Переменная для вывода не более пяти комментариев.
  var openPhotoCountComments = 2;

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
    listToThisComment.appendChild(comment);

    if (i > openPhotoCountComments) {
      comment.classList.add('visually-hidden');
    }
  }
}

// Создаёт описание для большой фотографии, и другую информацию для неё.
// @param {object} element - На основе свойств этого объекта создаётся большое изображение, комментарии, количество лайков фотографии.
function renderBigPicture(element) {
  var likes = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');
  var commentsList = document.querySelector('.social__comments');
  var descriptionPhoto = document.querySelector('.social__caption');

  // Переопределяет свойства объекта(фотографии), на основе свойств аргумента функции.
  likes.textContent = element.likes;
  commentsCount.textContent = element.comments.length;
  descriptionPhoto.textContent = element.description;

  renderComment(element, commentsList);
}

// Добавляет обработчик события на мини-фотографию, по клику открывает полноразмерное изображение, создаёт соответствующие комментарии, кол-во лайков и другие параметры.
function addPhotoEventListener(minPhoto, urlFromFolder, objectPhoto) {
  minPhoto.addEventListener('click', function () {
    bigPicture.querySelector('.big-picture__img img').src = urlFromFolder;
    bigPicture.classList.remove('hidden');
    renderBigPicture(objectPhoto);
  });
}

var photosPreview = blockPictures.querySelectorAll('a');

for (var i = 0; i < photosPreview.length; i++) {
  addPhotoEventListener(photosPreview[i], 'photos/' + (i + 1) + '.jpg', arrayPhotos[i]);
}

// Закрывает полноразмерное изображение по клику.
var closeButton = bigPicture.querySelector('.big-picture__cancel');
closeButton.addEventListener('click', function () {
  bigPicture.classList.add('hidden');
});

// Закрывает полноразмерное изображение по клавише ESC.
window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_CODE) {
    bigPicture.classList.add('hidden');
  }
});

// Открывает форму загрузки изображения при наступлении события 'change' .
var uploadFile = blockPictures.querySelector('#upload-file');
var uploadForm = blockPictures.querySelector('.img-upload__overlay');
var uploadFormClose = blockPictures.querySelector('.img-upload__cancel');

uploadFile.addEventListener('change', function () {
  uploadForm.classList.remove('hidden');

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_CODE) {
      uploadForm.classList.add('hidden');
    }
  });
});

// Удаляет значение 'input'.
uploadFile.addEventListener('click', function () {
  uploadFile.value = '';
});

// Закрывает форму загрузки фотографии.
uploadFormClose.addEventListener('click', function () {
  uploadForm.classList.add('hidden');
});

var effectsList = blockPictures.querySelector('.effects__list');
var effects = effectsList.querySelectorAll('.effects__label');
var currentEffect = document.querySelector('.img-upload__preview img');

// Удаляет классы фильтра, и добавляет новые.
function addPhotoEffect(effect) {
  effect.addEventListener('click', function (evt) {
    currentEffect.className = '';
    currentEffect.classList.add(evt.target.classList[1]);
  });
}

for (var j = 0; j < effects.length; j++) {
  addPhotoEffect(effects[j]);
}
