
// // Define the dictionary for translations
// const dictionary: { [key: string]: string } = {
//     "陳月美": "Chén Yuèměi - a woman from Vietnam",
//     "李明華": "Lǐ Mínghuá - a man from Taiwan",
//     "王開文": "Wáng Kāiwén - a man from the US",
//     "你": "you",
//     "來": "to come",
//     "是": "to be",
//     "小姐": "Miss, Ms",
//     "嗎": "sentence final particle",
//     "接": "to pick sb up",
//     "我們": "we, us",
//     "我": "I, me",
//     "這": "this",
//     "先生": "Mr",
//     "好": "fine, well",
//     "姓": "to be surnamed",
//     "叫": "to be called",
//     "你們": "you (plural)",
//     "臺灣": "Taiwan",
//     "歡迎": "Welcome",
//     "請問": "May I ask you...",
//     "是的": "Yes",
//     "謝謝": "Thank you",
//     "不客氣": "You're welcome",
//     "你好": "Hello, How are you?",
//     "歡迎你來臺灣": "hello"
//   };
  
//   document.addEventListener("DOMContentLoaded", () => {
//     // Create a MutationObserver to detect when the #text-dynamicDict is added
//     const observer = new MutationObserver(() => {
//       const textElement = document.getElementById("text-dynamicDict");
  
//       if (textElement) {
//         console.log("🚀 ~ Element found:", textElement);
  
//         let touchTimer: any;
  
//         // For touch events
//         if (typeof TouchEvent !== "undefined") {
//           textElement.addEventListener("touchstart", (event: TouchEvent) => {
//             console.log("Touchstart event fired");
//             touchTimer = setTimeout(() => {
//               const selectedWord = getWordAtPosition(event);
//               console.log("Selected word:", selectedWord);
//               if (selectedWord) {
//                 showDictionaryPopup(selectedWord, event);
//               }
//             }, 100);
//           });
  
//           textElement.addEventListener("touchend", () => {
//             clearTimeout(touchTimer);
//             console.log("Touchend event fired");
//           });
//         }
  
//         // For mouse events
//         textElement.addEventListener("mousedown", (event: MouseEvent) => {
//           console.log("Mousedown event fired");
//           touchTimer = setTimeout(() => {
//             const selectedWord = getWordAtPosition(event);
//             console.log("Selected word:", selectedWord);
//             if (selectedWord) {
//               showDictionaryPopup(selectedWord, event);
//             }
//           }, 50);
//         });
  
//         // textElement.addEventListener("mouseup", () => {
//         //   clearTimeout(touchTimer);
//         //   console.log("Mouseup event fired");
//         // });
  
//         // Stop observing once the element is found
//         observer.disconnect();
//       }
//     });
  
//     // Start observing the body for any changes (including when children are added)
//     observer.observe(document.body, { childList: true, subtree: true });
//   });
  
//   // Function to get the word at the clicked or touched position
//   function getWordAtPosition(event: TouchEvent | MouseEvent): string | null {
//     let x = 0, y = 0;
  
//     // Get coordinates based on the event type
//     if (typeof TouchEvent !== "undefined" && event instanceof TouchEvent) {
//       x = event.touches[0]?.clientX || 0;
//       y = event.touches[0]?.clientY || 0;
//     } else if (event instanceof MouseEvent) {
//       x = event.clientX;
//       y = event.clientY;
//     }
  
//     let range: Range | null = null;
//     const doc = document as any; // Type assertion to allow experimental APIs
  
//     if (doc.caretPositionFromPoint) {
//       const pos = doc.caretPositionFromPoint(x, y);
//       if (pos) {
//         range = document.createRange();
//         range.setStart(pos.offsetNode, pos.offset);
//         range.setEnd(pos.offsetNode, pos.offset);
//       }
//     } else if (document.caretRangeFromPoint) {
//       range = document.caretRangeFromPoint(x, y);
//     }
  
