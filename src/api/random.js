import seedrandom from 'seedrandom';

/**
 * Shuffle array using given random
 * @param {object} random
 * @param {object[]} arr
 * @returns shuffled array
 */
function shuffle(random, arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Random with date seed
 * @param {object} date
 * @returns random generator
 */
function daterandom(date) {
  return seedrandom(date.toDateString());
}

export { shuffle, daterandom };
