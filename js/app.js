//Global constants
const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const numOfPairs = 8

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Shuffles the cards found in the deck class using the shuffle function
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (let i = 0; i < shuffledCards.length; i++) {
        deck.appendChild(shuffledCards[i]);
    }
}
shuffleDeck();

/* Event Listener looks for clicks made on the deck cards and executed the
conditional statement accordingly. It also includes functions that check for
card matches, adds moves when two cards are toggled, and tracks the number
of moves so the stars are reduced accordingly.*/
deck.addEventListener('click', function(event) {
    const itemClicked = event.target;
    if (itemClicked.classList.contains('card') && !itemClicked.classList.contains('match')
        && toggledCards.length < 2 && !toggledCards.includes(itemClicked)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(itemClicked);
        addToggleToArray(itemClicked);
        if (toggledCards.length === 2) {
            checkForMatch(itemClicked);
            addMove();
            calculateScore();
        }
    }
});

//toggleCard() is used to toggle the deck cards
function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

//addToggleToArray() adds the toggled cards to the toggledCards array
function addToggleToArray(itemClicked) {
    toggledCards.push(itemClicked);
}

/* checkForMatch checks for matching cards and sets a certain amount of timeout
for the unmatched cards, so the player is able to visibly view the card. If the
cards do not match, they will be filled backwards again.*/
function checkForMatch() {
    if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
        console.log('Matched!')
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = [];
        matched++;
        setTimeout(function() {
            gameWin();
        }, 800)
    } else {
        setTimeout(function() {
            console.log('Not a match!')
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 600);
    }
}


// addMove() increases the number of moves for each turn a click is made
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

/* Calculates the star rating according to the number of moves. Once 16 moves
has been reached, the number of stars will go down by one, and at 24 moves,
the number of stars will drop to 1.*/
function calculateScore() {
    if (moves === 16 || moves === 24) {
        hideStar();
    }
}

/* Hides a star after a certain number of moves has been passed. 16 and 24 moves
in this case.*/
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (let i = 0; i < starList.length; i++) {
        if (starList[i].style.display !== 'none') {
            starList[i].style.display = 'none';
            break;
        }
    }
}

// startClock() starts the clock time as soon as the first click has been made
function startClock() {
    clockId = setInterval(function() {
        time++;
        displayTime();
    }, 1000);
}

/*Displays the time of the timer by storing the clockId in the startClock
function and incrementing time every 1 sec (1000 ms). To correct the display
of time in minutes and seconds, the minutes and second constants were set into
place. To further correct the time display, a conditional statement was put
into play. */
function displayTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const clock = document.querySelector('.clock');
    clock.innerHTML = 'TIME: ' + time;
    if (seconds < 10) {
        clock.innerHTML = `TIME: ${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `TIME: ${minutes}:${seconds}`;
    }
}

// stopClock() is used to stop the timer
function stopClock() {
    clearInterval(clockId);
}

// toggleIntroModal() toggles the introduction modal
function toggleIntroModal() {
    const modal = document.querySelector('.intro_modal');
    modal.classList.toggle('hide');
}
toggleIntroModal();

//toggleOverModal() toggles the game over modal
function toggleOverModal() {
    const modal = document.querySelector('.modal_background');
    if (modal.classList.contains('hide')) {
        modal.classList.remove('hide');
    } else {
        modal.classList.add('hide')
    }
}

/*writeModalInfo() displays the final scoreboard with the players moves, stars,
and time information.*/
function writeModalInfo() {
    const timeInfo = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesInfo = document.querySelector('.modal_moves');
    const starsInfo = document.querySelector('.modal_stars');
    const stars = displayStars();

    timeInfo.innerHTML = `${clockTime}`;
    movesInfo.innerHTML = `MOVES = ${moves}`;
    starsInfo.innerHTML = `RATING = ${stars}`;
}

// displayStars() displays the star info on the modal
function displayStars() {
    stars = document.querySelectorAll('.stars li');
    numOfStars = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            numOfStars++;
        }
    }
    return numOfStars;
}

// Activating the cancel button on the game over modal
document.querySelector('.modal_cancel').addEventListener('click', toggleOverModal);

// Activating the restart icon to reset the game
document.querySelector('.restart').addEventListener('click', gameReset)

// Activating the replay button on the game over modal
document.querySelector('.modal_replay').addEventListener('click', gameRestart)

// Adding the start button on the game intro modal
document.querySelector('.intro_modal_button').addEventListener('click', toggleIntroModal)

/* gameReset() resets the game with a new shuffled board as well as timer set to
0:00, moves at 0, and the star count at 3.*/
function gameReset() {
    toggledCards = [];
    shuffleDeck();
    resetClock();
    cardReset();
    moveReset();
    starReset();
}

// resetClock() reset the game clock
function resetClock() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

// moveReset() resets the number of moves to 0
function moveReset() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

// starReset() resets the number of stars back to 3
function starReset() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

/* Checks for the win condition of 8 matching pairs to display the game over
modal.*/
function gameWin() {
    if (matched == numOfPairs) {
        gameOver();
    }
}

// Ends the game and stops the clock as well as toggles the game over modal
function gameOver() {
    stopClock();
    writeModalInfo();
    toggleOverModal();
    cardReset();
}

// gameRestart() resets the game with new cards after closing the game over modal
function gameRestart() {
    gameReset();
    toggleOverModal();
    cardReset();
}

// cardReset() resets the cards
function cardReset() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
 
