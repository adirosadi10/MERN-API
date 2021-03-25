const express = require ('express')

const app = express()
app.use(() => {
  console.log('hahahahah')
})

app.listen(4000)