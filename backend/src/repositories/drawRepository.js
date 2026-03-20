import Draw from '../schema/draw.js';
import CrudRepository from './crudRepository.js';

class DrawRepository extends CrudRepository {
  constructor() {
    super(Draw);
  }

  async findByMonthYear(month, year) {
    return Draw.findOne({ month, year }).exec();
  }

  async findPublished() {
    return Draw.find({ status: 'published' }).sort({ year: -1, month: -1 }).exec();
  }

  async findLatestPublished() {
    return Draw.findOne({ status: 'published' }).sort({ year: -1, month: -1 }).exec();
  }

  async findAllPaginated(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [draws, total] = await Promise.all([
      Draw.find({})
        .skip(skip)
        .limit(limit)
        .sort({ year: -1, month: -1 })
        .exec(),
      Draw.countDocuments({}),
    ]);
    return { draws, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new DrawRepository();
