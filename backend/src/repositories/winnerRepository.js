import Winner from '../schema/winner.js';
import CrudRepository from './crudRepository.js';

class WinnerRepository extends CrudRepository {
  constructor() {
    super(Winner);
  }

  async findByUserId(userId) {
    return Winner.find({ userId })
      .populate('drawId', 'month year drawNumbers status')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByDrawId(drawId) {
    return Winner.find({ drawId })
      .populate('userId', 'name email')
      .exec();
  }

  async findAllPaginated(page = 1, limit = 20, filter = {}) {
    const skip = (page - 1) * limit;
    const [winners, total] = await Promise.all([
      Winner.find(filter)
        .populate('userId', 'name email')
        .populate('drawId', 'month year')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Winner.countDocuments(filter),
    ]);
    return { winners, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findPublicWinners() {
    return Winner.find({ verificationStatus: 'approved' })
      .populate('userId', 'name')
      .populate('drawId', 'month year')
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }
}

export default new WinnerRepository();
