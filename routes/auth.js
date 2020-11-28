const { User } = require("../models/user")
const _ = require("lodash")
const bcrypt = require("bcrypt")
const Joi = require("joi-browser")
const express = require("express")
const router = express.Router()


const validate = (req) => {
  const schema = {
    email: Joi.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    password: Joi.string().min(5).max(1024)
  }
  return Joi.validate(req, schema)
}


router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Invalid Email or Password!")

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send("Invalid Email or Password!")

  const token = user.generateToken()
  res.status(200).header("x-ath-token", token).send(_.pick(user, ["_id", "name", "email"]))
})

module.exports = router