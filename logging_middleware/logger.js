// logging_middleware/logger.js
// Centralized logging middleware used across backend stages.
// Logs method, URL, status code, response time, and body for every request.

const logger = (req, res, next) => {
  const start = Date.now();
  const { method, url, body } = req;

  // Intercept res.json to capture response body for logging
  const originalJson = res.json.bind(res);
  let responseBody;

  res.json = (data) => {
    responseBody = data;
    return originalJson(data);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method,
      url,
      status: res.statusCode,
      duration_ms: duration,
      request_body: method !== 'GET' ? body : undefined,
      response_summary: responseBody
        ? typeof responseBody === 'object'
          ? `${Array.isArray(responseBody.data) ? responseBody.data.length + ' items' : 'object'}`
          : String(responseBody)
        : 'no body',
    };

    console.log('[LOGGER]', JSON.stringify(logEntry, null, 2));
  });

  next();
};

module.exports = logger;