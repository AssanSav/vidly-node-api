const { Genre, validateGenre } = require("../models/genre")
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require('express');
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router()


router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name")
  res.status(200).send(genres)
});


router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let genre = new Genre({ name: req.body.name })
  await genre.save()
  res.send(genre)
});


router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
  res.status(200).send(genre)
})


router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id)
  res.status(200).send(genre)
})


router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  res.status(200).send(genre)
})


module.exports = router;
