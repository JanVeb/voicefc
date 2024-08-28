// src/utils/csvLoader.ts
import Papa from 'papaparse';

export interface CSVRow {
  book: string;
  lesson: string;
  audio_1: string;
  text_1: string;
  text_2: string;
  text_3: string;
  text_4: string;
}

// Constant to hold the parsed CSV data
export let csvData: CSVRow[] = [];

// Function to load CSV and store the data in the constant
export async function loadCSV(filePath: string): Promise<void> {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    Papa.parse<CSVRow>(text, {
      header: true,
      complete: (results: Papa.ParseResult<CSVRow>) => {
        csvData = results.data;
      },
      error: (error: Error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}
