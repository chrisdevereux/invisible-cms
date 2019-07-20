require('dotenv').config()

const express = require('express')
const { cms } = require('./functions')
const port = process.env.PORT || 5000

const app = express()
app.use('/cms', cms.middleware)

app.listen(port, () => console.log('listening on port', port))
