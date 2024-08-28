import { spacedRepetitionMultiplier } from '../config/constants';
import { AudioRecorder } from '../comp/recordAudio';
import { SendAudioToWhisper } from '../services/openAiApi';
import { Card } from '../comp/card';
import { csvData } from '../utils/csvLoader.ts';
import { SpacedRepetitionData, saveCardData } from '../storage/localforage';
import { shortestPosibleInterval } from '../config/constants';

export function calculateNextIntervalMinutes(
  previousIntervalMinutes: number,
  levenCoef: number
): number {
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

export function convertIntervalToTimestamp(nextIntervalMinutes: number): {
  timestamp: number;
  date: Date;
} {
  const newIntervalMilliseconds = nextIntervalMinutes * 60 * 1000;
  const currentTimestamp = Date.now();
  const nextReviewTimestamp = currentTimestamp + newIntervalMilliseconds;
  const nextReviewDate = new Date(nextReviewTimestamp);

  return {
    timestamp: nextReviewTimestamp,
    date: nextReviewDate,
  };
}

interface Cards {
  [key: string]: SpacedRepetitionData;
}

let activeCardIndex: number = 0;
export function getExpiredCardWithShortestInterval(cards: Cards): number {
  const cardKeys = Object.keys(cards);
  if (cardKeys.length === 0) {
    // check if csv data is loaded, if no
    if (csvData && csvData.length === 0) {
      console.log(
        '%c🚀 ~ getExpiredCardWithShortestInterval ~ csvData notloaded!!!!!!!!!!!:',
        'color: red'
      );
      activeCardIndex = 0;
      return 0;
    }

    const newData = {
      interval: [], // Clone the interval array
      correctScore: [], // Clone the correctScore array
      isLearned: false,
      correctCount: 0,
      nextReviewTimestamp: [Math.floor(Date.now() / 1000)], // Clone the nextReviewTimestamp array
      nextReviewDate: [], // Clone the nextReviewDate array
      text1: csvData[0].text_1,
      text2: csvData[0].text_2,
      text3: csvData[0].text_3,
      text4: csvData[0].text_4,
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
    date: Date;
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
        date: card.nextReviewDate[card.interval.length - 1],
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
      nextReviewDate: [], // Clone the nextReviewDate array
      text1: csvData[cardKeys.length].text_1,
      text2: csvData[cardKeys.length].text_2,
      text3: csvData[cardKeys.length].text_3,
      text4: csvData[cardKeys.length].text_4,
      audio: csvData[cardKeys.length].audio_1,
      book: csvData[cardKeys.length].book,
      lesson: csvData[cardKeys.length].lesson,
    };

    saveCardData(cardKeys.length, newData);
    activeCardIndex = cardKeys.length;
    return cardKeys.length;
  }

  expiredCards.sort((a, b) => a.interval - b.interval);
  // console.log(
  //   '🚀 ~ getExpiredCardWithShortestInterval ~ expiredCards:',
  //   expiredCards
  // );

  expiredCards.forEach((item) => {
    // console.log('Key: ' + item.key);
    // console.log('Text: ' + item.text);

    // Check if the date exists before logging it

    console.log(item.key, item.text, item.interval, item.date); // Formats the date to Austrian format

    console.log(); // Empty line for separation
  });

  activeCardIndex = expiredCards[0].key;
  return expiredCards[0].key;
}

export function playRecordedAudio(blob: Blob) {
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.play().catch((error) => console.error('Error playing audio:', error));
}

const recorder = new AudioRecorder();
const startButton = document.getElementById('start')!;
const stopButton = document.getElementById('stop')!;

startButton.addEventListener('click', () => recorder.startRecording());

export function recordMic(cards: Card[]) {
  stopButton.addEventListener('click', async () => {
    const audioBlob = await recorder.stopRecording();
    if (audioBlob) {
      playRecordedAudio(audioBlob); // Play the recorded audio
      await SendAudioToWhisper(
        audioBlob,
        cards[activeCardIndex].text1, // This assumes text1 is a property of Card
        activeCardIndex
      );
    }
  });
}
