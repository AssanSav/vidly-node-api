const { User, validateUser } = require("../models/user")
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()


router.get("/", async (req, res) => {
  const users = await User.find().select("name email -_id")
  res.status(200).send(users)
})


router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v")
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send("Something went wrong.")
  }

})


router.post("/", async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send("Email address already taken!")

  user = new User(_.pick(req.body, ["name", "email", "password"]))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateToken()
  res.status(200).header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]))
})

module.exports = router