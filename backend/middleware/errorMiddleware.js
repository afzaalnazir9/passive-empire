const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`); // Corrected string interpolation
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Check if headers are already sent
  if (res.headersSent) {
    return next(err); // Delegate to the default Express error handler
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };

