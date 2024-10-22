// src/comp/Card.ts
import { ReviewResult } from './reviewResult';
import { setSwitchButtonClicked } from '../utils/spacedRepetition'

export class Card {
  public book: string;
  public lesson: string;
  private audioSrc: string;
  public text1: string;
  public text2: string;
  public text3: string;
  public text4: string;
  private element: HTMLElement;
  private visibleTexts: { text1: boolean; text2: boolean; text3: boolean; text4: boolean };
  private audio: HTMLAudioElement | null = null;
  private static currentAudio: HTMLAudioElement | null = null; // Static property to track current audio
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly SWIPE_THRESHOLD = 50; // Minimum distance for a swipe
  private readonly SWIPE_RESTRAINT = 100; // Maximum vertical distance for a swipe

  constructor(
    book: string,
    lesson: string,
    audioSrc: string,
    text1: string,
    text2: string,
    text3: string,
    text4: string,
    visibleTexts: { text1: boolean; text2: boolean; text3: boolean; text4: boolean } = { text1: true, text2: true, text3: false, text4: false }
  ) {
    this.book = book;
    this.lesson = lesson;
    this.audioSrc = audioSrc;
    this.text1 = text1;
    this.text2 = text2;
    this.text3 = text3;
    this.text4 = text4;
    this.visibleTexts = visibleTexts;
    this.element = this.createCardElement();
    this.addSwipeListeners();
  }

  private createCardElement(): HTMLElement {
    const card = document.createElement('div');
    card.classList.add('card');

    const bookElement = document.createElement('div');
    bookElement.classList.add('card-book');
    bookElement.innerText = `Book: ${this.book}`;

    const lessonElement = document.createElement('div');
    lessonElement.classList.add('card-lesson');
    lessonElement.innerText = `Lesson: ${this.lesson}`;

    // Conditionally add text elements based on visibility settings
    if (this.visibleTexts.text1) {
      const text1Element = this.createTextElement(this.text1);
      text1Element.id = "text-dynamicDict";  // Add the id to the element
      card.appendChild(text1Element);
    }
    if (this.visibleTexts.text2) {
      const text2Element = this.createTextElement(this.text2);
      card.appendChild(text2Element);
    }
    if (this.visibleTexts.text3) {
      const text3Element = this.createTextElement(this.text3);
      card.appendChild(text3Element);
    }
    if (this.visibleTexts.text4) {
      const text4Element = this.createTextElement(this.text4);
      card.appendChild(text4Element);
    }

    card.appendChild(bookElement);
    card.appendChild(lessonElement);

    return card;
  }

  private createTextElement(text: string): HTMLElement {
    const textElement = document.createElement('div');
    textElement.classList.add('card-text');
    textElement.innerText = text;
    return textElement;
  }

  private toggleTextVisibility(): void {
    this.visibleTexts.text3 = !this.visibleTexts.text3; // Toggle visibility of text3
    this.element.innerHTML = ''; // Clear previous card content
    this.element.appendChild(this.createCardElement()); // Recreate and append the card element
  }

  public render(parent: HTMLElement): void {
    // Stop any currently playing audio
    if (Card.currentAudio) {
      Card.currentAudio.pause();
      Card.currentAudio = null; // Reset audio when stopped
      this.updateButtonIcon('play'); // Reset button icon to play
    }
  
    // Reset the element to the original card structure before appending
    this.element = this.createCardElement();
  
    // Clear previous content and append the card element
    parent.innerHTML = ''; // Clear previous card or review window
    parent.appendChild(this.element);
  
    // Set the play button click event to play the audio for this card
    this.updateAudioButtonListener();
  
    // Add the switch card text button listener
    this.addSwitchButtonListener();
  }
  

  private addSwitchButtonListener(): void {
    const switchButton = document.querySelector('.switch-card-text') as HTMLElement;
    if (switchButton) {
      switchButton.onclick = () => {
        this.toggleTextVisibility(); // Toggle text3 visibility when button is clicked
        setSwitchButtonClicked()
      };
    }
  }

