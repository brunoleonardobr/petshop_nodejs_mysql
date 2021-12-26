const express = require("express")
const consign = require("consign")

module.exports = () => {
  const app = express()
  app.use(express.urlencoded())
  consign()
  .include("controllers")
  .into(app)

  return app
}


