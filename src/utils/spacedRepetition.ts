import { spacedRepetitionMultiplier, shortestPosibleInterval } from '../config/constants';
import { AudioRecorder } from '../comp/recordAudio';
import { SendAudioToWhisper } from '../services/openAiApi';
import { Card } from '../comp/card';
import { csvData } from '../utils/csvLoader';
import { SpacedRepetitionData, saveCardData } from '../storage/localforage';

let isSwitchButtonClicked = false;

export function calculateNextIntervalMinutes(
  previousIntervalMinutes: number,
  levenCoef: number
): number {
  if (isSwitchButtonClicked) {
    isSwitchButtonClicked = false; // Reset the flag
    return 7;
  }

  if (levenCoef < 0.3) {
    return shortestPosibleInterval;
  } else if (typeof previousIntervalMinutes !== 'number') {
    return shortestPosibleInterval;
  } else {
    const newIntervalMinutes =
      previousIntervalMinutes * levenCoef * spacedRepetitionMultiplier;
    return newIntervalMinutes;
  }
}

export function setSwitchButtonClicked() {
  isSwitchButtonClicked = true;
}


export function convertIntervalToTimestamp(nextIntervalMinutes: number): number {
  const newIntervalMilliseconds = nextIntervalMinutes * 60 * 1000;
  const currentTimestamp = Date.now();
  const nextReviewTimestamp = currentTimestamp + newIntervalMilliseconds;
  return nextReviewTimestamp;
}


interface Cards {
  [key: string]: SpacedRepetitionData;
}

let activeCardIndex: number = 0;
export function getExpiredCardWithShortestInterval(cards: Cards): number {
  const cardKeys = Object.keys(cards);
  const expiredCardsEl: HTMLElement | null = document.getElementById('expired-cards')
  const activeCardsEl: HTMLElement | null = document.getElementById('active-cards')
  if (cardKeys.length === 0) {
    // check if csv data is loaded, if no
    if (csvData && csvData.length === 0) {
      activeCardIndex = 0;
      return 0;
    }

    const newData = {
      interval: [], // Clone the interval array
      correctScore: [], // Clone the correctScore array
      isLearned: false,
      correctCount: 0,
      nextReviewTimestamp: [Math.floor(Date.now() / 1000)], // Clone the nextReviewTimestamp array
      text1: csvData[0].text_1,
      text2: csvData[0].text_2,
      text3: csvData[0].text_3,
      text4: csvData[0].text_4,
      text5: '',
      audio: csvData[0].audio_1,
      book: csvData[0].book,
      lesson: csvData[0].lesson,
    };

    saveCardData(0, newData);
    activeCardIndex = 0;
    return 0;
  }

  const currentTime = Date.now();
  let expiredCards: {
    key: number;
    interval: number;
    text: string;
  }[] = [];

  for (const key of cardKeys) {
    const card = cards[key];
    const lastTimestamp =
      card.nextReviewTimestamp[card.nextReviewTimestamp.length - 1];

    if (lastTimestamp < currentTime) {
      expiredCards.push({
        key: Number(key),
        interval: card.interval[card.interval.length - 1],
        text: card.text3,
      });
    }
  }

  if (expiredCards.length === 0) {
    const newData = {
      interval: [], // Clone the interval array
      correctScore: [], // Clone the correctScore array
      isLearned: false,
      correctCount: 0,
      nextReviewTimestamp: [Math.floor(Date.now() / 1000)], // Clone the nextReviewTimestamp array
      text1: csvData[cardKeys.length].text_1,
      text2: csvData[cardKeys.length].text_2,
      text3: csvData[cardKeys.length].text_3,
      text4: csvData[cardKeys.length].text_4,
      text5: '',
      audio: csvData[cardKeys.length].audio_1,
      book: csvData[cardKeys.length].book,
      lesson: csvData[cardKeys.length].lesson,
    };

    saveCardData(cardKeys.length, newData);
    activeCardIndex = cardKeys.length;
    return cardKeys.length;
  }

  expiredCards.sort((a, b) => a.interval - b.interval);


  activeCardIndex = expiredCards[0].key;

  if (expiredCardsEl && activeCardsEl) {
    expiredCardsEl.innerText = expiredCards.length.toString();
    activeCardsEl.innerText = cardKeys.length.toString();
} else {
    console.error("Element with ID 'expiredCards' not found.");
}


  return expiredCards[0].key;
}

export function playRecordedAudio(blob: Blob) {
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.play().catch((error) => console.error('Error playing audio:', error));
}

const recorder = new AudioRecorder();

const recordButton = document.getElementById('record-button')!; // Use a single button with id 'record'
let isRecording = false; // Keep track of the recording state
// let activeCardIndex = 0; // Ensure this variable is defined and updated appropriately

// Function to handle the button click event
function handleRecordButtonClick(cards: Card[]) {
  recordButton.addEventListener('click', async () => {
    if (!isRecording) {
      // If not recording, start recording
      recorder.startRecording();
      recordButton.innerHTML = '<i class="fas fa-microphone-slash"></i>' 
      isRecording = true;
    } else {
      // If recording, stop recording
      const audioBlob = await recorder.stopRecording();
      recordButton.innerHTML = '<i class="fas fa-microphone"></i>' 
            isRecording = false;

      if (audioBlob) {
        // playRecordedAudio(audioBlob); // Play the recorded audio

// add current book lesson excluding current target text to whisper prompt
const filteredData = csvData.filter(item => item.book === cards[activeCardIndex].book && item.lesson === cards[activeCardIndex].lesson);

//const activeText4 = cards[activeCardIndex].text4; // Get the current active text4 value//

// Initialize the promptText variable as an empty string
let promptText = '';

// Iterate over filteredData and add the text_4 values to promptText
filteredData.forEach(item => {
  // if (item.text_4 !== activeText4) { // Exclude if text_4 is the same as activeText4
    if (promptText) {
      promptText += ', '; // Add a comma and space before adding the next item
    }
    promptText += item.text_4; // Add the text_4 to promptText
  // }
});

        await SendAudioToWhisper(
          audioBlob,
          cards[activeCardIndex].text4, // This assumes text1 is a property of Card
          activeCardIndex,
          promptText
        );
      }
    }
  });
}

// Exported function to initialize the recording logic
export function recordMic(cards: Card[]) {
  handleRecordButtonClick(cards); // Pass the cards to the click handler function
}
