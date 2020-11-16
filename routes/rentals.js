const { Customer } = require("../models/customer")
const { Movie } = require("../models/movie")
const { Rental, validateRental } = require("../models/rental")
const Fawn = require("fawn")
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

Fawn.init(mongoose)


router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut")
  res.status(200).send(rentals)
})


router.post("/", async (req, res) => {
  const { error } = validateRental(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send(`The customer with the given ID ${req.params.id} was not found!`)

  const movie = await Movie.findById(req.body.movieId)
  if (!movie)
    return res.status(400).send(`The movie with the given ID ${req.params.id} was not found!`)

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie out of stock!")

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    }
  })

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run()

    res.status(200).send(rental)
  } catch (ex) {
    res.status(500).send("Something failed!")
  }
})

module.exports = router