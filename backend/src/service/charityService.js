import charityRepository from '../repositories/charityRepository.js';
import ClientError from '../utils/errors/ClientError.js';

const charityService = {
  async getAllCharities(search, page, limit) {
    return charityRepository.searchCharities(search, page, limit);
  },

  async getFeaturedCharities() {
    return charityRepository.findFeatured();
  },

  async getCharityById(charityId) {
    return charityRepository.findById(charityId);
  },

  async createCharity(data) {
    return charityRepository.create(data);
  },

  async updateCharity(charityId, data) {
    const allowed = ['name', 'description', 'images', 'events', 'featured', 'active'];
    const update = {};
    for (const key of allowed) {
      if (data[key] !== undefined) update[key] = data[key];
    }
    return charityRepository.update(charityId, update);
  },

  async deleteCharity(charityId) {
    return charityRepository.delete(charityId);
  },

  async toggleFeatured(charityId) {
    const charity = await charityRepository.findById(charityId);
    return charityRepository.update(charityId, { featured: !charity.featured });
  },

  async recordDonation(charityId, amount) {
    if (!charityId) {
      throw new ClientError('InvalidInput', 'Charity ID is required', 400);
    }
    if (!amount || amount <= 0) {
      throw new ClientError('InvalidInput', 'Donation amount must be positive', 400);
    }
    return charityRepository.incrementContribution(charityId, amount);
  },
};

export default charityService;
