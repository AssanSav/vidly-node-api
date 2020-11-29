const { Movie, validateMovie } = require("../models/movie")
const { Genre, validateGenre } = require("../models/genre")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const genre = require("../models/genre")
const movie = require("../models/movie")
const mongoose = require("mongoose")
const express = require("express")
const validateObjectId = require("../middleware/validateObjectId")
const router = express.Router()



router.get("/", async (req, res) => {
  const movies = await Movie.find()
  res.status(200).send(movies)
})


router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
});


router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validateMovie(req.body)
  if (error) return res.status(400).send(error.details[0].message)

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
})


router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)
  res.status(200).send(movie)

})


router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  res.status(200).send(movie)
})


module.exports = router