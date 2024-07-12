import { CircuitBreaker } from "./circuit-breaker.js";
import { attachRelevantDocumentsToUser, getUserDataFromDB } from "./service.js";

let glob = { t: 0 };

const circuitBreaker = new CircuitBreaker(5, 5000);

export default function endpointCircuitBreaker (req, res) {
  return circuitBreaker.execute(() => {
    const userData = getUserDataFromDB(glob);

    return attachRelevantDocumentsToUser(userData.user);
  }, res);
};
