'use strict';

let currentLevel = 1,
    duelTime = 1000,
    canDuel = false,
    timer,
    isMovingLeft = true,
    gameScore = 0,
    remainingLives = 3,
    livesContainer = document.querySelector('.lives'),
    startBtn = document.querySelector('.button-start-game'),
    restartBtn = document.querySelector('.button-restart'),
    nextLevelBtn = document.querySelector('.button-next-level'),
    gameMenuElement = document.querySelector('.game-menu'),
    gameWrapper = document.querySelector('.wrapper'),
    panelsElement = document.querySelector('.game-panels'),
    screenElement = document.querySelector('.game-screen'),
    winScreenElement = document.querySelector('.win-screen'),
    gunmanElement = document.querySelector('.gunman'),
    yourTimeElement = document.querySelector('.time-panel__you'),
    gunmanTimeElement = document.querySelector('.time-panel__gunman'),
    levelDisplay = document.querySelector('.score-panel__level'),
    gameMessage = document.querySelector('.message');

let introAudio = new Audio('sfx/js_labs_lab-7_help-files_sfx_intro.m4a'),
    waitingAudio = new Audio('sfx/js_labs_lab-7_help-files_sfx_wait.m4a'),
    shotAudio = new Audio('sfx/js_labs_lab-7_help-files_sfx_shot.m4a'),
    winAudio = new Audio('sfx/js_labs_lab-7_help-files_sfx_win.m4a'),
    fireAudio = new Audio('sfx/js_labs_lab-7_help-files_sfx_fire.m4a'),
    deathAudio = new Audio('sfx/js_labs_lab-7_help-files_sfx_death(1).m4a');

function initializeGame() {
    isMovingLeft = Math.random() < 0.5;
    gameMenuElement.style.display = 'none';
    panelsElement.style.display = 'block';
    screenElement.style.display = 'block';
    gameWrapper.style.display = 'block';

    livesContainer.innerHTML = "";
    for (let i = 0; i < remainingLives; i++) {
        livesContainer.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" height="50px"' +
            ' viewBox="0 -960 960 960" width="50px" fill="red">' +
            '<path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>' +
            '</svg>';
    }

    gunmanElement.classList.toggle('gunman--left', isMovingLeft);
    gunmanElement.classList.toggle('gunman--right', !isMovingLeft);

    gunmanTimeElement.innerHTML = (duelTime / 1000).toFixed(2);
    yourTimeElement.innerHTML = (0).toFixed(2);
    gameScore = +document.querySelector('.score-panel__score_num').innerHTML;
    levelDisplay.innerHTML = 'level: ' + currentLevel;
    gunmanElement.classList.add('gunman-level-' + currentLevel);

    gunmanElement.addEventListener('transitionend', prepareForDuel);
    setTimeout(() => {
        startGunmanMovement();
    }, 400);
}

function restartGame() {
    deathAudio.pause();
    restartBtn.style.display = 'none';
    gameMessage.innerHTML = '';
    screenElement.classList.remove("game-screen--death");
    gameMessage.classList.remove("message--dead");
    gunmanElement.classList.remove(`gunman-level-${currentLevel}`);
    gunmanElement.classList.remove(`gunman-level-${currentLevel}__ready`);
    gunmanElement.classList.remove(`gunman-level-${currentLevel}__shooting`);
    gunmanElement.classList.remove(`gunman-level-${currentLevel}__standing`);
    gunmanElement.classList.remove('gunman--left', 'gunman--right');

    if (remainingLives > 1) {
        remainingLives--;
    } else {
        gameScore = 0;
        document.querySelector('.score-panel__score_num').innerHTML = 0;
        currentLevel = 1;
        duelTime = 1000;
        remainingLives = 3;
    }
    setTimeout(function () {
        initializeGame();
    }, 1000);
}

