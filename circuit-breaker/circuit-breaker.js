import { errorResponse, successResponse } from "./responses.js";

const STATUS = {
  CLOSED: "CLOSED",
  OPEN: "OPEN",
  HALF_OPEN: "HALF_OPEN",
  STABLE: "STABLE",
};

class CircuitStatus {
  status;
  constructor() {
    this.initialize();
  }

  isClosed() {
    return this.status === STATUS.CLOSED;
  }

  isHalfOpened() {
    return this.status === STATUS.HALF_OPEN;
  }

  isOpened() {
    return this.status === STATUS.OPEN;
  }

  initialize() {
    this.status = STATUS.STABLE;
  }

  close() {
    this.status = STATUS.CLOSED;
  }

  open() {
    this.status = STATUS.OPEN;
  }

  halfOpen() {
    this.status = STATUS.HALF_OPEN;
  }
}

export class CircuitBreaker {
  failureCount = 0;
  startTimer = false;
  status = new CircuitStatus();
  constructor(limit = 3, delay = 4000) {
    this.limit = limit;
    this.delay = delay;
  }

  runTimer() {
    console.log("[timer-start]");
    this.startTimer = true;
    setTimeout(() => {
      this.status.halfOpen();
      this.startTimer = false;
    }, this.delay);
  }

  report() {
    const obj = {
      limit: this.limit,
      timer: this.startTimer,
      status: this.status.status,
      count: this.failureCount,
    };

    console.log(JSON.stringify(obj));
  }

  async execute(fallback, res) {
    this.report();

    if (this.handleErrorOpen(res)) {
      return;
    }

    try {
      const result = await fallback();
      return this.handleSuccess(res, result);
    } catch (error) {
      return this.handleErrorClosed(res);
    }
  }

  handleSuccess(res, result) {
    if (this.status.isHalfOpened() || this.status.isClosed()) {
      this.status.initialize();
      this.failureCount = 0;
    }
    return successResponse(res, 200, result);
  }

  handleErrorOpen(res) {
    if (this.status.isOpened()) {
      if (!this.startTimer) {
        this.runTimer();
      }
      errorResponse(
        res,
        500,
        "The server is not working properly, Please try later after while."
      );
      return true;
    }
    return false;
  }

  handleErrorClosed(res) {
    if (!this.status.isClosed()) {
      this.status.close();
    }

    if (this.failureCount < this.limit) {
      this.failureCount++;
    } else {
      this.status.open();
      this.failureCount = 0;
    }
    return errorResponse(res, 501, "Temporary Exception, Please try again.");
  }
}
