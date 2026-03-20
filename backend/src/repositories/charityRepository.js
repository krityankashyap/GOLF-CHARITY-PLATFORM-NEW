import Charity from '../schema/charity.js';
import CrudRepository from './crudRepository.js';

class CharityRepository extends CrudRepository {
  constructor() {
    super(Charity);
  }

  async findFeatured() {
    return Charity.find({ featured: true, active: true }).exec();
  }

  async searchCharities(search = '', page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { active: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const [charities, total] = await Promise.all([
      Charity.find(filter).skip(skip).limit(limit).sort({ featured: -1, name: 1 }).exec(),
      Charity.countDocuments(filter),
    ]);
    return { charities, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async incrementContribution(charityId, amount) {
    return Charity.findByIdAndUpdate(
      charityId,
      { $inc: { totalContributed: amount } },
      { new: true }
    ).exec();
  }
}

export default new CharityRepository();
