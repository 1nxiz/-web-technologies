const CARD_THEMES = [
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥭', '🍆', '🥑', '🌽', '🥕', '🧀', '🍄', '🌰'
];

const state = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: null,
    timeRemaining: 0,
    isGameOver: false,
    currentPlayerIndex: 0,
    players: [
        { name: 'Гравець 1', score: 0, moves: 0, time: 0 },
        { name: 'Гравець 2', score: 0, moves: 0, time: 0 }
    ],
    playerMode: 'single',
    currentRound: 1,
    totalRounds: 1,
    roundStats: [],
    difficulty: 'easy',
    gridSize: '4x4'
};

const elements = {
    settings: document.getElementById('settings'),
    gameBoard: document.getElementById('gameBoard'),
    gameInfo: document.getElementById('gameInfo'),
    gameResults: document.getElementById('gameResults'),
    timer: document.getElementById('timer'),
    moves: document.getElementById('moves'),
    currentPlayer: document.getElementById('currentPlayer'),
    winner: document.getElementById('winner'),
    roundStats: document.getElementById('roundStats'),
    player1Name: document.getElementById('player1Name'),
    player2Name: document.getElementById('player2Name'),
    player2Container: document.getElementById('player2-container'),
    playerModeRadios: document.querySelectorAll('input[name="playerMode"]'),
    difficultyRadios: document.querySelectorAll('input[name="difficulty"]'),
    gridSizeSelect: document.getElementById('gridSize'),
    roundsInput: document.getElementById('rounds'),
    startGameBtn: document.getElementById('startGame'),
    resetSettingsBtn: document.getElementById('resetSettings'),
    restartGameBtn: document.getElementById('restartGame'),
    newGameBtn: document.getElementById('newGame')
};

const setupEventListeners = () => {
    elements.startGameBtn.addEventListener('click', startGame);
    
    elements.resetSettingsBtn.addEventListener('click', resetSettings);
    
    elements.restartGameBtn.addEventListener('click', restartGame);
    
    elements.newGameBtn.addEventListener('click', resetGame);
    
    elements.playerModeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            state.playerMode = radio.value;
            if (state.playerMode === 'two') {
                elements.player2Container.classList.remove('hidden');
            } else {
                elements.player2Container.classList.add('hidden');
            }
        });
    });
};

const initGame = () => {
    setupEventListeners();
};

const createCards = () => {
    const [rows, cols] = state.gridSize.split('x').map(Number);
    const totalCards = rows * cols;
    const pairsNeeded = totalCards / 2;
    
    const selectedThemes = CARD_THEMES.slice(0, pairsNeeded);
    
    const cardPairs = selectedThemes.reduce((acc, theme) => {
        return [...acc, { id: generateUniqueId(), theme }, { id: generateUniqueId(), theme }];
    }, []);
    
    return shuffleArray(cardPairs);
};

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15);
};

// Перемішування масиву 
const shuffleArray = (array) => {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
};

// Рендеринг ігрового поля
const renderGameBoard = () => {
    elements.gameBoard.innerHTML = '';
    
    const [rows, cols] = state.gridSize.split('x').map(Number);
    elements.gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    state.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${card.theme}</div>
                <div class="card-back">?</div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => handleCardClick(card.id));
        elements.gameBoard.appendChild(cardElement);
    });
};

// Обробка кліку по картці
const handleCardClick = (cardId) => {
    if (state.isGameOver || state.flippedCards.length >= 2) {
        return;
    }
    
    const card = state.cards.find(c => c.id === cardId);
    const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
    
    if (state.flippedCards.includes(card) || cardElement.classList.contains('matched')) {
        return;
    }
    
    state.flippedCards.push(card);
    cardElement.classList.add('flipped');
    
    if (state.flippedCards.length === 2) {
        state.moves++;
        updateMovesDisplay();
        
        setTimeout(() => {
            checkForMatch();
        }, 500);
    }
};

