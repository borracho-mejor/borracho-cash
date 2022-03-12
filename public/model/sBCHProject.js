export class SBCHProject {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.audit = data.audit;
    this.bias = data.bias;
    this.dyor = data.dyor;
    this.helpful_links = data.helpful_links;
    this.logo_path = data.logo_path;
    this.new_listing = data.new_listing;
    this.socials = data.socials;
    this.type = data.type;
    this.my_thoughts = data.my_thoughts;
  }

  serialize() {
    return {
      name: this.name,
      description: this.description,
      audit: this.audit,
      bias: this.bias,
      dyor: this.dyor,
      helpful_links: this.helpful_links,
      logo_path: this.logo_path,
      new_listing: this.new_listing,
      socials: this.socials,
      type: this.type,
      my_thoughts: this.my_thoughts,
    };
  }

  serializeForUpdate() {
    const r = {};
    if (this.name) {
      r.name = this.name;
    }
    if (this.description) {
      r.description = this.description;
    }
    if (this.audit) {
      r.audit = this.audit;
    }
    if (this.bias) {
      r.bias = this.bias;
    }
    if (this.dyor) {
      r.dyor = this.dyor;
    }
    if (this.helpful_links) {
      r.helpful_links = this.helpful_links;
    }
    if (this.logo_path) {
      r.logo_path = this.logo_path;
    }
    if (this.new_listing) {
      r.new_listing = this.new_listing;
    }
    if (this.socials) {
      r.socials = this.socials;
    }
    if (this.type) {
      r.type = this.type;
    }
    if (this.my_thoughts) {
      r.my_thoughts = this.my_thoughts;
    }
    return r;
  }

  validate() {
    const errors = {};
    if (!this.name || this.name.length < 2) {
      errors.name = "Name should be a minimum of 2 characters.";
    }
    if (!this.description || this.description.length < 5) {
      errors.description = "Description should be a minimum of 5 characters.";
    }
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
