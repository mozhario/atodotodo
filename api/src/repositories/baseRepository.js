class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(query = {}) {
    return this.model.find(query).sort({ createdAt: -1 });
  }

  async findById(id, query = {}) {
    const item = await this.model.findOne({ _id: id, ...query });
    if (!item) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return item;
  }

  async create(data) {
    const item = new this.model(data);
    return item.save();
  }

  async update(id, data, query = {}) {
    const item = await this.model.findOne({ _id: id, ...query });
    if (!item) {
      throw new Error(`${this.model.modelName} not found`);
    }
    Object.assign(item, data);
    return item.save();
  }

  async delete(id, query = {}) {
    const result = await this.model.findOneAndDelete({ _id: id, ...query });
    if (!result) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return result;
  }
}

export default BaseRepository; 