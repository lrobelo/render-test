const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": "1"
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": "2"
	},
	{
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": "3"
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": "4"
	},
	{
		"id": "a92f",
		"name": "Nala",
		"number": "505-88515985"
	}
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/info', (request, response) => {
	const date = new Date()
	const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
	response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const person = persons.find(person => person.id === id)

	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const maxId = persons.length > 0 ?
		Math.max(...persons.map(person => Number(person.id))) : 0

	const newPerson = request.body
	newPerson.id = (maxId + 1).toString()

	if (!newPerson.name || !newPerson.number) {
		return response.status(400).json({
			error: 'name or number missing'
		})
	}

	if (persons.find(person => person.name === newPerson.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	persons = persons.concat(newPerson)
	response.json(newPerson)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})