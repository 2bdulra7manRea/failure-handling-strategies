export function errorResponse(res, status, message) {
  res.status(status).json({ message, status });
  return;
}

export function successResponse(res, status, data) {
  res.status(status || 200).json(data);
  return;
}
