// src/storage/localforage.ts
import localforage from 'localforage';

// Define the SpacedRepetitionData interface
export interface SpacedRepetitionData {
  interval: number[]; // Time intervals before the next review
  correctScore: number[]; // Score based on the number of correct answers
  isLearned: boolean; // Whether the card is learned or unlearned
  correctCount: number; // Number of correct reviews
  nextReviewTimestamp: number[];
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  audio: string;
  book: string;
  lesson: string;
}

// Function to get the current cardSpacedR map
export async function getCardSpacedRMap(): Promise<
  Record<number, SpacedRepetitionData>
> {
  const storedObj = await localforage.getItem<
    Record<number, SpacedRepetitionData>
  >('cardSpacedR');
  return storedObj || {};
}

// Function to save the updated cardSpacedR map
export async function saveCardSpacedRMap(
  obj: Record<number, SpacedRepetitionData>
): Promise<void> {
  await localforage.setItem('cardSpacedR', obj);
}

// Function to set card data
export async function setCardData(
  cardIndex: number,
  data: SpacedRepetitionData
): Promise<void> {
  const obj = await getCardSpacedRMap();
  obj[cardIndex] = data; // Add or update the entry
  await saveCardSpacedRMap(obj);
  console.log(`Data for card index ${cardIndex} stored successfully.`);
}

// Define default values for a new SpacedRepetitionData entry
const defaultData: SpacedRepetitionData = {
  interval: [],
  correctScore: [],
  isLearned: false,
  correctCount: 0,
  nextReviewTimestamp: [],
  text1: '',
  text2: '',
  text3: '',
  text4: '',
  text5: '',
  audio: '',
  book: '',
  lesson: '',
};

// Function to get or create a specific key-value pair in the map
export async function createCardData(
  cardIndex: number
): Promise<SpacedRepetitionData> {
  // Retrieve the whole map from localforage
  let map = await localforage.getItem<Record<number, SpacedRepetitionData>>(
    'cardSpacedR'
  );

  // Initialize map if it does not exist
  if (!map) {
    map = {}; // Create an empty map
    await localforage.setItem('cardSpacedR', map);
  }

  // Check if the specific key exists
  if (!(cardIndex in map)) {
    // If not, create a new entry with default values
    map[cardIndex] = defaultData;
    // Update the map in localforage
    await localforage.setItem('cardSpacedR', map);
  }

  // Return the data associated with the key
  return map[cardIndex];
}

// Function to retrieve a specific key-value pair from the map
export async function getCardData(
  cardIndex: number
): Promise<SpacedRepetitionData> {
  // Retrieve the whole map from localforage
  const map = await localforage.getItem<Record<number, SpacedRepetitionData>>(
    'cardSpacedR'
  );

  // If map does not exist, initialize it
  if (!map) {
    return defaultData; // If the map does not exist, return default data
  }

  // Return the value associated with the key, or default data if the key does not exist
  return map[cardIndex] || defaultData;
}

export async function saveCardData(
  cardIndex: number,
  data: SpacedRepetitionData
): Promise<void> {
  // Retrieve the whole map from localforage
  let map = await localforage.getItem<Record<number, SpacedRepetitionData>>(
    'cardSpacedR'
  );

  // Initialize the map if it does not exist
  if (!map) {
    console.log('No map in localForage, initializing a new map.');
    map = {}; // Initialize the map as an empty object
  }

  // Update the map with the new data for the specified key
  map[cardIndex] = data;

  // Save the updated map back to localforage
  await localforage.setItem('cardSpacedR', map);
}
