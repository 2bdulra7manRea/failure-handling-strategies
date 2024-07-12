# Circuit Breaker Pattern

This repository contains an implementation of the Circuit Breaker pattern in JavaScript. The Circuit Breaker pattern is used to detect failures and encapsulate the logic of preventing a failure from constantly recurring during maintenance, temporary external system failure, or unexpected system difficulties.

## Features

- **Circuit Breaker States**: CLOSED, OPEN, and HALF_OPEN.
- **Configurable Failure Threshold and Delay**: Set the limit of failures before opening the circuit and the delay before attempting to close the circuit.
- **Error Handling**: Different handling for when the circuit is open or closed.
- **Timer Functionality**: Implements a timer to transition from OPEN to HALF_OPEN state.

## API

### CircuitBreaker

#### Constructor

`new CircuitBreaker(limit = 3, delay = 4000)`

- `limit`: Number of allowed failures before opening the circuit.
- `delay`: Time in milliseconds to wait before transitioning from OPEN to HALF_OPEN state.

#### Methods

- `async execute(fallback, res)`: Executes the fallback function with circuit breaker logic.
- `runTimer()`: Starts the timer for transitioning to HALF_OPEN state.
- `report()`: Logs the current state of the circuit breaker.
- `handleSuccess(res, result)`: Handles the successful execution of the fallback function.
- `handleErrorOpen(res)`: Handles the case when the circuit is open.
- `handleErrorClosed(res)`: Handles the case when the fallback function fails.

## Acknowledgments

- This implementation was inspired by the need for robust error handling and fault tolerance in distributed systems.