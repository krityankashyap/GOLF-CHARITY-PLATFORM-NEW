import scoreRepository from '../repositories/scoreRepository.js';
import ClientError from '../utils/errors/ClientError.js';

const MAX_SCORES = 5;

const scoreService = {
  async getScores(userId) {
    const scoreDoc = await scoreRepository.findByUserId(userId);
    if (!scoreDoc) return { scores: [] };

    const sorted = [...scoreDoc.scores].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return { scores: sorted };
  },

  async addScore(userId, value, date) {
    if (value < 1 || value > 45) {
      throw new ClientError('InvalidScore', 'Score must be between 1 and 45', 400);
    }

    let scoreDoc = await scoreRepository.findByUserId(userId);
    let scores = scoreDoc ? [...scoreDoc.scores] : [];

    const newScore = { value, date: new Date(date) };

    if (scores.length >= MAX_SCORES) {
      scores.sort((a, b) => new Date(a.date) - new Date(b.date));
      scores.shift();
    }

    scores.push(newScore);

    const updated = await scoreRepository.upsertUserScores(userId, scores);
    const sorted = [...updated.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    return { scores: sorted };
  },

  async deleteScore(userId, scoreIndex) {
    const scoreDoc = await scoreRepository.findByUserId(userId);
    if (!scoreDoc || !scoreDoc.scores.length) {
      throw new ClientError('NotFound', 'No scores found', 404);
    }

    const sorted = [...scoreDoc.scores].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    if (scoreIndex < 0 || scoreIndex >= sorted.length) {
      throw new ClientError('InvalidIndex', 'Invalid score index', 400);
    }

    sorted.splice(scoreIndex, 1);

    const updated = await scoreRepository.upsertUserScores(userId, sorted);
    const resorted = [...updated.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    return { scores: resorted };
  },

  async adminUpdateScores(userId, scores) {
    if (scores.length > MAX_SCORES) {
      throw new ClientError('TooManyScores', `Maximum ${MAX_SCORES} scores allowed`, 400);
    }
    for (const s of scores) {
      if (s.value < 1 || s.value > 45) {
        throw new ClientError('InvalidScore', 'Each score must be between 1 and 45', 400);
      }
    }
    const updated = await scoreRepository.upsertUserScores(userId, scores);
    return updated;
  },
};

export default scoreService;
