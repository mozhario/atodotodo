class BaseController {
  constructor(service, serializer) {
    this.service = service;
    this.serializer = serializer;
  }

  async getAll(req, res) {
    try {
      const items = await this.service.getAll();
      res.json(this.serializer.toJSONList(items));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const item = await this.service.getById(req.params.id);
      res.json(this.serializer.toJSON(item));
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async create(req, res) {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json(this.serializer.toJSON(item));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const item = await this.service.update(req.params.id, req.body);
      res.json(this.serializer.toJSON(item));
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      res.json({ message: `${this.service.model.modelName} deleted` });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
}

export default BaseController; 