// // src/utils/levenshteinDistance.ts
// export function LevenshteinDistance(a: string, b: string): number {
//   const matrix: number[][] = [];

//   // Initialize the first row and column of the matrix
//   for (let i = 0; i <= b.length; i++) {
//     matrix[i] = [i];
//   }
//   for (let j = 0; j <= a.length; j++) {
//     matrix[0][j] = j;
//   }

//   // Fill the matrix
//   for (let i = 1; i <= b.length; i++) {
//     for (let j = 1; j <= a.length; j++) {
//       if (b.charAt(i - 1) === a.charAt(j - 1)) {
//         matrix[i][j] = matrix[i - 1][j - 1];
//       } else {
//         matrix[i][j] = Math.min(
//           matrix[i - 1][j - 1] + 1, // substitution
//           matrix[i][j - 1] + 1, // insertion
//           matrix[i - 1][j] + 1 // deletion
//         );
//       }
//     }
//   }

//   return matrix[b.length][a.length];
// }

// // export function LevenshteinCoeficient(a: string, b: string): number {
// //   const distance = LevenshteinDistance(a, b);
// //   const maxLength = Math.max(a.length, b.length);
// //   const correctCharacters = maxLength - distance;
// //   const correctCoeficient = correctCharacters / maxLength;
// //   return correctCoeficient;
// // }

// export function LevenshteinCoeficient(a: string, b: string): string {
//   const distance = LevenshteinDistance(a, b);
//   const maxLength = Math.max(a.length, b.length);
//   const correctCharacters = maxLength - distance;
//   const correctCoeficient = correctCharacters / maxLength;

//   let output = `Levenshtein Coefficient: ${correctCoeficient.toFixed(2)}<br/>`;
//   output += `Correct Answer: <span style="color: #000">${a}</span><br/>`;
//   output += `Your Answer: `;

//   let i = 0;
//   for (const char of b) {
//     if (char === a[i]) {
//       output += `<span style="color: #0f0">${char}</span>`; // green for correct
//     } else {
//       output += `<span style="color: #f00">${char}</span>`; // red for incorrect
//     }
//     i++;
//   }

//   return output;
// }
// const correctAnswer = "歡迎你們來台灣";
// const userAnswer = "歡迎你們來臺灣";
// const output = LevenshteinCoeficient(correctAnswer, userAnswer);
// console.log(output);


// // 妳您你 台臺

// Define the equivalence map
const equivalenceMap: { [key: string]: Set<string> } = {
  '妳': new Set(['你', '您']),
  '您': new Set(['你', '妳']),
  '你': new Set(['妳', '您']),
  '台': new Set(['臺']),
  '臺': new Set(['台'])
};

// Function to check character equivalence
function isEquivalent(a: string, b: string): boolean {
  return equivalenceMap[a]?.has(b) || equivalenceMap[b]?.has(a) || a === b;
}

export function preLefNormalisePunct(userResponse: string, target: string) {
  const removeUserPunct = removeAllPunctuationAndSpaces(userResponse);
  const addPunToUser = insertPunctuation(target, removeUserPunct);
  const result = highlightLevenshtein(target, addPunToUser);
  return result;
}

export function highlightLevenshtein(targetText: string, userResponse: string): { coefficient: number, text: string } {
  const len1 = targetText.length;
  const len2 = userResponse.length;

  // Initialize the matrix
  const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  // Fill in base cases
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  // Compute the matrix values
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const targetChar = targetText[i - 1];
      const userChar = userResponse[j - 1];
      const cost = isEquivalent(targetChar, userChar) ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  // Backtrace to find differences and highlight them
  let highlighteduserResponse = "";
  let i = len1;
  let j = len2;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && isEquivalent(targetText[i - 1], userResponse[j - 1])) {
      // If characters are equivalent, no highlight needed
      highlighteduserResponse = userResponse[j - 1] + highlighteduserResponse;
      i--;
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j] === matrix[i - 1][j] + 1)) {
      // Deletion in targetText (skip character in targetText)
      i--;
    } else if (j > 0 && (i === 0 || matrix[i][j] === matrix[i][j - 1] + 1)) {
      // Insertion in userResponse (highlight new character in userResponse)
      highlighteduserResponse = `<span style="color: red;">${userResponse[j - 1]}</span>` + highlighteduserResponse;
      j--;
    } else if (i > 0 && j > 0 && matrix[i][j] === matrix[i - 1][j - 1] + 1) {
      // Substitution (highlight character in userResponse)
      highlighteduserResponse = `<span style="color: red;">${userResponse[j - 1]}</span>` + highlighteduserResponse;
      i--;
      j--;
    }
  }
  
  // Calculate the Levenshtein distance
  const distance = matrix[len1][len2];

  // Calculate the similarity coefficient: 1 - (distance / max(lengths))
  const maxLength = Math.max(len1, len2);
  const coefficient = maxLength === 0 ? 1 : 1 - (distance / maxLength);

  return { coefficient, text: highlighteduserResponse };
}


function insertPunctuation(original: string, withoutPunctuation: string): string {
  
  const result: string[] = [];
  let wpIndex = 0;
  let punctuationsAdded = 0;

  // Regex to match all punctuation marks
  const punctuationRegex = /[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~。，、？！《》“”；‘’]/g;
  
  // Count total punctuation marks in the original string
  const originalPunctuationCount = (original.match(punctuationRegex) || []).length;

  // First pass to add characters and punctuation
  for (const char of original) {
    if (punctuationRegex.test(char)) {
      // If it's a punctuation mark, check if we can still add it
      if (wpIndex + punctuationsAdded < withoutPunctuation.length + originalPunctuationCount) {
        result.push(char);
        punctuationsAdded++;
      }
    } else if (wpIndex < withoutPunctuation.length) {
      // If it's not a punctuation mark and we have characters left to add
      result.push(withoutPunctuation[wpIndex]);
      wpIndex++;
    } else {
      // If we've exhausted characters from withoutPunctuation, stop adding further punctuation
      break;
    }
  }

  // If withoutPunctuation is longer, append any remaining characters
  if (wpIndex < withoutPunctuation.length) {
    result.push(...withoutPunctuation.slice(wpIndex));
  }

  const finalResult = result.join('');
  return finalResult;
}








function removeAllPunctuationAndSpaces(text: string) {
  const removePun = text.replace(/[^\p{L}\p{N}]/gu, ''); // Remove all punctuation and spaces
  return removePun;
}