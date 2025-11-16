const express = require("express");
const routes = require("./routes/index");
const tenantMiddleware = require("./middlewares/tenant");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(tenantMiddleware);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
