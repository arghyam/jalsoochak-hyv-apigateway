const rateLimit = require("express-rate-limit");

const readingRateLimiter = rateLimit({
  windowMs: Number(process.env.window_size_in_minutes) * 60 * 1000,
  max: process.env.max_requests_per_minute,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { readingRateLimiter };
