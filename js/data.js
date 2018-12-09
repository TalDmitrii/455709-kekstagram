'use strict';

(function () {
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

  window.data = {
    arrayPhotos: getArrayObjects(25),
    getRandomInRange: getRandomInRange
  };
})();
