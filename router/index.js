const express = require('express')
const router = express.Router()

const TEST_ROUTE = '/test'

function test(req, res) {
  res.send(req.body)
}

router.post(TEST_ROUTE, test)

module.exports = router