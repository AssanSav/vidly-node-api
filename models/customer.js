const mongoose = require("mongoose")
const Joi = require("joi-browser")


const customersSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})


const Customer = mongoose.model("Customer", customersSchema)


const validateCustomer = (customer) => {
  const schema = {
    name: Joi.string().min(2).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().trim().regex(/\d{3}-\d{3}-\d{4}/).required()
  }
  return Joi.validate(customer, schema)
}


module.exports = {
  Customer,
  validateCustomer
}