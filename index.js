require('dotenv').config()

const express = require('express')
const app = express()

const PhoneBook = require('./models/phoneBook')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    console.log('got to validation error')
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  console.log(' 500 app.post api/persons')
  const newPerson = new PhoneBook({ name, number })

  // newPerson.path("number").validate(name.validate.validator, "test validation");
  newPerson
    .save()
    .then((savedEntry) => {
      response.status(201).json(savedEntry)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const { name, number } = request.body

  PhoneBook.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((updatedEntry) => {
      console.log('updatedEntry', updatedEntry)
      if (updatedEntry) {
        response.json(updatedEntry)
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

morgan.token('postData', (request) => {
  if (request.method === 'POST') return ' ' + JSON.stringify(request.body)
  else return ' '
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
)
app.get('/', (response) => {
  response.send('<h1>Hello World change!</h1>')
})

app.get('/api/persons', (response) => {
  PhoneBook.find({}).then((entries) => {
    response.json(entries)
  })
})

app.get('/info', (response) => {
  numberOfPeople = !persons.length

  const currentTime = new Date().toLocaleString()

  response.send(
    `<p>Phonebook has info for ${numberOfPeople} people</p><br/><p>${currentTime}</p>`
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  PhoneBook.findById(id) // Use your database method to find by ID
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
