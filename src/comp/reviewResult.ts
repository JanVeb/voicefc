// src/comp/ReviewResult.ts
export class ReviewResult {
  private data: {
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
  };
  private element: HTMLElement;

  constructor(data: {
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
  }) {
    this.data = data;
    this.element = this.createResultElement();
  }

  private createResultElement(): HTMLElement {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('review-result');

    const bookElement = document.createElement('div');
    bookElement.classList.add('result-book');
    bookElement.innerText = `Book: ${this.data.book}`;

    const lessonElement = document.createElement('div');
    lessonElement.classList.add('result-lesson');
    lessonElement.innerText = `Lesson: ${this.data.lesson}`;

    const intervalElement = document.createElement('div');
    intervalElement.classList.add('result-interval');
    intervalElement.innerText = `Intervals: ${this.data.interval.join(', ')}`;

    const correctScoreElement = document.createElement('div');
    correctScoreElement.classList.add('result-correct-score');
    correctScoreElement.innerText = `Correct Scores: ${this.data.correctScore.join(
      ', '
    )}`;

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
    nextReviewDatesElement.innerText = `Next Review Dates: ${this.data.nextReviewDate.join(
      ', '
    )}`;

    resultDiv.appendChild(bookElement);
    resultDiv.appendChild(lessonElement);
    resultDiv.appendChild(intervalElement);
    resultDiv.appendChild(correctScoreElement);
    resultDiv.appendChild(isLearnedElement);
    resultDiv.appendChild(correctCountElement);
    resultDiv.appendChild(nextReviewDatesElement);

    return resultDiv;
  }

  public render(parent: HTMLElement): void {
    parent.innerHTML = ''; // Clear previous result
    parent.appendChild(this.element);
  }
}
