const winston = require("winston")
const express = require("express")
const app = express()

require("./startup/config")()
require("./startup/logging")(app)
require("./startup/validation")()
require("./startup/routes")(app)
require("./startup/db")()


// const p = Promise.reject(new Error("Something failed miserably!"))
// p.then(() => console.log("Done!"))

// throw new Error("Something failed during startup.") 

const port = process.env.PORT || 3000 
app.listen(port, () => winston.info(`Listening on port ${port}...`))