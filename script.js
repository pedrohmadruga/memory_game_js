"use strict";

const cards = document.querySelectorAll(".card");
const newGameBtn = document.querySelector(".new_game_btn");
const overlay = document.querySelector(".freeze-overlay");
const closeModalBtn = document.querySelector(".close_modal");
const modal = document.querySelector(".modal");
const timerEl = document.querySelectorAll(".timer");
const lowestTimeEl = document.querySelector(".lowest_time");

// Global variables
let isShuffling,
    currentCardsFlippedArray,
    currentCardsFlipped,
    totalCardsFlipped,
    cardsOnBoardMap,
    isCheckingCards,
    pairsFound,
    counter,
    counterInterval,
    highscore = 0;

function startNewGame() {
    isShuffling = false;
    isCheckingCards = false;
    currentCardsFlipped = 0;
    totalCardsFlipped = 0;
    currentCardsFlippedArray = [];
    pairsFound = new Set();
    counter = 0;
    clearInterval(counterInterval);

    counterInterval = setInterval(() => {
        counter++;
        timerEl.forEach(timer => {
            timer.textContent = convertTimer(counter);
        });
    }, 1000);

    shuffleCards();
}

function fisherYatesShuffle(array) {
    // Shuffle with Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        // Get random element in array before or equal to current position
        const j = Math.floor(Math.random() * (i + 1));

        // Swap random element with current one
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleCards() {
    const imageIds = [];
    for (let i = 0; i < 8; i++) {
        imageIds.push(i, i);
    } // This will give me this array: [0,0,1,1,...,7,7]

    fisherYatesShuffle(imageIds); // After this, array is shuffled. i.e: [1,2,0,3,1,5,...].

    // Give each card a background image based on the imageIds array
    cards.forEach((card, index) => {
        const back = card.querySelector(".card_back"); // Get the back of the card
        const imageId = imageIds[index]; // Get the shuffled id
        back.style.backgroundImage = `url("./images/card${imageId}.png")`; // Give the back of the card the image of the same number as the imageId
    });
}

function convertTimer(counter) {
    const minutes = Math.trunc(counter / 60)
        .toString()
        .padStart(2, 0);
    const seconds = (counter - minutes * 60).toString().padStart(2, 0);

    return `${minutes}:${seconds}`;
}

closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

function winPopUpShow() {
    setTimeout(() => {
        modal.classList.add("open");
    }, 600);
}

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

        // Game won
        if (pairsFound.size === 8) {
            // If it's the first time playing
            if (highscore === 0 || highscore > counter) {
                highscore = counter;
                lowestTimeEl.textContent = convertTimer(highscore);
            }

            clearInterval(counterInterval);
            winPopUpShow();
        }
    });
});

newGameBtn.addEventListener("click", () => {
    isShuffling = true;

    cards.forEach(card => {
        card.classList.remove("card_flipped");
    });

    // Step 1: Rotates card
    setTimeout(() => {
        cards.forEach(card => {
            updateCardInnerClasses("returning", "animating");
        });
    }, 600); // flip card animation time

    // Step 2: Shuffles card
    setTimeout(() => {
        cards.forEach(card => {
            updateCardInnerClasses("animating", "shuffling");
        });
    }, 1100); // rotate animation time + flip card time

    // Step 3: Returns to original state
    setTimeout(() => {
        cards.forEach(card => {
            updateCardInnerClasses("shuffling", "returning");
        });
        isShuffling = false;
        startNewGame();
    }, 2100); // full time
});

function updateCardInnerClasses(removeClass, addClass) {
    cards.forEach(card => {
        const inner = card.querySelector(".card_inner");
        inner.classList.remove(removeClass);
        inner.classList.add(addClass);
    });
}

