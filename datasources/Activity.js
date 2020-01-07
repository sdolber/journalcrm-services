const { DataSource } = require('apollo-datasource');
const parseActivity = require('../logic/activityParser');

class ActivityAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async processEntry(text) {
    let result = await parseActivity(text); 
    return result;
  }
}

module.exports = ActivityAPI;
