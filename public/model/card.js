export class Card {
  constructor(data) {
    this.header = data.header;
    this.body = data.body;
    this.isPinned = data.isPinned;
    this.page = data.page;
    this.timestamp = data.timestamp;
  }

  serialize() {
    return {
      header: this.header,
      body: this.body,
      isPinned: this.isPinned,
      page: this.page,
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
    if (this.isPinned) {
      r.isPinned = this.isPinned;
    }
    if (this.page) {
      r.page = this.page;
    }
    if (this.timestamp) {
      r.timestamp = this.timestamp;
    }
    return r;
  }

  validate() {
    const errors = {};
    if (!this.header || this.header.length < 2) {
      errors.header = "Header should be a minimum of 2 characters.";
    }
    if (!this.body || this.body.length < 5) {
      errors.content = "Body should be a minimum of 5 characters.";
    }
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
