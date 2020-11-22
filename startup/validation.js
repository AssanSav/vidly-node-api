const Joi = require("joi-browser")


module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi)
}