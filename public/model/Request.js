export class Request {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.audit = data.audit;
    this.helpful_links = data.helpful_links;
    this.logo_link = data.logo_link;
    this.socials = data.socials;
    this.type = data.type;
    this.quoted_description = data.quoted_description;
    this.timestamp = data.timestamp;
    this.site = data.site;
    this.contact = data.contact;
    this.chain = data.chain;
  }

  serialize() {
    return {
      name: this.name,
      description: this.description,
      audit: this.audit,
      helpful_links: this.helpful_links,
      logo_link: this.logo_link,
      socials: this.socials,
      type: this.type,
      quoted_description: this.quoted_description,
      timestamp: this.timestamp,
      site: this.site,
      contact: this.contact,
      chain: this.chain,
    };
  }

  validate() {
    // To do
    const errors = {};
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
