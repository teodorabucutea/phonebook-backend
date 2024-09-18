const express = require("express");
const app = express();

app.use(express.json());
var morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("postData", (request) => {
  if (request.method == "POST") return " " + JSON.stringify(request.body);
  else return " ";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);
app.get("/", (request, response) => {
  response.send("<h1>Hello World change!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  numberOfPeople = persons.length;

  const currentTime = new Date().toLocaleString();

  response.send(
    `<p>Phonebook has info for ${numberOfPeople} people</p><br/><p>${currentTime}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log(`DELETE request received for ID: ${id}`);

  // Check if the ID is present in the array before deleting
  const personToDelete = persons.find((person) => person.id === id);

  if (!personToDelete) {
    console.log(`No person found with ID: ${id}`);
    return response.status(404).json({ error: "Person not found" });
  }

  // Filter out the person with the matching ID
  persons = persons.filter((person) => person.id !== id);
  console.log(
    `Person with ID ${id} deleted. Updated persons list: ${JSON.stringify(
      persons
    )}`
  );

  // Respond with 204 No Content status
  response.status(204).end();
});

// POST route to add a new person
app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  // Check if name or number is missing
  if (!name || !number) {
    return response.status(400).json({ error: "Name or number missing" });
  }

  // Check if name already exists
  const nameExists = persons.some((person) => person.name === name);
  if (nameExists) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  // Generate a new id
  const newId = (Math.random() * 1000000).toFixed(0);

  // Create the new person object
  const newPerson = { id: newId, name, number };

  // Add the new person to the list
  persons = persons.concat(newPerson);

  // Respond with the created person object
  response.status(201).json(newPerson);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
