export class Card {
  constructor(data) {
    this.header = data.header;
    this.body = data.body;
    this.isPinned = data.isPinned;
    this.timestamp = data.timestamp;
  }

  serialize() {
    return {
      header: this.header,
      body: this.body,
      isPinned: this.isPinned,
      timestamp: this.timestamp,
    };
  }

  serializeForUpdate() {
    const r = {};
    if (this.header) {
      r.header = this.header;
    }
    if (this.body) {
      r.body = this.body;
    }
    r.isPinned = this.isPinned;
    if (this.timestamp) {
      r.timestamp = this.timestamp;
    }
    return r;
  }

  validate() {
    // To do
    const errors = {};
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
