function notFoundHandler(req, res) {
  return res.status(404).json({ message: 'Route not found.' });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('Unhandled request error:', err.name || 'Error', err.statusCode || 500);
  } else {
    console.error('Unhandled error:', err);
  }

  const status = err.statusCode || (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000 ? 400 : 500);
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again.'
    : (err.message || 'Internal server error.');

  return res.status(status).json({
    message,
  });
}

module.exports = { notFoundHandler, errorHandler };
