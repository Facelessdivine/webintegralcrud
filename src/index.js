const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("./database");
const routes = require("./routes/index");

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10000,
});

const app = express();

const cors = require("cors");

//middleware
app.use(require("express-status-monitor")());
app.use("/", apiLimiter);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(routes);
app.use(express.urlencoded({ extended: false }));


//puerto por el que se ejecuta la api
app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"));

console.log("Server on port ", app.get("port"));
