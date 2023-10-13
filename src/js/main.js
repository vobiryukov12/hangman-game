import '../css/style.css';
import { darkModeHandle } from './darkModeHandle';
import { startGame } from './game';

darkModeHandle();

const startGameButton = document.getElementById('startGame');
startGameButton.addEventListener('click', startGame);
