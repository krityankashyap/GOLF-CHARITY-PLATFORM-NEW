import ClientError from '../utils/errors/ClientError.js';

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const doc = await this.model.create(data);
    return doc;
  }

  async findById(id, options = {}) {
    const query = this.model.findById(id);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    const doc = await query.exec();
    if (!doc) {
      throw new ClientError('ResourceNotFound', `${this.model.modelName} not found`, 404);
    }
    return doc;
  }

  async findOne(filter, options = {}) {
    const query = this.model.findOne(filter);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    return query.exec();
  }

  async find(filter = {}, options = {}) {
    const query = this.model.find(filter);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    if (options.sort) query.sort(options.sort);
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    return query.exec();
  }

  async update(id, data, options = { new: true }) {
    const doc = await this.model.findByIdAndUpdate(id, data, options);
    if (!doc) {
      throw new ClientError('ResourceNotFound', `${this.model.modelName} not found`, 404);
    }
    return doc;
  }

  async delete(id) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) {
      throw new ClientError('ResourceNotFound', `${this.model.modelName} not found`, 404);
    }
    return doc;
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

export default CrudRepository;
