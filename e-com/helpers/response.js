export const successResponse = (
  res,
  message,
  statusCode,
  data = null,
  token = null,
  meta = null,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    token,
    meta,
  });
};

export const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
export const handleRouteError = (error, res) => {
  console.error("Error Happen:", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
};
