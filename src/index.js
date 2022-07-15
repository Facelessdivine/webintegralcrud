const path = require("path");
const morgan = require("morgan");

const express = require("express");

const helmet = require("helmet");
const http = require("http");

const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10000,
});

const app = express();

const cors = require("cors");

app.use(require("express-status-monitor")());

app.use("/", apiLimiter);

app.use(cors());

require("./database");

app.use(morgan("dev"));

app.use(express.json());

app.use(helmet());

const routes = require("./routes/index");

app.use(routes);

app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(path.resolve("uploads")));

app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"));

console.log("Server on port", app.get("port"));
