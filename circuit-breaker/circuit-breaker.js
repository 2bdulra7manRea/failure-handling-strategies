import { errorResponse, successResponse } from "./responses.js";

const STATUS = {
  CLOSED: "CLOSED",
  OPEN: "OPEN",
  HALF_OPEN: "HALF_OPEN",
  STABLE: "STABLE",
};

// Class representing the circuit status with various states
class CircuitStatus {
  status;

  constructor() {
    this.initialize(); // Initialize the status to STABLE
  }

  // Check if the status is CLOSED
  isClosed() {
    return this.status === STATUS.CLOSED;
  }

  // Check if the status is HALF_OPEN
  isHalfOpened() {
    return this.status === STATUS.HALF_OPEN;
  }

  // Check if the status is OPEN
  isOpened() {
    return this.status === STATUS.OPEN;
  }

  // Initialize the status to STABLE
  initialize() {
    this.status = STATUS.STABLE;
  }

  // Set the status to CLOSED
  close() {
    this.status = STATUS.CLOSED;
  }

  // Set the status to OPEN
  open() {
    this.status = STATUS.OPEN;
  }

  // Set the status to HALF_OPEN
  halfOpen() {
    this.status = STATUS.HALF_OPEN;
  }
}

// Class representing the Circuit Breaker
export class CircuitBreaker {
  failureCount = 0; // Counter for tracking failures
  startTimer = false; // Flag to indicate if the timer has started
  status = new CircuitStatus(); // Instance of CircuitStatus

  constructor(limit = 3, delay = 4000) {
    this.limit = limit; // Maximum number of allowed failures before opening the circuit
    this.delay = delay; // Delay before transitioning from OPEN to HALF_OPEN state
  }

  // Start the timer to transition from OPEN to HALF_OPEN state after the delay
  runTimer() {
    console.log("[timer-start]");
    this.startTimer = true;
    setTimeout(() => {
      this.status.halfOpen();
      this.startTimer = false;
    }, this.delay);
  }

  // Report the current state of the circuit breaker
  report() {
    const obj = {
      limit: this.limit,
      timer: this.startTimer,
      status: this.status.status,
      count: this.failureCount,
    };

    console.log(JSON.stringify(obj));
  }

  // Execute the given fallback function with circuit breaker logic
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

  // Handle successful execution of the fallback function
  handleSuccess(res, result) {
    if (this.status.isHalfOpened() || this.status.isClosed()) {
      this.status.initialize(); // Reset the status to STABLE
      this.failureCount = 0; // Reset the failure count
    }
    return successResponse(res, 200, result);
  }

  // Handle the case when the circuit is OPEN
  handleErrorOpen(res) {
    if (this.status.isOpened()) {
      if (!this.startTimer) {
        this.runTimer(); // Start the timer to transition to HALF_OPEN state
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

  // Handle the case when the fallback function fails
  handleErrorClosed(res) {
    if (!this.status.isClosed()) {
      this.status.close(); // Set the status to CLOSED
    }

    if (this.failureCount < this.limit) {
      this.failureCount++; // Increment the failure count
    } else {
      this.status.open(); // Set the status to OPEN
      this.failureCount = 0; // Reset the failure count
    }
    return errorResponse(res, 501, "Temporary Exception, Please try again.");
  }
}
