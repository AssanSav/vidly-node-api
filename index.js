const Joi = require("joi-browser")
Joi.objectId = require("joi-objectid")(Joi)
const mongoose = require("mongoose")
const customers = require("./routes/customers")
const genres = require("./routes/genres")
const movies = require("./routes/movies")
const rentals = require("./routes/rentals")
const logger = require("./middleware/logger")
const morgan = require("morgan")
const helmet = require("helmet")
const express = require("express")
const app = express()

// Connect to MongoDB
mongoose.connect("mongodb://localhost/vidly", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Could not connect to mongoDB..."))

app.use(logger)
app.use(helmet())
app.use(morgan("tiny"))
app.use(express.json())
app.use("/api/genres", genres)
app.use("/api/customers", customers)
app.use("/api/movies", movies)
app.use("/api/rentals", rentals)

const port = process.env.PORT || 3000 
app.listen(port, () => console.log(`Listening on port ${port}...`))