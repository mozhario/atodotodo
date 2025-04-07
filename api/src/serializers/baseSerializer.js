class BaseSerializer {
  static toJSON(data) {
    throw new Error('toJSON method must be implemented');
  }

  static toJSONList(dataList) {
    return dataList.map(item => this.toJSON(item));
  }

  static formatDate(date) {
    return date ? new Date(date).toISOString() : null;
  }

  static formatId(id) {
    return id?.toString();
  }
}

export default BaseSerializer; 