const { Customer, validateCustomer } = require("../models/customer")
const express = require("express")
const router = express.Router()


router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name").select({ name: 1, isGold: 1, phone: 1 })
  res.status(200).send(customers)
})


router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  })

  try {
    const result = await customer.save()
    res.status(200).send(result)
  }
  catch (ex) {
    for (field in ex.errors) {
      res.status(404).send(ex.errors[field].message)
    }
  }
})


router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    }, { new: true })
    res.status(200).send(customer)
  }
  catch (ex) {
    res.status(404).send(`The customer with the given ID ${req.params.id} was not found!`)
  }
})


router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select({ name: 1, phone: 1, isGold: 1 })
    res.status(200).send(customer)
  }
  catch (ex) {
    res.status(404).send(`The customer with the given ID ${req.params.id} was not found!`)
  }
})


router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    res.status(200).send(customer)
  }
  catch (ex) {
    res.status(404).send(`The customer with the given ID ${req.params.id} was not found!`)
  }
})


module.exports = router
