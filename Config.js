export class LightningConfig {
  static vars = {}
  static set(prop, value) {
    this.vars[prop] = value;
  }
  static get(prop) {
    return this.vars[prop];
  }
}
