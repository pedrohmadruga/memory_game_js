const cards = document.querySelectorAll(".card");
const newGameBtn = document.querySelector(".new_game_btn");

let isShuffling = false;

cards.forEach(card => {
    card.addEventListener("click", () => {
        if (isShuffling) return; // Ignores click if cards are shuffling
        card.classList.toggle("card_flipped");
    });
});

newGameBtn.addEventListener("click", () => {
    isShuffling = true;

    cards.forEach(card => {
        card.classList.remove("card_flipped");
    });

    // Rotates card
    setTimeout(() => {
        cards.forEach(card => {
            const inner = card.querySelector(".card_inner");
            inner.classList.remove("returning");
            inner.classList.add("animating");
        });
    }, 600); // flip card animation time

    // Fase 2: Shuffles card
    setTimeout(() => {
        cards.forEach(card => {
            const inner = card.querySelector(".card_inner");
            inner.classList.remove("animating");
            inner.classList.add("shuffling");
        });
    }, 1100); // rotate animation time + flip card time

    // Fase 3: Returns to original state
    setTimeout(() => {
        cards.forEach(card => {
            const inner = card.querySelector(".card_inner");
            inner.classList.remove("shuffling");
            inner.classList.add("returning");
        });
        isShuffling = false;
    }, 2100); // full time
});
