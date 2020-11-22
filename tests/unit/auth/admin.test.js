const mongoose = require("mongoose")
const admin = require("../../../middleware/admin")
const { User } = require("../../../models/user")


describe("admin middleware", () => {
  it("should move the middleware to the next function if user is an admin", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      name: "Assane",
      isAdmin: true
    }
    const token = new User(user).generateToken()
    const req = {
      header: jest.fn().mockReturnValue(token),
      user
    }
    const res = {}
    const next = jest.fn()
    admin(req, res, next)
    expect(req.user).toMatchObject(user)
  })

  it("should return a 403 if the user is not an admin", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: false
    }
    const token = new User(user).generateToken()
    const req = {
      header: jest.fn().mockReturnValue(token),
      user
    }
    const res = {}
    const next = jest.fn()
    admin(req, res, next)
    expect(req.user.isAdmin).toBeFalsy()
  })
})