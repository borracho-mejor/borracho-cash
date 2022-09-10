export class Donation {
  constructor(data) {
    this.title = data.title;
    this.type = data.type;
    this.usdAmount = data.usdAmount;
    this.bchAmount = data.bchAmount;
    this.timestamp = data.timestamp;
  }

  serialize() {
    return {
      title: this.title,
      type: this.type,
      usdAmount: this.usdAmount,
      bchAmount: this.bchAmount,
      timestamp: this.timestamp,
    };
  }

  serializeForUpdate() {
    const r = {};
    if (this.title) {
      r.title = this.title;
    }
    if (this.type) {
      r.type = this.type;
    }
    if (this.usdAmount) {
      r.usdAmount = this.usdAmount;
    }
    if (this.bchAmount) {
      r.bchAmount = this.bchAmount;
    }
    if (this.timestamp) {
      r.timestamp = this.timestamp;
    }
    return r;
  }

  validate() {
    const errors = {};
    if (!this.title) {
      errors.title = "Please enter a title!";
    }
    if (!this.usdAmount) {
      errors.usdAmount = "Please enter an amount!";
    }
    if (!this.bchAmount) {
      errors.bchAmount = "Please enter an amount!";
    }
    if (this.type == "error") {
      errors.type = "Please choose one and only one type!";
    }
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
