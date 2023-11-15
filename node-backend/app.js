const express = require('express')
const bodyParser = require('body-parser')
const placesRouter = require('./routes/places-routes')
const usersRouter = require('./routes/users-routes')
const HttpError = require('./models/http-error')
const mongoose = require('mongoose');
var cors = require('cors')



const app = express()
const url =
  'mongodb+srv://prmdpsn56:swdGxZ3cqdKY8FiD@cluster0.sp8zp.mongodb.net/?retryWrites=true&w=majority'
//body parser call the next function automatically

// app.use(cors({
//   origin: 'http://localhost:3000'
// }));

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});
app.use('/api/places', placesRouter)
app.use('/api/users', usersRouter)

app.use((req, res, next) => {
  const error = new HttpError(
    'Could not find this route, Please enter a correct path for this.',
    404
  )
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return
  }
  res.status(error.code || 500).json({ message: error.message })
})

mongoose
  .connect(url, {
    dbName: 'MERN_PLACES',
  })
  .then(() => {
    app.listen(8080)
  })
  // eslint-disable-next-line no-console
  .catch((error) => console.log(error))
