"use strict";

const cards = document.querySelectorAll(".card");
const newGameBtn = document.querySelector(".new_game_btn");
const overlay = document.querySelector(".freeze-overlay");
const closeModalBtn = document.querySelector(".close_modal");
const modal = document.querySelector(".modal");

// Global variables
let isShuffling,
    currentCardsFlippedArray,
    currentCardsFlipped,
    totalCardsFlipped,
    cardsOnBoardMap,
    isCheckingCards,
    pairsFound;

function startNewGame() {
    isShuffling = false;
    isCheckingCards = false;
    currentCardsFlipped = 0;
    totalCardsFlipped = 0;
    currentCardsFlippedArray = [];
    pairsFound = new Set();

    const initalData = [
        ["card0", 0],
        ["card1", 0],
        ["card2", 0],
        ["card3", 0],
        ["card4", 0],
        ["card5", 0],
        ["card6", 0],
        ["card7", 0],
    ];
    cardsOnBoardMap = new Map(initalData);

    shuffleCards();
}

function shuffleCards() {
    cards.forEach(card => {
        let mapped = false;
        const back = card.querySelector(".card_back");

        // TODO: This algorithm is waaay too inneficient. Refactor later with Fisher-Yates algorithm. Priority 3
        while (!mapped) {
            const rng = Math.trunc(Math.random() * 8);
            let currentCardAmount = cardsOnBoardMap.get(`card${rng}`);

            if (currentCardAmount < 2) {
                back.style.backgroundImage = `url("images/card${rng}.png")`;

                cardsOnBoardMap.set(`card${rng}`, currentCardAmount + 1);
                mapped = true;
            }
        }
    });
}

closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

function winPopUpShow() {
    // TODO: set timeout to wait card flip and increase modal size. Priority 1
    setTimeout(() => {
        modal.classList.add("open");
    }, 600);
    // TODO: blur filter while pop up is open
}

// TODO: close pop up event listener

startNewGame();

cards.forEach(card => {
    card.addEventListener("click", () => {
        if (
            isShuffling ||
            isCheckingCards ||
            card.classList.contains("card_flipped")
        )
            return; // Ignores click if cards are shuffling or if already flipped

        card.classList.add("card_flipped");
        currentCardsFlipped++;
        currentCardsFlippedArray.push(card);

        if (currentCardsFlipped == 2) {
            isCheckingCards = true;
            const card1 =
                currentCardsFlippedArray[0].querySelector(".card_back");
            const card2 =
                currentCardsFlippedArray[1].querySelector(".card_back");

            const image1 = window.getComputedStyle(card1).backgroundImage;
            const image2 = window.getComputedStyle(card2).backgroundImage;

            // If different, remove all click events. If equal, add pair to pairsFound set
            image1 !== image2
                ? overlay.classList.remove("hidden")
                : pairsFound.add(image1);

            setTimeout(() => {
                overlay.classList.add("hidden");
                if (image1 !== image2) {
                    currentCardsFlippedArray.forEach(card => {
                        card.classList.remove("card_flipped");
                    });
                }
                currentCardsFlipped = 0;
                currentCardsFlippedArray = [];
                isCheckingCards = false;
            }, 1000);
        }

        if (pairsFound.size === 8) {
            winPopUpShow();
        }
    });
});

newGameBtn.addEventListener("click", () => {
    isShuffling = true;

    cards.forEach(card => {
        card.classList.remove("card_flipped");
    });

    // TODO: Refactor code, inner is currently being repeated in the three timeouts. Priority 4
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

//TODO: Timer. Priority 2
