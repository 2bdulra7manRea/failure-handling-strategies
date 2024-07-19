/**
 * Function to simulate fetching user data from a database.
 * If the global `t` value is less than 15, it increments `t` and throws an error to simulate a connection failure.
 * Once `t` reaches 15, it returns a mock user object.
 *
 * @param {object} glob - A global object containing a counter `t`.
 * @returns {object} - A mock user object.
 * @throws {Error} - Throws an error if the connection to the remote fails.
 */
export function getUserDataFromDB(glob) {
  if (glob.t < 15) {
    glob.t++;
    throw new Error("Unable to connect to remote");
  }
  return { user: "1039" };
}

/**
 * Function to simulate attaching relevant documents to a user.
 * Takes a user ID and returns a mock document attachment result.
 *
 * @param {string} id - The user ID to attach documents to.
 * @returns {object} - An object containing the user ID and mock document details.
 */
export function attachRelevantDocumentsToUser(id) {
  return { id, document: { mock: 39, process: "success" } };
}
