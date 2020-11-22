const request = require("supertest");
const { Customer } = require("../../../models/customer");
const { User } = require("../../../models/user");
let server;

describe("api/customers", () => {
  beforeEach(() => { server = require("../../../index") })

  afterEach(async () => {
    server.close();
  })

  describe("POST /", () => {
    it("should return a 200 status code if the customer object is saved to the database", async () => {
      const token = new User().generateToken()
      const customer = {
        name: "Assane",
        isGold: true,
        phone: 917 - 478 - 9882
      }
      const res = await request(server)
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({
          name: "Assane",
          isGold: true,
          phone: "917-478-9882"
        })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("_id")
      expect(res.body).toHaveProperty("name", customer.name)
      expect(res.body).toHaveProperty("isGold", customer.isGold)
    })
  })
})