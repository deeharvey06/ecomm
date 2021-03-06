const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
  constructor(filename) {
    if (!filename) throw new Error('Create a repository require a filename');

    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  async getAll() {
    return JSON.parse(await fs.promises.readFile(this.filename, {
      encoding: 'utf8'
    }));
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2));
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record =  records.find(record => record.id === id);

    if (!record) throw new Error(`Record th id ${id} not found`);
    record = { record, ...attrs };
    await this.writeAll(records);
  }

  async getOneBy(filter) {
    const records = this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filter) {
        if (record[key] !== filter[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}
