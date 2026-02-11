// Suggest a random board game via a random BGG Geek Rating.

function randomRating (min = 5.5, max = 8) {
    return Math.random() * (max - min) + min;
}

console.log(`${randomRating()} or higher`);
