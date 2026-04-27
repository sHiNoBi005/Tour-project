import DOMPurify from 'isomorphic-dompurify';

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return DOMPurify.sanitize(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    const sanitized = {};

    Object.keys(value).forEach((key) => {
      sanitized[key] = sanitizeValue(value[key]);
    });

    return sanitized;
  }

  return value;
}

const xssSanitize = () => (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  next();
};

export default xssSanitize;
