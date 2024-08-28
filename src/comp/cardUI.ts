// src/comp/cardUI.ts
import { Card } from './card';
import { getCardSpacedRMap } from '../storage/localforage';
import { getExpiredCardWithShortestInterval } from '../utils/spacedRepetition';

export function renderCard(index: number, cards: Card[], app: HTMLElement) {
  if (cards.length > 0) {
    cards[index].render(app);
  }
}

export function nextCard(cards: Card[], app: HTMLElement) {
  getCardSpacedRMap()
    .then((data) => {
      const nextCard = getExpiredCardWithShortestInterval(data);
      renderCard(nextCard, cards, app);
    })
    .catch((err) => {
      console.error('Error getting cardSpacedR map:', err);
    });
}

export function createNextButton(cards: Card[], app: HTMLElement) {
  const button = document.createElement('button');
  button.innerText = 'Next Card';
  button.classList.add('next-button');
  button.addEventListener('click', () => nextCard(cards, app));
  document.body.appendChild(button);
}