  private addSwipeListeners(): void {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
  }

  private handleTouchStart(e: TouchEvent): void {
    const firstTouch = e.touches[0];
    this.touchStartX = firstTouch.clientX;
    this.touchStartY = firstTouch.clientY;
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (!this.touchStartX || !this.touchStartY) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = this.touchStartX - touchEndX;
    const deltaY = this.touchStartY - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && // Ensure the swipe is more horizontal than vertical
        Math.abs(deltaX) > this.SWIPE_THRESHOLD && // Ensure the swipe is long enough
        Math.abs(deltaY) < this.SWIPE_RESTRAINT) { // Ensure the swipe isn't too vertical
      if (deltaX > 0) {
        // Swiped left
        // this.goToNextCard();
      } else {
        // Swiped right
        // this.goToPreviousCard();
      }
    }

    // Reset values
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  // private goToNextCard(): void {
  //   console.log('Swiped left - Going to next card');
  //   // Implement your logic to go to the next card
  // }

  // private goToPreviousCard(): void {
  //   console.log('Swiped right - Going to previous card');
  //   // Implement your logic to go to the previous card
  // }

  private playAudio(): void {
    // Check if the audio is already playing
    if (Card.currentAudio) {
      Card.currentAudio.pause();
      Card.currentAudio = null; // Reset audio when stopped
      this.updateButtonIcon('play'); // Reset button icon to play
    } else {
      // Start playing the new audio
      this.audio = new Audio(this.audioSrc);
      console.log("🚀 ~ Card ~ playAudio ~ this.audioSrc:", this.audioSrc);
      this.audio.loop = true; // Enable looping
      this.audio.play().catch(error => console.error('Error playing audio:', error));
    
      Card.currentAudio = this.audio; // Keep track of currently playing audio
      this.updateButtonIcon('stop');
    
      // No need to reset the audio instance here since it's looping
      this.audio.addEventListener('ended', () => {
        Card.currentAudio = null; // Reset current audio on end
        this.updateButtonIcon('play'); // Reset button icon
      });
    }
  }

  // Helper function to update the button icon
  private updateButtonIcon(state: 'play' | 'stop'): void {
    const audioButton = document.querySelector('.audio-button') as HTMLElement;
    if (audioButton) {
      audioButton.innerHTML = state === 'play'
        ? '<i class="fas fa-play"></i>'
        : '<i class="fas fa-stop"></i>';
    }
  }

  private updateAudioButtonListener(): void {
    const audioButton = document.querySelector('.audio-button') as HTMLElement;
    if (audioButton) {
      audioButton.onclick = () => {
        this.playAudio();
      };
    }
  }

  public displayReviewResult(data: {
    interval: number[];
    correctScore: number[];
    isLearned: boolean;
    correctCount: number;
    nextReviewTimestamp: number[];
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    text5: string;
    audio: string;
    book: string;
    lesson: string;
  }): void {
    // Reset audio if playing
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
      this.updateButtonIcon('play');
    }
  
    // Update the audio source with the correct path
    this.audioSrc = `/audio/${data.audio}`; // Assuming the audio files are in the /audio directory
  
    // Render the review result temporarily but keep track of the original card content
    const reviewResult = new ReviewResult(data);
    reviewResult.render(this.element);
    
    // // Optionally: Add a button to exit the review and return to the original card
    // const returnToCardButton = document.createElement('button');
    // returnToCardButton.innerText = 'Back to Card';
    // returnToCardButton.onclick = () => {
    //   const cardContainer = document.getElementsByClassName('card');
    //   if (cardContainer) {
    //     this.render(cardContainer[0] as HTMLElement); // Re-render the original card if container exists
    //   } else {
    //     console.error('Card container not found.');
    //   }
    // };
    
    // this.element.appendChild(returnToCardButton);
    
  }
  
  
}
