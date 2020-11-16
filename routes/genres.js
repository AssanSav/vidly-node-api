const {Genre, validateGenre} = require("../models/genre")
const express = require('express')
const router = express.Router()


router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name")
  res.status(200).send(genres)
});


router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = new Genre({ name: req.body.name })
  try {
    const result = await genre.save()
    res.send(result)
  }
  catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message)
    }
  }
});


router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    res.status(200).send(genre)
  }
  catch (ex) {
    res.status(404).send(`The genre with the given ID ${req.params.id} is not found!`)
  }
})


router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    res.status(200).send(genre)
  }
  catch (ex) {
    res.status(404).send(`The genre with the given ID ${req.params.id} is not found!`)
  }
})


router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id)
    res.status(200).send(genre)
  }
  catch (ex) {
    res.status(404).send(`The genre with the given ID ${req.params.id} is not found!`)
  }
})

module.exports = router;
