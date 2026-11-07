import './ui/styles.css';
import { showGameScreen } from './ui/gameScreen';
import { showStartScreen } from './ui/startScreen';
import { loadSettings, saveSettings } from './ui/storage';

const app = document.getElementById('app')!;
let settings = loadSettings();

function showMenu(): void {
  showStartScreen(app, settings, (chosen) => {
    settings = chosen;
    saveSettings(settings);
    showGameScreen(app, settings, showMenu);
  });
}

showMenu();