// Перевірка пари карток
const checkForMatch = () => {
    const [card1, card2] = state.flippedCards;
    const card1Element = document.querySelector(`.card[data-id="${card1.id}"]`);
    const card2Element = document.querySelector(`.card[data-id="${card2.id}"]`);
    
    if (card1.theme === card2.theme) {
        state.matchedPairs++;
        card1Element.classList.add('matched');
        card2Element.classList.add('matched');
        
        if (state.playerMode === 'two') {
            state.players[state.currentPlayerIndex].score++;
        }
        
        if (state.matchedPairs === state.cards.length / 2) {
            endRound();
        }
    } else {
        setTimeout(() => {
            card1Element.classList.remove('flipped');
            card2Element.classList.remove('flipped');
            
            if (state.playerMode === 'two') {
                state.currentPlayerIndex = (state.currentPlayerIndex + 1) % 2;
                updateCurrentPlayerDisplay();
            }
        }, 500);
    }
    
    state.flippedCards = [];
};

const updateMovesDisplay = () => {
    elements.moves.textContent = `Ходи: ${state.moves}`;
};

const updateCurrentPlayerDisplay = () => {
    if (state.playerMode === 'two') {
        elements.currentPlayer.textContent = `Зараз ходить: ${state.players[state.currentPlayerIndex].name}`;
    } else {
        elements.currentPlayer.textContent = '';
    }
};

// Початок гри
const startGame = () => {
    state.players[0].name = elements.player1Name.value || 'Гравець 1';
    state.players[0].score = 0;
    state.players[0].moves = 0;
    state.players[0].time = 0;
    
    state.players[1].name = elements.player2Name.value || 'Гравець 2';
    state.players[1].score = 0;
    state.players[1].moves = 0;
    state.players[1].time = 0;
    
    state.gridSize = elements.gridSizeSelect.value;
    state.totalRounds = parseInt(elements.roundsInput.value) || 1;
    state.currentRound = 1;
    state.roundStats = [];
    
    elements.difficultyRadios.forEach(radio => {
        if (radio.checked) {
            state.difficulty = radio.value;
        }
    });
    
    switch (state.difficulty) {
        case 'easy':
            state.timeRemaining = 180; 
            break;
        case 'normal':
            state.timeRemaining = 120; 
            break;
        case 'hard':
            state.timeRemaining = 60; 
            break;
        default:
            state.timeRemaining = 180;
    }
    
    elements.settings.classList.add('hidden');
    elements.gameInfo.classList.remove('hidden');
    elements.gameBoard.classList.remove('hidden');
    
    startRound();
};

// Початок нового раунду
const startRound = () => {
    state.cards = createCards();
    state.flippedCards = [];
    state.matchedPairs = 0;
    state.moves = 0;
    state.isGameOver = false;
    state.currentPlayerIndex = 0;
    
    updateMovesDisplay();
    updateCurrentPlayerDisplay();
    renderGameBoard();
    
    startTimer();
};

// Запуск таймера
const startTimer = () => {
    updateTimerDisplay();
    
    state.timer = setInterval(() => {
        state.timeRemaining--;
        updateTimerDisplay();
        
        if (state.timeRemaining <= 0) {
            clearInterval(state.timer);
            endRound(true);
        }
    }, 1000);
};

