import drawRepository from '../repositories/drawRepository.js';
import subscriptionRepository from '../repositories/subscriptionRepository.js';
import scoreRepository from '../repositories/scoreRepository.js';
import winnerRepository from '../repositories/winnerRepository.js';
import drawEngine from '../utils/common/drawEngine.js';
import prizePoolCalculator from '../utils/common/prizePoolCalculator.js';
import ClientError from '../utils/errors/ClientError.js';

const drawService = {
  async getAllPublishedDraws() {
    return drawRepository.findPublished();
  },

  async getCurrentDraw() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let draw = await drawRepository.findByMonthYear(month, year);
    if (!draw) {
      draw = {
        month,
        year,
        status: 'pending',
        prizePool: { total: 0, jackpot: { amount: 0 }, fourMatch: 0, threeMatch: 0 },
        drawNumbers: [],
        activeSubscribers: 0,
      };
    }
    return draw;
  },

  async getDrawById(drawId) {
    return drawRepository.findById(drawId);
  },

  async getMyResult(drawId, userId) {
    const draw = await drawRepository.findById(drawId);
    if (draw.status !== 'published') {
      throw new ClientError('DrawNotPublished', 'Draw results are not yet published', 403);
    }

    const winner = await winnerRepository.findOne({ drawId, userId });
    const scoreDoc = await scoreRepository.findByUserId(userId);
    const userScores = scoreDoc ? scoreDoc.scores.map((s) => s.value) : [];

    const matchedNumbers = draw.drawNumbers.filter((n) => userScores.includes(n));

    return {
      draw,
      userScores,
      matchedNumbers,
      matchCount: matchedNumbers.length,
      winner: winner || null,
    };
  },

  async configureDraw(month, year, drawType) {
    const existing = await drawRepository.findByMonthYear(month, year);
    if (existing && existing.status === 'published') {
      throw new ClientError('DrawAlreadyPublished', 'This draw has already been published', 400);
    }

    const activeSubscribers = await subscriptionRepository.countActive();
    const lastPublished = await drawRepository.findLatestPublished();
    const jackpotRollover = lastPublished
      ? lastPublished.prizePool.jackpot.rollover || 0
      : 0;

    const prizePool = prizePoolCalculator.calculate(activeSubscribers, jackpotRollover);

    if (existing) {
      return drawRepository.update(existing._id, {
        drawType,
        activeSubscribers,
        jackpotRollover,
        prizePool,
        status: 'pending',
        simulationResult: null,
      });
    }

    return drawRepository.create({
      month,
      year,
      drawType,
      activeSubscribers,
      jackpotRollover,
      prizePool,
      status: 'pending',
    });
  },

  async simulateDraw(drawId) {
    const draw = await drawRepository.findById(drawId);
    if (draw.status === 'published') {
      throw new ClientError('DrawPublished', 'Cannot simulate a published draw', 400);
    }

    const activeSubscriptions = await subscriptionRepository.findAllActive();
    const activeUserIds = activeSubscriptions.map((s) => s.userId._id || s.userId);

    let drawNumbers;
    if (draw.drawType === 'algorithmic') {
      const allScores = await scoreRepository.findAllActiveSubscriberScores(activeUserIds);
      drawNumbers = drawEngine.algorithmicDraw(allScores);
    } else {
      drawNumbers = drawEngine.randomDraw();
    }

    const allScores = await scoreRepository.findAllActiveSubscriberScores(activeUserIds);
    const matchResults = drawEngine.calculateMatches(drawNumbers, allScores, activeUserIds);

    const { jackpotWinners, fourMatchWinners, threeMatchWinners } = matchResults;

    let jackpotRollover = 0;
    if (jackpotWinners.length === 0) {
      jackpotRollover = draw.prizePool.jackpot.amount;
    }

    const simulationResult = {
      drawNumbers,
      jackpotWinners: jackpotWinners.length,
      fourMatchWinners: fourMatchWinners.length,
      threeMatchWinners: threeMatchWinners.length,
      jackpotRollover,
      totalParticipants: activeUserIds.length,
      prizePool: draw.prizePool,
    };

    return drawRepository.update(drawId, {
      drawNumbers,
      status: 'simulated',
      simulationResult,
      'prizePool.jackpot.rollover': jackpotRollover,
    });
  },

  async publishDraw(drawId) {
    const draw = await drawRepository.findById(drawId);
    if (draw.status === 'published') {
      throw new ClientError('AlreadyPublished', 'Draw is already published', 400);
    }

    const activeSubscriptions = await subscriptionRepository.findAllActive();
    const activeUserIds = activeSubscriptions.map((s) => s.userId._id || s.userId);

    let drawNumbers = draw.drawNumbers;
    if (!drawNumbers || drawNumbers.length !== 5) {
      if (draw.drawType === 'algorithmic') {
        const allScores = await scoreRepository.findAllActiveSubscriberScores(activeUserIds);
        drawNumbers = drawEngine.algorithmicDraw(allScores);
      } else {
        drawNumbers = drawEngine.randomDraw();
      }
    }

    const allScores = await scoreRepository.findAllActiveSubscriberScores(activeUserIds);
    const matchResults = drawEngine.calculateMatches(drawNumbers, allScores, activeUserIds);

    const { jackpotWinners, fourMatchWinners, threeMatchWinners } = matchResults;

    const jackpotAmount = draw.prizePool.jackpot.amount + (draw.jackpotRollover || 0);
    const fourMatchAmount = draw.prizePool.fourMatch;
    const threeMatchAmount = draw.prizePool.threeMatch;

    let jackpotRollover = 0;
    if (jackpotWinners.length === 0) {
      jackpotRollover = jackpotAmount;
    }

    const winnerDocs = [];

    for (const w of jackpotWinners) {
      winnerDocs.push({
        userId: w.userId,
        drawId,
        matchType: '5-match',
        matchedNumbers: w.matchedNumbers,
        prizeAmount: jackpotWinners.length > 0 ? Math.round(jackpotAmount / jackpotWinners.length) : 0,
      });
    }

    for (const w of fourMatchWinners) {
      winnerDocs.push({
        userId: w.userId,
        drawId,
        matchType: '4-match',
        matchedNumbers: w.matchedNumbers,
        prizeAmount: fourMatchWinners.length > 0 ? Math.round(fourMatchAmount / fourMatchWinners.length) : 0,
      });
    }

    for (const w of threeMatchWinners) {
      winnerDocs.push({
        userId: w.userId,
        drawId,
        matchType: '3-match',
        matchedNumbers: w.matchedNumbers,
        prizeAmount: threeMatchWinners.length > 0 ? Math.round(threeMatchAmount / threeMatchWinners.length) : 0,
      });
    }

    if (winnerDocs.length > 0) {
      await Promise.all(winnerDocs.map((wd) => winnerRepository.create(wd)));
    }

    const updatedDraw = await drawRepository.update(drawId, {
      drawNumbers,
      status: 'published',
      winnersPublished: true,
      'prizePool.jackpot.rollover': jackpotRollover,
    });

    return { draw: updatedDraw, totalWinners: winnerDocs.length };
  },

  async adminGetAllDraws(page, limit) {
    return drawRepository.findAllPaginated(page, limit);
  },
};

export default drawService;
