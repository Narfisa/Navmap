const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')

app.use(
    express.urlencoded({
      extended: true
    })
  )
  
app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})

module.exports = app;