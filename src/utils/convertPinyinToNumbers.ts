export function convertPinyin(input: string): string {
    // Mapping of tone-marked vowels to their base vowel and corresponding tone number
    const pinyinToneMap: { [key: string]: { base: string; tone: string } } = {
      'ā': { base: 'a', tone: '1' }, 'á': { base: 'a', tone: '2' }, 'ǎ': { base: 'a', tone: '3' }, 'à': { base: 'a', tone: '4' },
      'ē': { base: 'e', tone: '1' }, 'é': { base: 'e', tone: '2' }, 'ě': { base: 'e', tone: '3' }, 'è': { base: 'e', tone: '4' },
      'ī': { base: 'i', tone: '1' }, 'í': { base: 'i', tone: '2' }, 'ǐ': { base: 'i', tone: '3' }, 'ì': { base: 'i', tone: '4' },
      'ō': { base: 'o', tone: '1' }, 'ó': { base: 'o', tone: '2' }, 'ǒ': { base: 'o', tone: '3' }, 'ò': { base: 'o', tone: '4' },
      'ū': { base: 'u', tone: '1' }, 'ú': { base: 'u', tone: '2' }, 'ǔ': { base: 'u', tone: '3' }, 'ù': { base: 'u', tone: '4' },
      'ǖ': { base: 'ü', tone: '1' }, 'ǘ': { base: 'ü', tone: '2' }, 'ǚ': { base: 'ü', tone: '3' }, 'ǜ': { base: 'ü', tone: '4' },
      'ü': { base: 'ü', tone: '5' },
      'Ā': { base: 'A', tone: '1' }, 'Á': { base: 'A', tone: '2' }, 'Ǎ': { base: 'A', tone: '3' }, 'À': { base: 'A', tone: '4' },
      'Ē': { base: 'E', tone: '1' }, 'É': { base: 'E', tone: '2' }, 'Ě': { base: 'E', tone: '3' }, 'È': { base: 'E', tone: '4' },
      'Ī': { base: 'I', tone: '1' }, 'Í': { base: 'I', tone: '2' }, 'Ǐ': { base: 'I', tone: '3' }, 'Ì': { base: 'I', tone: '4' },
      'Ō': { base: 'O', tone: '1' }, 'Ó': { base: 'O', tone: '2' }, 'Ǒ': { base: 'O', tone: '3' }, 'Ò': { base: 'O', tone: '4' },
      'Ū': { base: 'U', tone: '1' }, 'Ú': { base: 'U', tone: '2' }, 'Ǔ': { base: 'U', tone: '3' }, 'Ù': { base: 'U', tone: '4' },
      'Ǖ': { base: 'Ü', tone: '1' }, 'Ǘ': { base: 'Ü', tone: '2' }, 'Ǚ': { base: 'Ü', tone: '3' }, 'Ǜ': { base: 'Ü', tone: '4' },
      'Ü': { base: 'Ü', tone: '5' },
    };
  
    // Function to process each word
    function processWord(word: string): string {
      // Regular expression to split pinyin into syllables
      const syllableRegex = /([bpmfdtnlgkhjqxrzcsyw]{0,3}[aeiouüvĀÁǍÀāáǎàĒÉĚÈēéěèĪÍǏÌīíǐìŌÓǑÒōóǒòŪÚǓÙūúǔùǕǗǙǛǖǘǚǜüÜ]{1,3}(?:ng|n)?)/gi;
  
      // Use matchAll to get all syllables
      const matches = word.matchAll(syllableRegex);
  
      let resultWord = '';
      let lastIndex = 0;
  
      for (const match of matches) {
        const index = match.index!;
        const syllable = match[0];
  
        // Append any text before this syllable (e.g., punctuation)
        resultWord += word.substring(lastIndex, index);
  
        // Process the syllable
        let toneNumber = '5'; // Default tone number
        let processedSyllable = '';
        for (const char of syllable) {
          if (pinyinToneMap[char]) {
            processedSyllable += pinyinToneMap[char].base;
            toneNumber = pinyinToneMap[char].tone;
          } else {
            processedSyllable += char;
          }
        }
        processedSyllable += toneNumber;
  
        // Append the processed syllable
        resultWord += processedSyllable;
  
        // Update lastIndex to the end of the current syllable
        lastIndex = index + syllable.length;
      }
  
      // Append any remaining text after the last syllable
      resultWord += word.substring(lastIndex);
  
      return resultWord;
    }
  
    // Split the input into tokens (words, punctuation, spaces)
    const tokens = input.split(/(\s+)/);
    const resultTokens = tokens.map((token) => {
      // Return whitespace as is
      if (/^\s+$/.test(token)) {
        return token;
      } else {
        // Check if token is punctuation
        if (/^[^\w]+$/.test(token)) {
          return token;
        } else {
          return processWord(token);
        }
      }
    });
    return resultTokens.join('');
  }
  
  // // Example usage:
  // const input = `huānyíng nǐ lái táiwān
  // Qǐngwèn nǐ shì Chén Yuèměi xiǎojiě ma?
  // Shìde. Xièxie nǐ lái jiē wǒmen.`;
  
  // console.log(convertPinyin(input));
  