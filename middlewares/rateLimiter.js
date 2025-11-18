const rateLimit = require("express-rate-limit");

const readingRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30, 
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false, 
});

module.exports = { readingRateLimiter };

