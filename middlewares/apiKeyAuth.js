const apiKeyAuth = (key) => {
  return (req, res, next) => {
    const clientKey = req.headers["x-api-key"];
    if (!clientKey || clientKey !== key) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or missing API key",
      });
    }
    return next();
  };
};

module.exports = { apiKeyAuth };
