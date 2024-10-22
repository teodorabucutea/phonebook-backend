require("dotenv").config();

const express = require("express");
const app = express();

const PhoneBook = require("./models/phoneBook");

app.use(express.static("dist"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

var morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Middleware to check for existing entry by name
// const checkExistingEntry = (req, res, next) => {
//   const { name, number } = req.body;

//   if (!name || !number) {
//     return res.status(400).json({ error: "Name or number missing" });
//   }

//   PhoneBook.findOne({ name })
//     .then((existingEntry) => {
//       if (existingEntry) {
//         // Entry exists, proceed to update
//         req.existingEntry = existingEntry;
//         return next();
//       }
//       // If entry does not exist, create a new one
//       next("route");
//     })
//     .catch((error) => next(error));
// };

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// // POST route to add a new person
// app.post("/api/persons", checkExistingEntry, (request, response) => {
//   const { name, number } = request.body;

//   const newPerson = new PhoneBook({ name, number });
//   newPerson
//     .save()
//     .then((savedEntry) => {
//       response.status(201).json(savedEntry);
//     })
//     .catch((error) => next(error));
// });

// // PUT route to update an existing person
// app.put("/api/persons", (request, response) => {
//   const { existingEntry } = request;
//   const { number } = request.body;

//   if (existingEntry) {
//     existingEntry.number = number; // Update number
//     existingEntry
//       .save()
//       .then((updatedEntry) => {
//         response.json(updatedEntry);
//       })
//       .catch((error) => next(error));
//   } else {
//     response.status(404).send({ error: "Person not found" });
//   }
// });

// const checkExistingEntry = (req, res, next) => {
//   const { name, number } = req.body;

//   if (!name || !number) {
//     return res.status(400).json({ error: "Name or number missing" });
//   }

// // POST route to add a new person
// app.post("/api/persons", (request, response) => {
//   const { name, number } = request.body;

//   // Check if name or number is missing
//   if (!name || !number) {
//     return response.status(400).json({ error: "Name or number missing" });
//   }

//   // Check if name already exists
//   const nameExists = persons.some((person) => person.name === name);
//   if (nameExists) {
//     return response.status(400).json({ error: "Name must be unique" });
//   }

//   // Generate a new id
//   const newId = (Math.random() * 1000000).toFixed(0);

//   // Create the new person object
//   const newPerson = { id: newId, name, number };

//   // Add the new person to the list
//   persons = persons.concat(newPerson);

//   // Respond with the created person object
//   response.status(201).json(newPerson);
// });

//   PhoneBook.findOne({ name })
//     .then((existingEntry) => {
//       if (existingEntry) {
//         // Entry exists, proceed to update
//         req.existingEntry = existingEntry;
//         return next();
//       }
//       // If entry does not exist, create a new one
//       next("route");
//     })
//     .catch((error) => next(error));
// };

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

// app.post("/api/persons", (request, response) => {
//   const body = request.body;
//   console.log(body.name);
//   if (!body.name || !body.number) {
//     return response
//       .status(400)
//       .json({ error: "Both name and number are required" });
//   }

//   const savedEntry = new PhoneBook({
//     name: body.name,
//     number: body.number,
//   });

//   savedEntry.save().then((entry) => {
//     response.json(entry);
//   });
// });

app.get("/api/persons", (request, response) => {
  PhoneBook.find({}).then((entries) => {
    response.json(entries);
  });
});

app.get("/info", (request, response) => {
  numberOfPeople = persons.length;

  const currentTime = new Date().toLocaleString();

  response.send(
    `<p>Phonebook has info for ${numberOfPeople} people</p><br/><p>${currentTime}</p>`
  );
});

// app.get("/persons/:id", (request, response) => {
//   PhoneBook.findById(request.params.id).then((person) => {
//     response.json(person);
//   });
// });

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  PhoneBook.findById(id) // Use your database method to find by ID
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })

    .catch((error) => next(error));

  // .catch((error) => {
  //   console.error(error);
  //   response.status(400).send({ error: "malformatted id" });
  // });
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   console.log(`DELETE request received for ID: ${id}`);

//   // Check if the ID is present in the array before deleting
//   const personToDelete = persons.find((person) => person.id === id);

//   if (!personToDelete) {
//     console.log(`No person found with ID: ${id}`);
//     return response.status(404).json({ error: "Person not found" });
//   }

//   // Filter out the person with the matching ID
//   persons = persons.filter((person) => person.id !== id);
//   console.log(
//     `Person with ID ${id} deleted. Updated persons list: ${JSON.stringify(
//       persons
//     )}`
//   );

//   // Respond with 204 No Content status
//   response.status(204).end();
// });

app.delete("/api/persons/:id", (request, response, next) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
