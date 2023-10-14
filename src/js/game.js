import { WORDS, KEYBOARD_LETTERS } from './consts';
import { wordGenerator } from './wordGenerator';

const gameDiv = document.getElementById('game');
const logo = document.getElementById('logo');
let triesLeft;
let winCount;

// createPlaceholdersHTML
const createPlaceholdersHTML = (word) => {
  const wordArray = Array.from(word);
  const placeholdersHTML = wordArray.reduce((acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`, '');

  return `<div id="placeholders" class="placeholders-wrapper">${placeholdersHTML}</div>`;
};

// createKeyboard
const createKeyboard = () => {
  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  keyboard.id = 'keyboard';

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return acc + `<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`;
  }, '');

  keyboard.innerHTML = keyboardHTML;

  return keyboard;
};

// createHangmanImg
const createHangmanImg = () => {
  const image = document.createElement('img');
  image.src = 'images/hg-0.png';
  image.alt = 'Hangman image';
  image.classList.add('hangman-img');
  image.id = 'hangman-img';

  return image;
};

// checkLetter
const checkLetter = (letter, word) => {
  const inputLetter = letter.toLowerCase();

  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById('tries-left');
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById('hangman-img');
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame('lose', word);
    }
  } else {
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame('win', word);
          return;
        }
        document.getElementById(`letter_${i}`).innerText = inputLetter.toUpperCase();
      }
    });
  }
};

// stopGame
export const stopGame = (status, word) => {
  document.getElementById('placeholders').remove();
  document.getElementById('tries').remove();
  document.getElementById('keyboard').remove();
  document.getElementById('quit').remove();

  if (status === 'win') {
    document.getElementById('hangman-img').src = 'images/hg-win.png';
    document.getElementById('game').innerHTML += '<h2 class="result-header win">You won!</h2>';
  } else if (status === 'lose') {
    document.getElementById('game').innerHTML += '<h2 class="result-header lose">You lost :(</h2>';
  } else if (status === 'quit') {
    logo.classList.remove('logo-sm');
    document.getElementById('hangman-img').remove();
  }

  document.getElementById('game').innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-4">Play again</button>`;

  document.getElementById('play-again').addEventListener('click', startGame);
};

// createPlayArea
const createPlayArea = (word) => {
  gameDiv.innerHTML = createPlaceholdersHTML(word);
  const keyboardDiv = createKeyboard();

  gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">${triesLeft}</span></p>`;

  gameDiv.appendChild(keyboardDiv);

  keyboardDiv.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'button') {
      event.target.disabled = true;
      checkLetter(event.target.id, word);
    }
  });

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.insertAdjacentHTML('beforeend', '<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>');

  document.getElementById('quit').onclick = () => {
    const isSure = confirm('Are you sure you want to exit?');
    if (isSure) {
      stopGame('quit', word);
    }
  };
};

// generateWord
const generateWord = (controller) => {
  wordGenerator(controller)
    .then((choices) => {
      if (choices && choices.length > 0) {
        const word = choices[0].message.content.toLowerCase().replace(/\./g, ' ');
        createPlayArea(word);
      } else {
        const randomIndex = Math.floor(Math.random() * WORDS.length);
        const wordToGuess = WORDS[randomIndex];
        createPlayArea(wordToGuess);
      }
    });
};

// startGame
export const startGame = () => {
  triesLeft = 10;
  winCount = 0;

  logo.classList.add('logo-sm');

  gameDiv.innerHTML = '<div id="loader" class="loader" role="status"></div><p class="mt-3">ChatGPT generates a word for you</p>';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    clearTimeout(timeoutId);
  }, 3000);

  generateWord(controller);
};
