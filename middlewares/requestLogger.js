const { log } = require("../utils/logger");

const requestLogger = (req, res, next) => {
  log(
    `${req.method} ${req.originalUrl} Tenant: ${
      req.headers["x-tenant-id"] || "unknown"
    }`
  );
  next();
};

module.exports = requestLogger;
