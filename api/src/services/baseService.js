class BaseService {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    const item = await this.model.findById(id);
    if (!item) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return item;
  }

  async create(data) {
    const item = new this.model(data);
    return item.save();
  }

  async update(id, updates) {
    const item = await this.getById(id);
    Object.assign(item, updates);
    return item.save();
  }

  async delete(id) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return result;
  }
}

export default BaseService; 