const { Movie, validateMovie } = require("../models/movie")
const express = require("express")
const { Genre, validateGenre } = require("../models/genre")
const genre = require("../models/genre")
const movie = require("../models/movie")
const mongoose = require("mongoose")
const router = express.Router()


router.get("/", async (req, res) => {
  const movies = await Movie.find()
  res.status(200).send(movies)
})


router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
  }
  catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message)
    }
  }
});


router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  if (mongoose.Types.ObjectId.isValid(req.params.id)) 
    return res.status(404).send(`The movie with the given ID ${req.params.id} is not found!`)

  try {
    const genre = await Genre.findById(req.body.genreId);
    let movie = await Movie.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }
    }, { new: true })
    res.status(200).send(movie)
  }
  catch (ex) {
    if (!genre) return res.status(404).send(`The genre with the given ID ${req.params.id} is not found!`)
  }
})


router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    res.status(200).send(movie)
  } catch (ex) {
    res.status(404).send(`The movie with the given ID ${req.params.id} is not found!`)
  }
})


router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    res.status(200).send(movie)
  } catch (ex) {
    res.status(404).send(`The movie with the given ID ${req.params.id} is not found!`)
  }
})


module.exports = router