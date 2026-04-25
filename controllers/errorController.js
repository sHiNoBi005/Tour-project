import AppError from '../utils/appError.js';

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const keyValues = err && err.keyValue ? Object.values(err.keyValue) : [];
  const messageMatch =
    err && err.message ? err.message.match(/(["'])(?:\\.|[^\\])*?\1/) : null;
  const value =
    keyValues[0] || (messageMatch && messageMatch[0]) || 'already exists';
  const message = `Duplicate field value: ${value}. Please use another field!.`;

  return new AppError(message, 400);
};

const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const SendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err,
    stack: err.stack,
  });
};

const handleJwtExpiredError = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const SendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak error data
    //1) Log Error
    console.log('ERROR🚩', err);

    //2) Send generated message
    res.status(500).json({
      status: 'error',
      message: "There was an error, it's a problem from the server side! :(",
    });
  }
};
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    SendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Some error fields can be lost on plain spread depending on Error internals.
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.code = err.code;
    error.keyValue = err.keyValue;
    error.errors = err.errors;

    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidateErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();

    SendErrorProd(error, res);
  }
};
