const bcrypt = require("bcrypt")

const runSalt = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  console.log(hashed)
}

runSalt("1234")

