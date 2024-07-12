export function getUserDataFromDB(glob) {
    console.log(glob);
  if ( glob.t< 15) {
    glob.t++;
    throw new Error("unable to connect to remote");
  }
  return { user: "1039" };
}

export function attachRelevantDocumentsToUser(id) {
  return { id, document: { mock: 39, process: "success" } };
}
