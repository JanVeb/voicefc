// src/main.ts
import './css/card.css';
import './css/ui.css';
import './css/settings.css'
import './css/style.css'
import './css/popup.css'
import './css/level.css';

import { loadCSV, csvData, CSVRow } from './utils/csvLoader';
import { Card } from './comp/card';
import { recordMic } from './utils/spacedRepetition';
import { renderCard, setupSwipeGesture, createSwipeIndicator } from './comp/cardUI';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import { convertPinyin } from './utils/convertPinyinToNumbers';
import './utils/dynamicDict';
import './comp/settings'
// import { readCSVAndLogText3 } from './textTools/extractText3';

// readCSVAndLogText3('public/data/chinese.csv');


const app = document.getElementById('app') as HTMLElement;
let cards: Card[] = [];
let currentIndex = 0;

// Initialization function
async function init() {
  try {
    // Load the CSV data and wait for completion
    await loadCSV('/data/chinese.csv');

    // Ensure csvData is populated
    if (csvData.length === 0) {
      throw new Error('CSV data is empty or not loaded properly.');
    }

    // Process the CSV data
    cards = csvData.map(
      (row: CSVRow) =>
        new Card(
          row.book,
          row.lesson,
          `/audio/${row.audio_1}`,
          row.text_1,
          row.text_2,
          row.text_3,
          row.text_4
        )
    );

    // Render the first card and create the next button
    renderCard(currentIndex, cards, app);
    // createNextButton(cards, app);
      // Setup swipe gesture
  setupSwipeGesture(cards, app);

  // Create swipe indicator
  createSwipeIndicator();

    // Initialize the recorder functionality
    recordMic(cards);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Initialize the app
init();


