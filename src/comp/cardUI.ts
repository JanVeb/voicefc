// src/comp/cardUI.ts
import { Card } from './card';
import { getCardSpacedRMap } from '../storage/localforage';
import { getExpiredCardWithShortestInterval } from '../utils/spacedRepetition';

export let currentCard: Card | null = null;

export function renderCard(index: number, cards: Card[], app: HTMLElement) {
  if (cards.length > 0) {
    cards[index].render(app);
    currentCard = cards[index];
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

// Updated function to set up swipe functionality for both touch and mouse events
export function setupSwipeGesture(cards: Card[], app: HTMLElement) {
  let startX = 0;
  let startY = 0;
  const SWIPE_THRESHOLD = 50;
  const SWIPE_RESTRAINT = 100;

  function handleTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  function handleTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    handleGesture(endX, endY);
  }

  function handleMouseDown(e: MouseEvent) {
    startX = e.clientX;
    startY = e.clientY;
  }

  function handleMouseUp(e: MouseEvent) {
    const endX = e.clientX;
    const endY = e.clientY;
    handleGesture(endX, endY);
  }

  function handleGesture(endX: number, endY: number) {
    const deltaX = startX - endX;
    const deltaY = startY - endY;

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > SWIPE_THRESHOLD &&
      Math.abs(deltaY) < SWIPE_RESTRAINT
    ) {
      if (deltaX > 0) {
        nextCard(cards, app);
      }
    }
  }

  // Add event listeners for touch events
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Add event listeners for mouse events
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
}


// Optional: Create a swipe indicator
export function createSwipeIndicator() {
  const indicator = document.createElement('div');
  indicator.innerText = 'Swipe left for next card';
  indicator.classList.add('swipe-indicator');
  document.body.appendChild(indicator);
}

// Remove this function as we're no longer using a button
// export function createNextButton(cards: Card[], app: HTMLElement) { ... }
