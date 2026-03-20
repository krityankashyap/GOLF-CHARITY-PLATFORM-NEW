import User from '../schema/user.js';
import CrudRepository from './crudRepository.js';

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select('+password');
    return query.exec();
  }

  async findByEmailVerificationToken(token) {
    return User.findOne({ emailVerificationToken: token }).exec();
  }

  async findByPasswordResetToken(token) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).exec();
  }

  async updateSubscription(userId, subscriptionId) {
    return User.findByIdAndUpdate(userId, { subscriptionId }, { new: true }).exec();
  }

  async findAllPaginated(page = 1, limit = 20, search = '') {
    const skip = (page - 1) * limit;
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};
    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('selectedCharity', 'name')
        .populate('subscriptionId', 'status plan nextRenewalDate')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      User.countDocuments(filter),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new UserRepository();
