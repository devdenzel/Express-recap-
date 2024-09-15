// Setting Up Express and Reading the JSON File
const express = require('express')
const morgan = require('morgan')
const app = express()

const moviesRouter = require('./Routes/moviesRoutes')



// custom middleware function that logs a message whenever a request hits your server. It calls next() to pass control to the next middleware in the stack.
const logger =  function(req, res, next) {
   console.log('Custom middleware called')
    next()
}
// Middleware that parse incoming JSON request
app.use(express.json())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// The logger middleware function defined earlier is then added, logging "Custom middleware called" on every request.
app.use(logger)

//to serve static files
app.use(express.static('./Public'))

// This middleware adds a requestedAt property to the request object, containing the timestamp of when the request was made.
app.use((req, res, next) =>{
    req.requestedAt = new Date().toISOString()
    next()
})
// api/movies
/* app.get('/movies', getAllMovies)
app.get('/movies/:id', getRouteId)
app.post('/movies', createMovies)
app.patch('/movies/:id', updateMovie)
app.delete('/movies/:id', deleteMovie) */

// defining route for non existent URLS
app.all('*', (req, res, next) => {
   // res.status(404).json({
       // status: "fail",
       // message: `Cant find ${req.originalUrl} on the server!`
    //})
    const err = new Error(`Cant find ${req.originalUrl} on the server!`)
    err.status = 'fail'
    err.statusCode = 404

    next(err)
})

app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.statusCode ||'error'
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    })
})

// using our imported route module.
app.use('/movies', moviesRouter)

// import server
module.exports = app