import { dictionaryArray } from '../data/dict';

document.body.addEventListener("mousedown", (event: MouseEvent) => {
    const textElement = document.getElementById("text-dynamicDict");
    if (textElement && textElement.contains(event.target as Node)) {
      let touchTimer: any;

      // For touch events
      if (typeof TouchEvent !== "undefined") {
        textElement.addEventListener("touchstart", (event: TouchEvent) => {
          touchTimer = setTimeout(() => {
            const selectedWord = getWordAtPosition(event);
            if (selectedWord) {
              showDictionaryPopup(selectedWord, event);
            }
          }, 100);
        });

        textElement.addEventListener("touchend", () => {
          clearTimeout(touchTimer);
        });
      }

      // For mouse events
      textElement.addEventListener("mousedown", (event: MouseEvent) => {
        touchTimer = setTimeout(() => {
          const selectedWord = getWordAtPosition(event);
          if (selectedWord) {
            showDictionaryPopup(selectedWord, event);
          }
        }, 50);
      });

    }
  });

// Function to get the word at the clicked or touched position
function getWordAtPosition(event: TouchEvent | MouseEvent): string | null {
    let x = 0, y = 0;
  
    // Get coordinates based on the event type
    if (event instanceof TouchEvent) {
      x = event.touches[0]?.clientX || 0;
      y = event.touches[0]?.clientY || 0;
    } else if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    }
  
    let range: Range | null = null;
    const doc = document as any; // Type assertion to allow experimental APIs
  
    if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(x, y);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.setEnd(pos.offsetNode, pos.offset);
      }
    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    }
  
    if (range) {
      const text = range.startContainer.textContent || "";
      const startOffset = range.startOffset;
  
      // Extract single or multiple characters at the caret position
      if (startOffset < text.length) {
        let word = "";
  
        // Get the current character
        word += text.charAt(startOffset).trim();
  
        // Optionally, try to include adjacent characters to form a longer word
        if (startOffset > 0) {
          word = text.charAt(startOffset - 1).trim() + word;  // Add left character
        }
        if (startOffset < text.length - 1) {
          word += text.charAt(startOffset + 1).trim();  // Add right character
        }
        return word.trim();
      }
    }
  
    return null;
  }
  

  
  // Function to remove punctuation and clean the word before searching
function cleanWord(word: string): string {
    // This regex removes anything that isn't a Chinese character, letter, or number
    return word.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').trim();
  }
  
// Function to find translation for multi-character words or single characters
function findTranslation(word: string): string {
    // Clean the word by removing punctuation
    const cleanedWord = cleanWord(word);
    
    // 1. First, try to find the full word in the dictionary
    for (const entry of dictionaryArray) {
      if (entry[0] === cleanedWord) {
        return `${entry[0]} ${entry[2]}`; // Return only Chinese character and translation as is
      }
    }
  
    // 2. If the full word is not found, try looking up each character
    let charResults: string[] = [];
    for (const char of cleanedWord) {
      const charTranslation = findTranslationForChar(char);
      if (charTranslation) {
        charResults.push(`${char} ${charTranslation}`);
      }
    }
  
    // If we found translations for individual characters, return those (with new lines)
    if (charResults.length > 0) {
      return charResults.join('<br>'); // Use <br> to ensure new lines in HTML
    }
  
    // 3. Finally, if neither the full word nor individual characters are found, return related words
    let relatedWords: string[] = [];
    for (const entry of dictionaryArray) {
      if (entry[0].includes(cleanedWord)) {
        relatedWords.push(`${entry[0]} ${entry[2]}`); // Return only Chinese character and translation as is
      }
    }
  
    if (relatedWords.length > 0) {
      return relatedWords.join('<br>'); // Use <br> to ensure new lines in HTML
    }
  
    // 4. If no match at all, return no translation available
    return "No translation available";
  }
  
  // Helper function to find translation for a single character
  function findTranslationForChar(char: string): string {
    for (const entry of dictionaryArray) {
      if (entry[0] === char) {
        return entry[2];  // Return translation as is
      }
    }
    return "";
  }
  


// Function to show the dictionaryArray popup
function showDictionaryPopup(word: string, event: TouchEvent | MouseEvent) {
  const translation = findTranslation(word); // Use the findTranslation function to search in dictionaryArray
  // Create the popup element
  const popup = document.createElement("div");
  popup.classList.add("popup");

  // Create the content for the popup
  const content = document.createElement("div");
  content.innerHTML = translation; // Ensure the translation text is displayed

  // Append content to the popup
  popup.appendChild(content);

  // Ensure the popup is appended to the DOM
  document.body.appendChild(popup);

  // Position the popup near the click/touch point
  let x = 0, y = 0;
  if (event instanceof TouchEvent) {
    x = event.touches[0]?.clientX || 0;
    y = event.touches[0]?.clientY || 0;
  } else if (event instanceof MouseEvent) {
    x = event.clientX;
    y = event.clientY;
  }

  // Offset the popup slightly from the click/touch position
  popup.style.left = `${x + 10}px`;
  popup.style.top = `${y + 10}px`;

  // Close popup if clicked outside
  const closePopup = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    if (!popup.contains(target)) {
      popup.remove();
      document.removeEventListener("mousedown", closePopup);
      document.removeEventListener("touchstart", closePopup);
    }
  };

  // Add event listeners for outside click/touch
  document.addEventListener("mousedown", closePopup);
  document.addEventListener("touchstart", closePopup);

  // Remove the popup after 3 seconds if not clicked outside
  setTimeout(() => {
    if (popup.parentElement) {
      popup.remove();
      document.removeEventListener("mousedown", closePopup);
      document.removeEventListener("touchstart", closePopup);
    }
  }, 3000);
}
