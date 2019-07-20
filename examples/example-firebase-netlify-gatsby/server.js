require('dotenv').config()

const cms = require('./functions')
const port = process.env.PORT || 5000

cms.listen(port, () => console.log('listening on port', port))
