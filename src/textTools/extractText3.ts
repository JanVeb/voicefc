import { loadCSV, csvData, CSVRow } from '../utils/csvLoader';

export async function readCSVAndLogText3(filePath: string) {
  // Load the CSV file (this will update the global csvData)
  await loadCSV(filePath);

  // Create a string that contains each text_3 value on a new line
  const output = csvData
    .map((row: CSVRow) => row.text_3)
    .filter((text) => text) // filter out any undefined or empty values
    .join('\n'); // join all entries with a new line

  // Log the formatted string, which can now be easily copied
  console.log(output);
}

// Example usage
readCSVAndLogText3('path/to/your/file.csv');
