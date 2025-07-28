"use strict";

const cards = document.querySelectorAll(".card");
const newGameBtn = document.querySelector(".new_game_btn");
const overlay = document.querySelector(".freeze-overlay");

// Global variables
let isShuffling,
    currentCardsFlippedArray,
    currentCardsFlipped,
    totalCardsFlipped;

function startNewGame() {
    isShuffling = false;
    currentCardsFlipped = 0;
    totalCardsFlipped = 0;
    currentCardsFlippedArray = [];
    shuffleCards();
}

function shuffleCards() {
    cards.forEach(card => {
        const rng = Math.trunc(Math.random() * 8);
        const back = card.querySelector(".card_back");
        back.style.backgroundImage = `url("images/card${rng}.png")`;
    });
}

startNewGame();

cards.forEach(card => {
    card.addEventListener("click", () => {
        if (isShuffling || card.classList.contains("card_flipped")) return; // Ignores click if cards are shuffling or if already flipped
        card.classList.add("card_flipped");

        if (card.classList.contains("card_flipped")) {
            currentCardsFlipped++;
            currentCardsFlippedArray.push(card);
            if (currentCardsFlipped == 2) {
                //TODO: if cards are equal, keep them up
                const card1 =
                    currentCardsFlippedArray[0].querySelector(".card_back");
                const card2 =
                    currentCardsFlippedArray[1].querySelector(".card_back");

                const image1 = window.getComputedStyle(card1).backgroundImage;
                const image2 = window.getComputedStyle(card2).backgroundImage;

                if (image1 !== image2) {
                    // stop all click events for 1 second
                    overlay.classList.remove("hidden");
                }

                // If cards are different
                setTimeout(() => {
                    overlay.classList.add("hidden");
                    if (image1 !== image2) {
                        currentCardsFlippedArray.forEach(card => {
                            card.classList.remove("card_flipped");
                        });
                    }
                    currentCardsFlipped = 0;
                    currentCardsFlippedArray = [];
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
