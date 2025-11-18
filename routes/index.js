require("dotenv").config();
const express = require("express");
const axios = require("axios");
const CircuitBreaker = require("opossum");

const router = express.Router();
const { log } = require("../utils/logger");
const { apiKeyAuth } = require("../middlewares/apiKeyAuth");

const INTERNAL_SECRET = process.env.INTERNAL_SECRET;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

const READING_SERVICE_INSTANCES = [process.env.READING_SERVICE_1];

let rrIndex = 0;
const getNextInstance = () => {
  const instance = READING_SERVICE_INSTANCES[rrIndex];
  rrIndex = (rrIndex + 1) % READING_SERVICE_INSTANCES.length;
  return instance;
};

const axiosRequest = async (config) => {
  const instance = getNextInstance();
  return axios({
    ...config,
    baseURL: instance,
    timeout: parseInt(process.env.CB_TIMEOUT),
  });
};

const breakerOptions = {
  timeout: parseInt(process.env.CB_TIMEOUT) || 4000,
  errorThresholdPercentage: parseInt(process.env.CB_ERROR_THRESHOLD) || 50,
  resetTimeout: parseInt(process.env.CB_RESET_TIMEOUT) || 10000,
};

const breaker = new CircuitBreaker(axiosRequest, breakerOptions);

breaker.on("open", () => log("Circuit breaker opened"));
breaker.on("halfOpen", () => log("Circuit breaker half-open"));
breaker.on("close", () => log("Circuit breaker closed"));

router.post("/readings", apiKeyAuth(GATEWAY_API_KEY), async (req, res) => {
  try {
    const response = await breaker.fire({
      url: "/readings/create",
      method: "POST",
      headers: {
        "x-tenant-id": req.tenantId,
        "x-internal-secret": INTERNAL_SECRET,
      },
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(503)
      .json({ error: "Reading Service unavailable. Please try later." });
  }
});

module.exports = router;
