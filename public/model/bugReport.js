export class BugReport {
  constructor(data) {
    this.text = data.text;
    this.contact = data.contact;
  }

  serialize() {
    return {
      text: this.text,
      contact: this.contact,
    };
  }

  validate() {
    const errors = {};
    if (!this.text || this.text.length < 10) {
      errors.text = "Try again in more than 10 characters!";
    }
    // The below regexes were graciously provided by OpenAI's ChatGPT, the email regex is very robust but seems to work well. The
    //   Twitter and Telegram ones correctly account for length as well
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([\w]+\.)+[a-zA-Z]{2,}(?!\.)))$/;
    const twitterRegex = /^@\w{1,15}$/;
    const telegramHandleRegex = /^@\w{5,32}$/;
    if (
      !this.contact ||
      (!emailRegex.test(this.contact) &&
        !twitterRegex.test(this.contact) &&
        !telegramHandleRegex.test(this.contact))
    ) {
      errors.contact =
        "Please enter an email, or a valid Twitter or Telegram handle including the @.";
    }
    if (Object.keys(errors).length == 0) {
      return null;
    } else return errors;
  }
}
