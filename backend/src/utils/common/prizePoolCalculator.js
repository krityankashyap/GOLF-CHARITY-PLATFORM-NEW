import serverConfig from '../../config/serverConfig.js';

const prizePoolCalculator = {
  calculate(activeSubscribers, jackpotRollover = 0) {
    const monthlyAmount = serverConfig.MONTHLY_PLAN_AMOUNT;
    const prizePoolPercent = serverConfig.PRIZE_POOL_PERCENT / 100;

    const perSubscriberContribution = Math.round(monthlyAmount * prizePoolPercent);
    const totalFromSubscriptions = perSubscriberContribution * activeSubscribers;
    const total = totalFromSubscriptions + jackpotRollover;

    const jackpotAmount = Math.round(total * 0.4);
    const fourMatchAmount = Math.round(total * 0.35);
    const threeMatchAmount = Math.round(total * 0.25);

    return {
      total,
      jackpot: {
        amount: jackpotAmount,
        rollover: 0,
      },
      fourMatch: fourMatchAmount,
      threeMatch: threeMatchAmount,
    };
  },

  splitPrize(totalAmount, winnerCount) {
    if (winnerCount === 0) return 0;
    return Math.round(totalAmount / winnerCount);
  },
};

export default prizePoolCalculator;
