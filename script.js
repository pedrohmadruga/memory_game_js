const cards = document.querySelectorAll(".card");
const newGameBtn = document.querySelector(".new_game_btn");

cards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("card_flipped");
    });
});

newGameBtn.addEventListener("click", () => {
    cards.forEach(card => {
        card.classList.remove("card_flipped");
    });

    // Rotates card
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove("returning");
            card.classList.add("animating");
        });
    }, 600); // flip card animation time

    // Fase 2: Shuffles card
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove("animating");
            card.classList.add("shuffling");
        });
    }, 1100); // rotate animation time + flip card time

    // Fase 3: Returns to original state
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove("shuffling");
            card.classList.add("returning");
        });
    }, 2100); // full time
});
