// src/comp/ReviewResult.ts
export class ReviewResult {
  private data: {
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
  };
  private element: HTMLElement;

  constructor(data: {
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
  }) {
    this.data = data;
    this.element = this.createResultElement();
  }


  private createResultElement(): HTMLElement {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('review-result');

    const text5Element = document.createElement('div');
    text5Element.classList.add('result-text5');
    text5Element.innerHTML = `${this.data.text5}`;

    const text4Element = document.createElement('div');
    text4Element.classList.add('result-text4');
    text4Element.innerText = `${this.data.text4}`;

    const text3Element = document.createElement('div');
    text3Element.classList.add('result-text3');
    text3Element.innerText = `${this.data.text3}`;

    const text2Element = document.createElement('div');
    text2Element.classList.add('result-text2');
    text2Element.innerText = `${this.data.text2}`;

    const bookElement = document.createElement('div');
    bookElement.classList.add('result-book');
    bookElement.innerText = `Book: ${this.data.book}`;

    const lessonElement = document.createElement('div');
    lessonElement.classList.add('result-lesson');
    lessonElement.innerText = `Lesson: ${this.data.lesson}`;

    const intervalElement = document.createElement('div');
    intervalElement.classList.add('result-interval');
    intervalElement.innerText = `Intervals: ${this.data.interval.map(num => num.toFixed(0)).join(', ')}`;
    
    const correctScoreElement = document.createElement('div');
    correctScoreElement.classList.add('result-correct-score');
    correctScoreElement.innerText = `Correct score: ${this.data.correctScore.map(num => num.toFixed(2)).join(', ')}`;
    const isLearnedElement = document.createElement('div');
    isLearnedElement.classList.add('result-is-learned');
    isLearnedElement.innerText = `Is Learned: ${
      this.data.isLearned ? 'Yes' : 'No'
    }`;

    const correctCountElement = document.createElement('div');
    correctCountElement.classList.add('result-correct-count');
    correctCountElement.innerText = `Correct Count: ${this.data.correctCount}`;

    const nextReviewDatesElement = document.createElement('div');
    nextReviewDatesElement.classList.add('result-next-review-dates');
    
    const lastTimestamp = this.data.nextReviewTimestamp[this.data.nextReviewTimestamp.length - 1];
    const nextReviewDate = new Date(lastTimestamp).toLocaleString(); // Converts timestamp to a readable date

    nextReviewDatesElement.innerText = `Next Review Dates: ${nextReviewDate}`;

    resultDiv.appendChild(text5Element);
    resultDiv.appendChild(text4Element);
    resultDiv.appendChild(text3Element);
    resultDiv.appendChild(text2Element);
    resultDiv.appendChild(bookElement);
    resultDiv.appendChild(lessonElement);
    resultDiv.appendChild(intervalElement);
    resultDiv.appendChild(correctScoreElement);
    // resultDiv.appendChild(isLearnedElement);
    // resultDiv.appendChild(correctCountElement);
    resultDiv.appendChild(nextReviewDatesElement);
    console.log('audiosrc', this.data.audio)
    return resultDiv;
  }

  public render(parent: HTMLElement): void {
    parent.innerHTML = ''; // Clear previous result
    parent.appendChild(this.element);
  }
}

