// src/services/openAiApi.ts
import { LevenshteinCoeficient } from '../utils/levenshteinDistance';
import { getCardData, saveCardData } from '../storage/localforage';
import {
  calculateNextIntervalMinutes,
  convertIntervalToTimestamp,
} from '../utils/spacedRepetition';
import { Card } from '../comp/card';

// import { setCardData, getCardData } from '../storage/spacedRepetitionMap';

function removeChinesePunctuation(text: string) {
  // Regular expression to match Chinese punctuation
  return text.replace(
    /[\u3000-\u303F\uFF00-\uFFEF\u037E\u2047-\u2051\u207D\u208D\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2985\u2986\u299B\u299C\u29D0\u29D1\u29D4\u29D5\u29E3\u29E4\u29E7\u29E8\u2CF9\u2CFA\u2CFB\u2CFC\u2CFE\uA789\uA8CE\uA8CF\uA92F\uA95F\uA9C1\uA9C2\uA9C4-\uA9CD\uA9DE\uAA5D\uAA5E\uAA7C\uAA7D\uAAB0-\uAAB1\uABEB\uFE10-\uFE19\uFE30-\uFE6F\uFF01-\uFF60\uFFE0-\uFFE6]/g,
    ''
  );
}
// Function to send audio to OpenAI Whisper
export async function SendAudioToWhisper(
  audioBlob: Blob,
  targetText: string,
  cardIndex: number
) {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const API_URL = 'https://api.openai.com/v1/audio/transcriptions';

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('model', 'whisper-1'); // Specify the Whisper model
  formData.append(
    'prompt',
    `歡迎你來臺灣
請問你是陳月美小姐嗎
是的謝謝你來接我們
不客氣我是李明華
這是王先生
你好我姓王叫開文
你們好歡迎你們來臺灣
請喝茶
謝謝很好喝請問這是什麼茶
這是烏龍茶臺灣人喜歡喝茶開文你們日本人呢
他不是日本人
對不起你是哪國人
我是美國人
開文你要不要喝咖啡
謝謝我不喝咖啡我喜歡喝茶`
  );

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
  const levenCoef = LevenshteinCoeficient(
    removeChinesePunctuation(targetText),
    removeChinesePunctuation(data.text)
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
    console.log('🚀 ~ getCardData ~ data:', data);
    // Ensure we are not working with references to old data
    const newData = {
      interval: [...data.interval], // Clone the interval array
      correctScore: [...data.correctScore], // Clone the correctScore array
      isLearned: data.isLearned,
      correctCount: data.correctCount,
      nextReviewTimestamp: [...data.nextReviewTimestamp], // Clone the nextReviewTimestamp array
      nextReviewDate: [...data.nextReviewDate], // Clone the nextReviewDate array
      text1: data.text1,
      text2: data.text2,
      text3: data.text3,
      text4: data.text4,
      audio: data.audio,
      book: data.book,
      lesson: data.lesson,
    };

    // Push the current review's score to the correctScore array
    newData.correctScore.push(levenCoef);

    // Calculate the next interval based on the latest interval and levenCoef
    const nextInterval = calculateNextIntervalMinutes(
      newData.interval[newData.interval.length - 1],
      levenCoef
    );

    // Generate the next review timestamp and date
    const nextReview = convertIntervalToTimestamp(nextInterval);

    // Add the new interval, timestamp, and date to their respective arrays
    newData.interval.push(nextInterval);
    newData.nextReviewTimestamp.push(nextReview.timestamp);
    newData.nextReviewDate.push(nextReview.date);

    // Save the updated data back to storage
    saveCardData(cardIndex, newData);
    console.log('🚀 ~ getCardData ~ newData:', newData);

    //----------------------------------------------------------------
    // Assuming you have a parent element with the id "card-container" in your HTML
    const parentElement = document.querySelector('.card') as HTMLElement;
    console.log('🚀 ~ getCardData ~ parentElement:', parentElement);

    if (parentElement) {
      // Step 1: Create an instance of the Card class
      const card = new Card(
        'Example Book',
        'Lesson 1',
        'path/to/audio.mp3',
        'Text 1',
        'Text 2',
        'Text 3',
        'Text 4'
      );

      // Step 2: Render the card to the parent element
      card.render(parentElement);

      // Step 3: Define the review result data
      const reviewData = {
        interval: [1, 3],
        correctScore: [1, 1],
        isLearned: false,
        correctCount: 0,
        nextReviewTimestamp: [1724431378, 1724432227623, 1724432787962],
        nextReviewDate: [
          '2024-08-23T16:57:07.623Z',
          '2024-08-23T17:06:27.962Z',
        ],
        text1: '請問你是陳月美小姐嗎？',
        text2: 'Excuse me, are you Miss Chen Yuemei?',
        text3: 'Qǐngwèn nǐ shì Chén Yuèměi xiǎojiě ma?',
        text4: '請問你是陳月美小姐嗎？',
        audio: '1002明華：請問你是陳月美小姐嗎？.mp3',
        book: '1',
        lesson: '1',
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
