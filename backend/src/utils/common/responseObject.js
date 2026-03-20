const successResponse = (message, data = null, statusCode = 200) => ({
  success: true,
  message,
  data,
  statusCode,
});

const errorResponse = (message, error = null, statusCode = 500) => ({
  success: false,
  message,
  error,
  statusCode,
});

export { successResponse, errorResponse };
