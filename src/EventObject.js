export default class EventObject {
    constructor(type, target, detail) {
      this.type = type;
      this.target = target;
      this.detail = detail;
      this.timeStamp = +new Date();
    }
  
    stopImmediatePropagation() {
      this._stopped = true;
    }
  }
  