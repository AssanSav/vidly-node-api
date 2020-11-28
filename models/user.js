const config = require("config")
const jwt = require("jsonwebtoken")
const Joi = require("joi-browser")
const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email"
    },
    required: [true, "Email required"]
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
})


userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"))
  return token
}

const User = mongoose.model("User", userSchema)


const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    password: Joi.string().min(5).max(1024)
  }
  return Joi.validate(user, schema)
}


module.exports = {
  User,
  validateUser
}