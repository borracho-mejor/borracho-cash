export class SBCHProject {
  constructor(data) {
    this.name = data.name;
    this.sort_name = data.sort_name;
    this.description = data.description;
    this.search_description = data.search_description;
    this.audit = data.audit;
    this.search_audit = data.search_audit;
    this.bias = data.bias;
    this.dyor = data.dyor;
    this.helpful_links = data.helpful_links;
    this.logo_path = data.logo_path;
    this.socials = data.socials;
    this.search_socials = data.search_socials;
    this.type = data.type;
    this.lower_type = data.lower_type;
    this.my_thoughts = data.my_thoughts;
    this.search_my_thoughts = data.search_my_thoughts;
    this.quoted_description = data.quoted_description;
    this.timestamp = data.timestamp;
    this.site = data.site;
  }

  serialize() {
    return {
      name: this.name,
      sort_name: this.sort_name,
      description: this.description,
      search_description: this.search_description,
      audit: this.audit,
      search_audit: this.search_audit,
      bias: this.bias,
      dyor: this.dyor,
      helpful_links: this.helpful_links,
      logo_path: this.logo_path,
      socials: this.socials,
      search_socials: this.search_socials,
      type: this.type,
      lower_type: this.lower_type,
      my_thoughts: this.my_thoughts,
      search_my_thoughts: this.search_my_thoughts,
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
    if (this.search_description) {
      r.search_description = this.search_description;
    }
    if (this.audit) {
      r.audit = this.audit;
    }
    if (this.search_audit) {
      r.search_audit = this.search_audit;
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
    if (this.search_socials) {
      r.search_socials = this.search_socials;
    }
    if (this.type) {
      r.type = this.type;
    }
    if (this.lower_type) {
      r.lower_type = this.lower_type;
    }
    if (this.my_thoughts) {
      r.my_thoughts = this.my_thoughts;
    }
    if (this.search_my_thoughts) {
      r.search_my_thoughts = this.search_my_thoughts;
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
    // To do
    const errors = {};
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
