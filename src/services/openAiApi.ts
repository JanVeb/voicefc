// src/services/openAiApi.ts
import { preLefNormalisePunct } from '../utils/levenshteinDistance';
import { getCardData, saveCardData } from '../storage/localforage';
import {
  calculateNextIntervalMinutes,
  convertIntervalToTimestamp,
} from '../utils/spacedRepetition';
import { Card } from '../comp/card';

// import { setCardData, getCardData } from '../storage/spacedRepetitionMap';






// Function to send audio to OpenAI Whisper
export async function SendAudioToWhisper(
  audioBlob: Blob,
  targetText: string,
  cardIndex: number,
  promptText: string
) {
  
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const API_URL = 'https://api.openai.com/v1/audio/transcriptions';

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('model', 'whisper-1'); // Specify the Whisper model
  formData.append(
    'prompt', promptText
  );
console.log('promptText', promptText)
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const data = await response.json();
  const levenCoef = preLefNormalisePunct(
    data.text,
    targetText
  );

  // const SpacedRepetitionDataSample: SpacedRepetitionData = {
  //   interval: [], // Array of intervals
  //   correctScore: [], // Array of correct scores
  //   isLearned: false, // Boolean indicating if learned
  //   correctCount: 0, // Number of correct reviews
  // };
  // exampleData.correctScore.push(levenCoef);
  // Assuming getCardSpacedRMap is defined and returns a Promise

  // setCardData(cardIndex, exampleData);

  // createCardData(cardIndex);

  getCardData(cardIndex).then((data) => {
    // Ensure we are not working with references to old data
    const newData = {
      interval: [...data.interval], // Clone the interval array
      correctScore: [...data.correctScore], // Clone the correctScore array
      isLearned: data.isLearned,
      correctCount: data.correctCount,
      nextReviewTimestamp: [...data.nextReviewTimestamp], // Clone the nextReviewTimestamp array
      text1: data.text1,
      text2: data.text2,
      text3: data.text3,
      text4: data.text4,
      text5: levenCoef.text,
      audio: data.audio,
      book: data.book,
      lesson: data.lesson,
    };
    console.log("🚀 ~ getCardData ~ newData.levenCoef.text:", levenCoef.text)

    // Push the current review's score to the correctScore array
    newData.correctScore.push(levenCoef.coefficient);

    console.log("🚀 ~ getCardData ~ newData.correctScore:", newData.correctScore)
    let nextInterval;
    if (data.correctScore.length < 3) {
      nextInterval = 7
    } else {
      const averageLast3Score = (data.correctScore[data.correctScore.length-1] + data.correctScore[data.correctScore.length-2] +data.correctScore[data.correctScore.length-3]) / 3;
      if (averageLast3Score < 0.5) {
        nextInterval = 7
      } else {
    // Calculate the next interval based on the latest interval and levenCoef
    nextInterval = calculateNextIntervalMinutes(
      newData.interval[newData.interval.length - 1],
      levenCoef.coefficient
    );
      }
    }


    // Generate the next review timestamp and date
    const nextReview = convertIntervalToTimestamp(nextInterval);

    // Add the new interval, timestamp, and date to their respective arrays
    newData.interval.push(nextInterval);
    newData.nextReviewTimestamp.push(nextReview);

    // Save the updated data back to storage
    saveCardData(cardIndex, newData);

    //----------------------------------------------------------------
    // Assuming you have a parent element with the id "card" in your HTML
    const parentElement = document.querySelector('.card') as HTMLElement;

    if (parentElement) {
      // Step 1: Create an instance of the Card class
      const card = new Card(
        'Example Book',
        'Lesson 1',
        'path/to/audio.mp3',
        'Text 1',
        'Text 2',
        'Text 3',
        'Text 4',
        { text1: true, text2: true, text3: false, text4: false } // Only text1 and text3 will be displayed
      );

      // Step 2: Render the card to the parent element
      card.render(parentElement);

      // Step 3: Define the review result data
      const reviewData = {
        interval: newData.interval,
        correctScore: newData.correctScore,
        isLearned: newData.isLearned,
        correctCount:newData.correctCount,
        nextReviewTimestamp: newData.nextReviewTimestamp,
        text1: newData.text1,
        text2: newData.text2,
        text3: newData.text3,
        text4: newData.text4,
        text5: newData.text5,
        audio: newData.audio,
        book: newData.book,
        lesson:newData.lesson,
      };

      // Step 4: Call displayReviewResult with the review data
      card.displayReviewResult(reviewData);
    }

    //----------------------------------------------------------------
  });

  // getCardSpacedRMap()
  //   .then((data) => {
  //     console.log('🚀 ~ getCardSpacedRMap:', data);
  //   })
  //   .catch((err) => {
  //     console.error('Error getting cardSpacedR map:', err);
  //   });

  // return data.text;
}