function nextLevel() {
    if (currentLevel < 5) {
        nextLevelBtn.style.display = 'none';
        gameMessage.innerHTML = '';
        gameMessage.classList.remove('message--win');
        gunmanElement.classList.remove(`gunman-level-${currentLevel}`);
        gunmanElement.classList.remove(`gunman-level-${currentLevel}__standing`);
        gunmanElement.classList.remove(`gunman-level-${currentLevel}__death`);
        gunmanElement.classList.remove('gunman--left', 'gunman--right');
        currentLevel++;
        switch (currentLevel) {
            case 1:
                duelTime = 1000;
                break;
            case 2:
                duelTime = 700;
                break;
            case 3:
                duelTime = 500;
                break;
            case 4:
                duelTime = 250;
                break;
            case 5:
                duelTime = 100;
                break;
            default:
                duelTime = 1000;
        }
        initializeGame();
    } else {
        screenElement.style.display = 'none';
        panelsElement.style.display = 'none';
        gameMessage.style.display = 'none';

        let scoreValue = +document.querySelector('.score-panel__score_num').innerHTML;
        winScreenElement.innerHTML = `<h2 class="win-screen__title">You have won the game with score: ${scoreValue}</h2>`
        winScreenElement.style.display = 'block';
    }
}

function startGunmanMovement() {
    setTimeout(() => {
        introAudio.play();
        introAudio.loop = true;
        gunmanElement.classList.add("moving");
    }, 100);
}

function prepareForDuel() {
    introAudio.pause();
    waitingAudio.play();
    waitingAudio.currentTime = 0;
    waitingAudio.loop = true;
    gunmanElement.classList.remove("moving");
    gunmanElement.classList.add(`gunman-level-${currentLevel}__standing`);
    gunmanElement.classList.add("standing");
    setTimeout(() => {
        waitingAudio.pause();
        gunmanElement.classList.add(`gunman-level-${currentLevel}__ready`);
        gameMessage.classList.add('message--fire');
        fireAudio.play();
        gunmanElement.addEventListener('mousedown', playerShootsGunman);
        canDuel = true;
        startTimeCounter(new Date().getTime());
        setTimeout(gunmanShootsPlayer, duelTime);
    }, 1000);
}

function startTimeCounter(t) {
    let currentTime;
    (function trackTime() {
        currentTime = new Date().getTime();
        if (canDuel) {
            timer = ((currentTime - t + 10) / 1000).toFixed(2);
            yourTimeElement.innerHTML = timer;
            setTimeout(trackTime, 10);
        }
    })();
}

function gunmanShootsPlayer() {
    if (canDuel) {
        gunmanElement.classList.remove('standing');
        gunmanElement.classList.add('gunman-level-' + currentLevel + '__shooting');
        setTimeout(function () {
            shotAudio.play();
            gameMessage.classList.remove('message--fire');
            screenElement.classList.add('game-screen--death');
            gameMessage.classList.add('message--dead');
            gameMessage.innerHTML = 'You are dead!';
        }, duelTime);
        gunmanElement.removeEventListener('mousedown', playerShootsGunman);
        setTimeout(function () {
            deathAudio.play();
            restartBtn.style.display = 'block';
        }, 1000);
        canDuel = false;
    }
}

function playerShootsGunman() {
    if (canDuel) {
        shotAudio.play();
        gameMessage.classList.remove('message--fire');
        gunmanElement.classList.remove('standing');
        gunmanElement.classList.remove('gunman-level-' + currentLevel + '__shooting');
        gunmanElement.classList.add('gunman-level-' + currentLevel + '__death');
        gunmanElement.removeEventListener('mousedown', playerShootsGunman);
        winAudio.play();
        gunmanElement.classList.remove('gunman--left', 'gunman--right');
        setTimeout(() => {
            gameMessage.classList.add('message--win');
            gameMessage.innerHTML = 'You Win!';
            updateScore();
            nextLevelBtn.style.display = 'block';
        }, 1000);
        canDuel = false;
    }
}

function updateScore() {
    let scoreDiv = document.querySelector('.score-panel__score_num');
    let scoreValue = +((duelTime - parseInt(yourTimeElement.innerHTML)) * currentLevel * currentLevel).toFixed(0);
    let incrementScore  = () => {
        if (+scoreDiv.innerHTML - gameScore < scoreValue) {
            scoreDiv.innerHTML = +scoreDiv.innerHTML + 100;
            setTimeout(incrementScore, 10);
        }
    }
    incrementScore();
}

startBtn.addEventListener('click', initializeGame);
restartBtn.addEventListener('click', restartGame);
nextLevelBtn.addEventListener('click', nextLevel);