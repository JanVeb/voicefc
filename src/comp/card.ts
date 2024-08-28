// src/comp/Card.ts
import { ReviewResult } from './reviewResult';

export class Card {
  private book: string;
  private lesson: string;
  private audioSrc: string;
  public text1: string;
  private text2: string;
  private text3: string;
  private text4: string;
  private element: HTMLElement;

  constructor(
    book: string,
    lesson: string,
    audioSrc: string,
    text1: string,
    text2: string,
    text3: string,
    text4: string
  ) {
    this.book = book;
    this.lesson = lesson;
    this.audioSrc = audioSrc;
    this.text1 = text1;
    this.text2 = text2;
    this.text3 = text3;
    this.text4 = text4;
    this.element = this.createCardElement();
    this.addEventListeners();
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

    const text1Element = document.createElement('div');
    text1Element.classList.add('card-text');
    text1Element.innerText = this.text1;

    const text2Element = document.createElement('div');
    text2Element.classList.add('card-text');
    text2Element.innerText = this.text2;

    const text3Element = document.createElement('div');
    text3Element.classList.add('card-text');
    text3Element.innerText = this.text3;

    const text4Element = document.createElement('div');
    text4Element.classList.add('card-text');
    text4Element.innerText = this.text4;

    const audioButton = document.createElement('button');
    audioButton.classList.add('audio-button');
    audioButton.innerText = 'Play Audio';

    card.appendChild(bookElement);
    card.appendChild(lessonElement);
    card.appendChild(text1Element);
    card.appendChild(text2Element);
    card.appendChild(text3Element);
    card.appendChild(text4Element);
    card.appendChild(audioButton);

    return card;
  }

  private addEventListeners(): void {
    const audioButton = this.element.querySelector(
      '.audio-button'
    ) as HTMLElement;
    audioButton.addEventListener('click', () => this.playAudio());
  }

  private playAudio(): void {
    const audio = new Audio(this.audioSrc);
    audio.play();
  }

  public render(parent: HTMLElement): void {
    parent.innerHTML = ''; // Clear previous card
    parent.appendChild(this.element);
  }

  public displayReviewResult(data: {
    interval: number[];
    correctScore: number[];
    isLearned: boolean;
    correctCount: number;
    nextReviewTimestamp: number[];
    nextReviewDate: string[];
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    audio: string;
    book: string;
    lesson: string;
  }): void {
    const reviewResult = new ReviewResult(data);
    reviewResult.render(this.element);
  }
}
