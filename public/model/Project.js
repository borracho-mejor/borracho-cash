export class Project {
  constructor(data) {
    this.chain = data.chain;
    this.name = data.name;
    this.sort_name = data.sort_name;
    this.description = data.description;
    this.audit = data.audit;
    this.search_audit = data.search_audit;
    this.bias = data.bias;
    this.dyor = data.dyor;
    this.helpful_links = data.helpful_links;
    this.search_helpful_links = data.search_helpful_links;
    this.logo_path = data.logo_path;
    this.socials = data.socials;
    this.search_socials = data.search_socials;
    this.type = data.type;
    this.my_thoughts = data.my_thoughts;
    this.quoted_description = data.quoted_description;
    this.timestamp = data.timestamp;
    this.site = data.site;
    this.special_warning = data.special_warning;
    this.upcoming = data.upcoming;
    this.status = data.status;
  }

  serialize() {
    return {
      chain: this.chain,
      name: this.name,
      sort_name: this.sort_name,
      description: this.description,
      audit: this.audit,
      search_audit: this.search_audit,
      bias: this.bias,
      dyor: this.dyor,
      helpful_links: this.helpful_links,
      search_helpful_links: this.search_helpful_links,
      logo_path: this.logo_path,
      socials: this.socials,
      search_socials: this.search_socials,
      type: this.type,
      my_thoughts: this.my_thoughts,
      quoted_description: this.quoted_description,
      timestamp: this.timestamp,
      site: this.site,
      special_warning: this.special_warning,
      upcoming: this.upcoming,
      status: this.status,
    };
  }

  serializeForUpdate() {
    const r = {};
    if (this.chain) {
      r.chain = this.chain;
    }
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
    if (this.search_helpful_links) {
      r.search_helpful_links = this.search_helpful_links;
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
    r.special_warning = this.special_warning;
    r.upcoming = this.upcoming;
    r.status = this.status;

    return r;
  }

  validate() {
    // To do
    const errors = {};
    if (!this.chain || this.chain.length == 0) {
      errors.chain = "Please select a blockchain.";
    }
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
