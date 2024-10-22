import { dictionaryArray } from '../data/dict';
import { currentCard } from '../comp/cardUI';
import { Card } from '../comp/card';

// Assuming the card object is already instantiated somewhere in your app and available in this scope

document.body.addEventListener("mousedown", (event: MouseEvent) => {
    const textElement = document.getElementById("text-dynamicDict");

    // Ensure textElement exists
    if (textElement && textElement.contains(event.target as Node)) {
        
        let touchTimer: any;

        // For touch events
        if (typeof TouchEvent !== "undefined") {
            textElement.addEventListener("touchstart", (event: TouchEvent) => {
                touchTimer = setTimeout(() => {
                    const charIndex = getCharIndexAtPosition(event, textElement); // This function will handle char detection
                    if (charIndex !== null && currentCard) {
                        showDictionaryPopup(charIndex, event, currentCard); // Pass the existing cardInstance
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
                const charIndex = getCharIndexAtPosition(event, textElement); // This function will handle char detection
                if (charIndex !== null && currentCard) {
                    showDictionaryPopup(charIndex, event, currentCard); // Pass the existing cardInstance
                }
            }, 50);
        });
    }
});


// Function to show the popup based on the clicked character index
function showDictionaryPopup(
    charIndex: number,
    event: TouchEvent | MouseEvent,
    currentCardData: Card
) {
    // Safely access text1 and other properties of the existing card instance
    if (!currentCardData || !currentCardData.text1 || !currentCardData.text3) {
        console.error('Card instance or text1/text3 is not properly initialized.');
        return;
    }

    const text1 = currentCardData.text1;
    const text3 = currentCardData.text3;

    // Ensure charIndex is within the bounds of text1
    if (charIndex < 0 || charIndex >= text1.length) {
        console.error('Character index is out of bounds.');
        return;
    }

    const character = text1[charIndex];

    // Clean Chinese text to get only Chinese characters
    const cleanText1 = cleanWord(text1);
    const chineseChars = cleanText1.split('');

    // Split pinyin text into pinyin words
    const pinyinWords = text3.trim().split(/\s+/);

    // Build an array mapping pinyin words to Chinese characters
    const mapping = [];
    let charIndexInChinese = 0;

    for (const pinyinWord of pinyinWords) {
        // Remove punctuation from the pinyin word
        const cleanPinyinWord = pinyinWord.replace(/[，。！？；：、,.;!?]/g, '');

        // Split the pinyin word into syllables
        const syllables = splitPinyinWordIntoSyllables(cleanPinyinWord);
        const numSyllables = syllables.length;

        // Get the corresponding Chinese characters
        const chineseCharsForWord = chineseChars.slice(
            charIndexInChinese,
            charIndexInChinese + numSyllables
        );

        // Ensure we have enough Chinese characters
        if (chineseCharsForWord.length !== numSyllables) {
            console.error(
                `Mismatch between number of syllables and characters for pinyin word: ${pinyinWord}`
            );
            return;
        }

        // Build the mapping
        mapping.push({
            pinyinWord: cleanPinyinWord,
            startIndex: charIndexInChinese,
            endIndex: charIndexInChinese + numSyllables - 1,
            chineseChars: chineseCharsForWord.join('')
        });

        charIndexInChinese += numSyllables;
    }

    // Map the charIndex to syllableIndex (excluding punctuation)
    let syllableIndex = -1;
    for (let i = 0; i <= charIndex; i++) {
        if (!isSeparator(text1[i])) {
            syllableIndex++;
        }
    }

    // Find the mapping that contains the syllableIndex
    const mappingItem = mapping.find(
        item => syllableIndex >= item.startIndex && syllableIndex <= item.endIndex
    );

    if (!mappingItem) {
        console.error('Could not find pinyin word for the clicked character.');
        return;
    }

    // Create the popup element
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Show the content
    const content = document.createElement('div');
    content.innerHTML = `Character: ${character}<br>Pinyin Word: ${findTranslation(mappingItem.pinyinWord)}`;
    popup.appendChild(content);

    // Ensure the popup is appended to the DOM
    document.body.appendChild(popup);

    // Position the popup near the click/touch point
    let x = 0,
        y = 0;
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
            document.removeEventListener('mousedown', closePopup);
            document.removeEventListener('touchstart', closePopup);
        }
    };

    // Add event listeners for outside click/touch
    document.addEventListener('mousedown', closePopup);
    document.addEventListener('touchstart', closePopup);

    // Remove the popup after 3 seconds if not clicked outside
    // setTimeout(() => {
    //     if (popup.parentElement) {
    //         popup.remove();
    //         document.removeEventListener('mousedown', closePopup);
    //         document.removeEventListener('touchstart', closePopup);
    //     }
    // }, 3000);
}

// Function to split a pinyin word into syllables
function splitPinyinWordIntoSyllables(word: string): string[] {
    // Remove punctuation from the word
    const cleanWord = word.replace(/[，。！？；：、,.;!?]/g, '');

    // Regular expression to match pinyin syllables
    const syllableRegex = /(?:(?:[bpmfdtnlgkhjqxrywzcs]|[ZCS]h|[zcs]h|[ZCS]H)?(?:h|H)?)(?:[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜüaeiouAEIOUÜ]{1,3})(?:n?g?|N?G?)[1-5]?/g;

    const syllables: string[] = [];
    let match: RegExpExecArray | null;

    // Use regex to find all syllables in the word
    while ((match = syllableRegex.exec(cleanWord)) !== null) {
        syllables.push(match[0]);
    }

    if (syllables.length > 0) {
        return syllables;
    } else {
        console.error(`Failed to parse syllables from pinyin word: ${word}`);
        return [];
    }
}


// Function to remove punctuation and clean the word
function cleanWord(word: string): string {
    // This regex removes any character that is not a Chinese character, letter, or number
    return word.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
}

// Function to check if a character is a separator (space or punctuation)
function isSeparator(char: string): boolean {
    // Define separators as spaces and common punctuation marks
    return /\s|[，。！？；：、,.;!?]/.test(char);
}


  
// Function to get the character index at the clicked or touched position
function getCharIndexAtPosition(event: TouchEvent | MouseEvent, textElement: HTMLElement): number | null {
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
      const text = textElement.textContent || "";
      const startOffset = range.startOffset;
  
      // Return the index of the clicked/touched character
      return startOffset;
    }
  
    return null;
  }
  
  
// Function to find translation for multi-character words or single characters
function findTranslation(word: string): string {
    console.log("🚀 ~ findTranslation ~ word:", word);
    // Clean the word by removing punctuation (if needed)
    // const cleanedWord = cleanWord(word);
    // console.log("🚀 ~ findTranslation ~ cleanedWord:", cleanedWord);
  
    // Normalize the word to lowercase
    const normalizedWord = word.toLowerCase();
  
    // 1. First, try to find the full word in the dictionary
    for (const entry of dictionaryArray) {
      if (entry[1].toLowerCase() === normalizedWord) {
        return `${entry[0]} ${entry[2]}`; // Return only Chinese character and translation as is
      }
    }
  
    // 2. If the full word is not found, try looking up each character
    let charResults: string[] = [];
    for (const char of word) {
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
      if (entry[1].toLowerCase().includes(normalizedWord)) {
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
    const normalizedChar = char.toLowerCase();
    for (const entry of dictionaryArray) {
      if (entry[1].toLowerCase() === normalizedChar) {
        return entry[2];  // Return translation as is
      }
    }
    return "";
  }
  