const updateTimerDisplay = () => {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    
    elements.timer.textContent = `Час: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Завершення раунду
const endRound = (timeOut = false) => {
    clearInterval(state.timer);
    state.isGameOver = true;
    
    const timeSpent = calculateTimeSpent();
    const roundStat = {
        round: state.currentRound,
        isTimeOut: timeOut,
        players: [
            { ...state.players[0], moves: state.playerMode === 'two' ? state.players[0].score * 2 : state.moves, time: timeSpent },
            { ...state.players[1], moves: state.playerMode === 'two' ? state.players[1].score * 2 : 0, time: timeSpent }
        ]
    };
    
    state.roundStats.push(roundStat);
    
    if (state.currentRound < state.totalRounds) {
        state.currentRound++;
        
        alert(`Раунд ${state.currentRound - 1} завершено! Починаємо раунд ${state.currentRound}.`);
        
        startRound();
    } else {
        showGameResults();
    }
};

// Обчислення витраченого часу
const calculateTimeSpent = () => {
    let initialTime;
    
    switch (state.difficulty) {
        case 'easy':
            initialTime = 180;
            break;
        case 'normal':
            initialTime = 120;
            break;
        case 'hard':
            initialTime = 60;
            break;
        default:
            initialTime = 180;
    }
    
    return initialTime - state.timeRemaining;
};

const showGameResults = () => {
    elements.gameBoard.classList.add('hidden');
    elements.gameInfo.classList.add('hidden');
    elements.gameResults.classList.remove('hidden');
    
    let winner = '';
    
    if (state.playerMode === 'two') {
        const player1TotalScore = state.roundStats.reduce((total, round) => total + round.players[0].score, 0);
        const player2TotalScore = state.roundStats.reduce((total, round) => total + round.players[1].score, 0);
        
        if (player1TotalScore > player2TotalScore) {
            winner = `Переможець: ${state.players[0].name}`;
        } else if (player2TotalScore > player1TotalScore) {
            winner = `Переможець: ${state.players[1].name}`;
        } else {
            winner = 'Нічия!';
        }
    } else {
        const allCompleted = !state.roundStats.some(round => round.isTimeOut);
        if (allCompleted) {
            winner = `Вітаємо! Ви успішно пройшли всі раунди.`;
        } else {
            winner = `Гра завершена. Спробуйте ще раз!`;
        }
    }
    
    elements.winner.innerHTML = `<div class="winner">${winner}</div>`;
    
    let statsHTML = '';
    state.roundStats.forEach(round => {
        statsHTML += `
            <div class="round-item">
                <h3>Раунд ${round.round}</h3>
                ${round.isTimeOut ? '<p>Час вийшов!</p>' : ''}
                <div class="player-stats">
        `;
        
        if (state.playerMode === 'two') {
            statsHTML += `
                <div>
                    <span class="player-name">${round.players[0].name}</span>: 
                    <span class="player-score">${round.players[0].score} пар</span> 
                    (${round.players[0].moves} ходів)
                </div>
                <div>
                    <span class="player-name">${round.players[1].name}</span>: 
                    <span class="player-score">${round.players[1].score} пар</span> 
                    (${round.players[1].moves} ходів)
                </div>
            `;
        } else {
            const minutes = Math.floor(round.players[0].time / 60);
            const seconds = round.players[0].time % 60;
            const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            statsHTML += `
                <div>
                    <span class="player-name">${round.players[0].name}</span>: 
                    ${round.players[0].moves} ходів, Час: ${timeDisplay}
                </div>
            `;
        }
        
        statsHTML += `
                </div>
            </div>
        `;
    });
    
    elements.roundStats.innerHTML = statsHTML;
};

const restartGame = () => {
    clearInterval(state.timer);
    startRound();
};

const resetGame = () => {
    clearInterval(state.timer);
    
    elements.gameResults.classList.add('hidden');
    elements.gameBoard.classList.add('hidden');
    elements.gameInfo.classList.add('hidden');
    elements.settings.classList.remove('hidden');
};

const resetSettings = () => {
    elements.player1Name.value = 'Гравець 1';
    elements.player2Name.value = 'Гравець 2';
    elements.gridSizeSelect.value = '4x4';
    elements.roundsInput.value = '1';
    
    document.getElementById('singlePlayer').checked = true;
    document.getElementById('easyDifficulty').checked = true;
    
    elements.player2Container.classList.add('hidden');
    
    state.playerMode = 'single';
};

document.addEventListener('DOMContentLoaded', initGame);