//     if (range) {
//       const text = range.startContainer.textContent || "";
//       const startOffset = range.startOffset;
  
//       // Extract single character at the caret position
//       if (startOffset < text.length) {
//         let charAtPosition = text.charAt(startOffset).trim(); // The character user clicked on
  
//         // Now try to combine the character with neighbors to form a word or phrase
//         let word = charAtPosition;
        
//         // Look for characters to the left
//         if (startOffset > 0) {
//           let leftChar = text.charAt(startOffset - 1).trim();
//           if (dictionary[leftChar + charAtPosition]) {
//             word = leftChar + charAtPosition;
//           }
//         }
        
//         // Look for characters to the right
//         if (startOffset < text.length - 1) {
//           let rightChar = text.charAt(startOffset + 1).trim();
//           if (dictionary[charAtPosition + rightChar]) {
//             word = charAtPosition + rightChar;
//           }
//         }
  
//         // Also, try to find a full phrase (left + middle + right)
//         if (startOffset > 0 && startOffset < text.length - 1) {
//           let leftChar = text.charAt(startOffset - 1).trim();
//           let rightChar = text.charAt(startOffset + 1).trim();
//           if (dictionary[leftChar + charAtPosition + rightChar]) {
//             word = leftChar + charAtPosition + rightChar;
//           }
//         }
  
//         // Return the word/character we think is the full word
//         console.log("🚀 ~ getWordAtPosition ~ word:", word)
//         return word;
//       }

//     }
  
//     return null;
//   }
  
  
  
//   // Function to show the dictionary popup
//   function showDictionaryPopup(word: string, event: TouchEvent | MouseEvent) {
//     const translation = dictionary[word] || "No translation available";
//     console.log("🚀 ~ showDictionaryPopup ~ dictionary:", dictionary)
  
//     // Create the popup element
//     const popup = document.createElement("div");
//     popup.classList.add("popup");
  
//     // Create the content for the popup
//     const content = document.createElement("div");
//     content.innerHTML = translation; // Ensure the translation text is displayed
  
//     // Append content to the popup
//     popup.appendChild(content);
  
//     // Add styling to the popup
//     // popup.style.position = "absolute";
//     // popup.style.backgroundColor = "black";
//     // popup.style.border = "1px solid grey";
//     // popup.style.color = "white";
//     // popup.style.padding = "10px";
//     // popup.style.borderRadius = "5px";
//     // popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
//     // popup.style.zIndex = "9999"; // Ensure it's on top

  
//     // Ensure the popup is appended to the DOM
//     document.body.appendChild(popup);
  
//     // Position the popup near the click/touch point
//     let x = 0, y = 0;
//     if (event instanceof TouchEvent) {
//       x = event.touches[0]?.clientX || 0;
//       y = event.touches[0]?.clientY || 0;
//     } else if (event instanceof MouseEvent) {
//       x = event.clientX;
//       y = event.clientY;
//     }
  
//     // Offset the popup slightly from the click/touch position
//     popup.style.left = `${x + 10}px`;
//     popup.style.top = `${y + 10}px`;
  
//     // Log the position for debugging
//     console.log(`Popup position: (${popup.style.left}, ${popup.style.top})`);
  
//     // Close popup if clicked outside
//     const closePopup = (event: MouseEvent | TouchEvent) => {
//       const target = event.target as HTMLElement;
//       if (!popup.contains(target)) {
//         popup.remove();
//         document.removeEventListener("mousedown", closePopup);
//         document.removeEventListener("touchstart", closePopup);
//       }
//     };
  
//     // Add event listeners for outside click/touch
//     document.addEventListener("mousedown", closePopup);
//     document.addEventListener("touchstart", closePopup);
  
//     // Remove the popup after 3 seconds if not clicked outside
//     setTimeout(() => {
//       if (popup.parentElement) {
//         popup.remove();
//         document.removeEventListener("mousedown", closePopup);
//         document.removeEventListener("touchstart", closePopup);
//       }
//     }, 3000);
//   }
  