export class SBCHProject {
  constructor(data) {
    this.name = data.name;
    this.sort_name = data.sort_name;
    this.description = data.description;
    this.audit = data.audit;
    this.bias = data.bias;
    this.dyor = data.dyor;
    this.helpful_links = data.helpful_links;
    this.logo_path = data.logo_path;
    this.socials = data.socials;
    this.type = data.type;
    this.my_thoughts = data.my_thoughts;
    this.quoted_description = data.quoted_description;
    this.timestamp = data.timestamp;
    this.site = data.site;
  }

  serialize() {
    return {
      name: this.name,
      sort_name: this.sort_name,
      description: this.description,
      audit: this.audit,
      bias: this.bias,
      dyor: this.dyor,
      helpful_links: this.helpful_links,
      logo_path: this.logo_path,
      socials: this.socials,
      type: this.type,
      my_thoughts: this.my_thoughts,
      quoted_description: this.quoted_description,
      timestamp: this.timestamp,
      site: this.site,
    };
  }

  serializeForUpdate() {
    const r = {};
    if (this.name) {
      r.name = this.name;
    }
    if (this.sort_name) {
      r.sort_name = this.sort_name;
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
    r.dyor = this.dyor;
    if (this.helpful_links) {
      r.helpful_links = this.helpful_links;
    }
    if (this.logo_path) {
      r.logo_path = this.logo_path;
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
    if (this.quoted_description) {
      r.quoted_description = this.quoted_description;
    }
    if (this.timestamp) {
      r.timestamp = this.timestamp;
    }
    if (this.site) {
      r.site = this.site;
    }
    return r;
  }

  validate() {
    const errors = {};
    // if (!this.name || this.name.length < 2) {
    //   errors.name = "Name should be a minimum of 2 characters.";
    // }
    // if (!this.description || this.description.length < 5) {
    //   errors.description = "Description should be a minimum of 5 characters.";
    // }
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
