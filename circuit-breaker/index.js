import { CircuitBreaker } from "./circuit-breaker.js";
import { attachRelevantDocumentsToUser, getUserDataFromDB } from "./service.js";

// Global object to simulate a counter used in getUserDataFromDB function
let glob = { t: 0 };

// Instantiate the CircuitBreaker with a failure limit of 5 and a delay of 5000ms
const circuitBreaker = new CircuitBreaker(5, 5000);

/**
 * Endpoint function that uses the Circuit Breaker pattern.
 * Attempts to fetch user data from the database and attach relevant documents.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise} - The result of the circuit breaker execution.
 */
export default function endpointCircuitBreaker(req, res) {
  return circuitBreaker.execute(() => {
    // Attempt to fetch user data from the database
    const userData = getUserDataFromDB(glob);

    // Attach relevant documents to the user data
    return attachRelevantDocumentsToUser(userData.user);
  }, res);
}
