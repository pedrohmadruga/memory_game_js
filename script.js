"use strict";

const cards = document.querySelectorAll(".card");
const newGameBtn = document.querySelector(".new_game_btn");
const overlay = document.querySelector(".freeze-overlay");

// Global variables
let isShuffling, cardsFlippedArray;

function startNewGame() {
    isShuffling = false;
    currentCardsFlipped = 0;
    totalCardsFlipped = 0;
    cardsFlippedArray = [];
    shuffleCards();
}

function shuffleCards() {
    return null;
}

startNewGame();

cards.forEach(card => {
    card.addEventListener("click", () => {
        if (isShuffling || card.classList.contains("card_flipped")) return; // Ignores click if cards are shuffling or if already flipped
        card.classList.toggle("card_flipped");

        if (card.classList.contains("card_flipped")) {
            currentCardsFlipped++;
            cardsFlippedArray.push(card);
            if (currentCardsFlipped == 2) {
                // stop all click events for 1 second
                overlay.classList.remove("hidden");

                setTimeout(() => {
                    overlay.classList.add("hidden");
                    cardsFlippedArray.forEach(card =>
                        card.classList.remove("card_flipped")
                    );
                    currentCardsFlipped = 0;
                    cardsFlippedArray = [];
                }, 1500);
            }
        }
    });
});

newGameBtn.addEventListener("click", () => {
    isShuffling = true;

    cards.forEach(card => {
        card.classList.remove("card_flipped");
    });

    // TODO: Refactor code, inner is currently being repeated in the three timeouts
    // Step 1: Rotates card
    setTimeout(() => {
        cards.forEach(card => {
            const inner = card.querySelector(".card_inner");
            inner.classList.remove("returning");
            inner.classList.add("animating");
        });
    }, 600); // flip card animation time

    // Step 2: Shuffles card
    setTimeout(() => {
        cards.forEach(card => {
            const inner = card.querySelector(".card_inner");
            inner.classList.remove("animating");
            inner.classList.add("shuffling");
        });
    }, 1100); // rotate animation time + flip card time

    // Step 3: Returns to original state
    setTimeout(() => {
        cards.forEach(card => {
            const inner = card.querySelector(".card_inner");
            inner.classList.remove("shuffling");
            inner.classList.add("returning");
        });
        isShuffling = false;
        startNewGame();
    }, 2100); // full time
});

// TODO: Game logic
// TODO: Congratulations pop up that gets bigger
