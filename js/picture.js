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

// Возвращает случайное число в интервале от min до max.
// @param {int} min - Минимальное значение.
// @param {int} max - Максимальное значение.
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создаёт массив значений от min до max.
// @param {int} min - Минимальное значение.
// @param {int} max - Максимальное значение.
function getArrayFromRange(min, max) {
  for (var i = min, arrayValue = []; i <= max; i++) {
    arrayValue.push(i);
  }

  return arrayValue;
}

// Возвращает уникальное число из массива чисел.
// @param {array} arrayNumbers - Массив чисел.
function getUniqueValue(arrayNumbers) {
  if (arrayNumbers.length > 0) {
    var randomIndex = getRandomInRange(0, arrayNumbers.length - 1);
    var randomValue = arrayNumbers[randomIndex];
    arrayNumbers.splice(randomIndex, 1);

    return randomValue;
  } else {
    return 'Массив значений пуст.';
  }
}

// Создаёт комментарий, из одного или двух случайных предложений.
// @param {array} arrayComments - Массив строк.
function getComment(arrayComments) {
  var arrayStroke = [];
  var comment = '';
  var part = 1;
  var toggle = Math.random();

  if (toggle > 0.5) {
    part = 2;
  }

  for (var i = 0; i < part; i++) {
    arrayStroke[i] = getRandomElementFromArray(arrayComments);
  }

  if (arrayStroke.length > 1) {
    comment = arrayStroke.join(' ');
  } else {
    comment = arrayStroke;
  }

  return comment;
}

// Создаёт случайное количество комментариев к одному объекту в виде массива строк.
// @param {array} arrayComments - Массив строк.
function getArrayComment(arrayComments) {
  var countComments = getRandomInRange(1, 10);
  var assistArray = [];

  for (var i = 0; i < countComments; i++) {
    assistArray.push(getComment(arrayComments));
  }

  return assistArray;
}

// Возвращает случайный элемент массива.
// @param {array} array - Массив строк.
function getRandomElementFromArray(array) {
  return array[getRandomInRange(0, array.length - 1)];
}

// Создаёт массив объектов.
// @param {int} count - Количество объектов.
function getArrayObjects(count) {
  var array = [];
  array.length = count;

  // Создаёт массив изображений с номерами от 1 до 25.
  var imageArray = getArrayFromRange(1, 25);

  for (var i = 0; i < array.length; i++) {
    array[i] = {
      url: 'photos/' + getUniqueValue(imageArray) + '.jpg',
      likes: getRandomInRange(15, 200),
      comments: getArrayComment(comments),
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
function renderPicture(picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
}

// Создаёт множество изображений, и импортирует их в 'blockPictures'.
// @param {array} arrayPicture - Массив объектов.
function renderPictureList(arrayPicture) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrayPicture.length; i++) {
    fragment.appendChild(renderPicture(arrayPicture[i]));
  }

  blockPictures.appendChild(fragment);
}

renderPictureList(arrayPhotos);

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

// Создаёт увеличенное изображение.
// @param {object} element - На основе свойств этого объекта создаются большое изображение, комментарии, количество лайков фотографии.
function renderBigPicture(element) {
  var bigPicture = document.querySelector('.big-picture');
  var likes = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');
  var commentsList = document.querySelector('.social__comments');
  var descriptionPhoto = document.querySelector('.social__caption');

  // Делает большое изображение открытым для пользователя.
  bigPicture.classList.remove('hidden');

  // Переопределяет свойства объекта(фотографии), на основе свойств аргумента функции.
  bigPicture.querySelector('.big-picture__img')
            .querySelector('img').src = element.url;
  likes.textContent = element.likes;
  commentsCount.textContent = element.comments.length;
  descriptionPhoto.textContent = element.description;

  renderComment(element, commentsList);
}

renderBigPicture(arrayPhotos[0]);
