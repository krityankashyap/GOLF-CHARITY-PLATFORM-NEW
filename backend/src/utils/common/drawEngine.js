const DRAW_SIZE = 5;
const SCORE_MIN = 1;
const SCORE_MAX = 45;

const drawEngine = {
  randomDraw() {
    const numbers = new Set();
    while (numbers.size < DRAW_SIZE) {
      numbers.add(Math.floor(Math.random() * (SCORE_MAX - SCORE_MIN + 1)) + SCORE_MIN);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  },

  algorithmicDraw(allScoreDocs, mode = 'mostFrequent') {
    const frequency = {};
    for (let i = SCORE_MIN; i <= SCORE_MAX; i++) frequency[i] = 0;

    for (const scoreDoc of allScoreDocs) {
      for (const s of scoreDoc.scores) {
        frequency[s.value] = (frequency[s.value] || 0) + 1;
      }
    }

    const weights = {};
    const totalFreq = Object.values(frequency).reduce((a, b) => a + b, 0) || 1;

    for (let i = SCORE_MIN; i <= SCORE_MAX; i++) {
      if (mode === 'mostFrequent') {
        weights[i] = (frequency[i] / totalFreq) * 100 + 1;
      } else {
        const invFreq = totalFreq - frequency[i];
        weights[i] = (invFreq / totalFreq) * 100 + 1;
      }
    }

    const selected = new Set();

    while (selected.size < DRAW_SIZE) {
      const available = Array.from({ length: SCORE_MAX - SCORE_MIN + 1 }, (_, i) => i + SCORE_MIN).filter(
        (n) => !selected.has(n)
      );
      const totalWeight = available.reduce((sum, n) => sum + weights[n], 0);
      let rand = Math.random() * totalWeight;

      for (const num of available) {
        rand -= weights[num];
        if (rand <= 0) {
          selected.add(num);
          break;
        }
      }
    }

    return Array.from(selected).sort((a, b) => a - b);
  },

  calculateMatches(drawNumbers, allScoreDocs, activeUserIds) {
    const scoreMap = {};
    for (const scoreDoc of allScoreDocs) {
      scoreMap[scoreDoc.userId.toString()] = scoreDoc.scores.map((s) => s.value);
    }

    const jackpotWinners = [];
    const fourMatchWinners = [];
    const threeMatchWinners = [];

    for (const userId of activeUserIds) {
      const userScores = scoreMap[userId.toString()] || [];
      const matchedNumbers = drawNumbers.filter((n) => userScores.includes(n));
      const matchCount = matchedNumbers.length;

      if (matchCount >= 5) {
        jackpotWinners.push({ userId, matchedNumbers, matchCount });
      } else if (matchCount === 4) {
        fourMatchWinners.push({ userId, matchedNumbers, matchCount });
      } else if (matchCount === 3) {
        threeMatchWinners.push({ userId, matchedNumbers, matchCount });
      }
    }

    return { jackpotWinners, fourMatchWinners, threeMatchWinners };
  },
};

export default drawEngine;
