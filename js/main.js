"use strict";

const MAX_ENEMY = 7;
const HEIGT_ELEM = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  btns = document.querySelectorAll('.btn');


let startSpeed = 0;
/*
// вариант 1 для аудио
  const music = document.createElement('embed');
  music.src = './audio/music.mp3';
  music.classList.add('visually-hidden');
*/

// вариант 2 для аудио
const music = new Audio('./audio/music.mp3');

car.classList.add('car');
gameArea.classList.add('hide');
score.classList.add('hide');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3
};

function getQuantityElements(heightElement) {
  return (gameArea.offsetHeight / heightElement) + 1;
}

function getRandomEnemy(max) {
  return Math.floor((Math.random() * max) + 1);
}

function changeLevel(lvl) {
  switch (lvl) {
    case '1':
      setting.traffic = 4;
      setting.speed = 3;
      break;
    case '2':
      setting.traffic = 3;
      setting.speed = 6;
      break;
    case '3':
      setting.traffic = 3;
      setting.speed = 8;
      break;
  }
  startSpeed = setting.speed;
}

function startGame(event) {
  //document.body.append(music);

  const target = event.target;

  if (!target.classList.contains('btn')) {
    return;
  }

  const levelGame = target.dataset.levelGame;
  changeLevel(levelGame);

  btns.forEach(btn => {
    btn.disabled = true;
  });

  music.volume = 0.05;
  music.play();
  //start.classList.add('hide');
  gameArea.classList.remove('hide');
  score.classList.remove('hide');
  gameArea.innerHTML = '';
  gameArea.style.minHeight = `${Math.floor((document.documentElement.clientHeight - HEIGT_ELEM) / HEIGT_ELEM) * HEIGT_ELEM}px`;

  for (let i = 0; i < getQuantityElements(HEIGT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * HEIGT_ELEM}px`;
    line.style.height = `${HEIGT_ELEM / 2}px`;
    line.y = i * HEIGT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    enemy.style.top = `${enemy.y}px`;
    enemy.style.background = `
        transparent 
        url(./img/enemy${getRandomEnemy(MAX_ENEMY)}.png) 
        center / cover 
        no-repeat`;
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  car.style.left = `${gameArea.offsetWidth / 2 - car.offsetWidth / 2}px`;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = `SCORE: ${setting.score}`;
    //start.style.top = `${score.offsetHeight}px`;

    setting.speed = startSpeed + Math.floor(setting.score / 5000);

    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = `${setting.x}px`;
    car.style.top = `${setting.y}px`;

    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');

  lines.forEach((item) => {
    item.y += setting.speed;
    item.style.top = `${item.y}px`;

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGT_ELEM;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach((item) => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
      setting.start = false;
      //music.remove();
      music.pause();
      console.warn('ДТП');
      //start.classList.remove('hide');
      //start.style.top = `${score.offsetHeight}px`;
      btns.forEach(btn => {
        btn.disabled = false;
      });
    }

    item.y += setting.speed / 2;
    item.style.top = `${item.y}px`;

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGT_ELEM * setting.traffic;
      item.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    }
  });
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);