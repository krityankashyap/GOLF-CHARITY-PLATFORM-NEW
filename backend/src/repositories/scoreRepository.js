import Score from '../schema/score.js';
import CrudRepository from './crudRepository.js';

class ScoreRepository extends CrudRepository {
  constructor() {
    super(Score);
  }

  async findByUserId(userId) {
    return Score.findOne({ userId }).exec();
  }

  async findAllActiveSubscriberScores(activeUserIds) {
    return Score.find({ userId: { $in: activeUserIds } }).exec();
  }

  async upsertUserScores(userId, scores) {
    return Score.findOneAndUpdate(
      { userId },
      { userId, scores },
      { upsert: true, new: true }
    ).exec();
  }
}

export default new ScoreRepository();
