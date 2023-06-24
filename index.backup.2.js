// Create an app with express

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

//@create an app
const app = express();

//@BodyParser
/* 
Use body parser as a middleware to intercep the body of the request
Convert the body into JSON and send it to request.body so it can be used to handle the request
*/
//Apply the body parser globally
app.use(bodyParser.json());

const database = [
  {
    id: 1,
    name: "jhon",
    birthdate: "1990-01-01",
    gender: "male",
  },
];

//@create route
app.get("/", (request, response) => {
  response.send("<h1>Welcome to the App </h1>");
});

//@Handle basci CRUD for the database, based api /api/v1/users
app.get("/api/v1/users", (request, response) => {
  response.status(200).json(database);
});

//@hanle POST
app.post("/api/v1/users", (request, response) => {
  //create a new variable to hold the data from request
  //request.body came from the bodyparser
  const body = request.body;

  //Add the data to the database
  database.push({ ...body, id: database.length + 1 });

  //Send response
  response.status(201).json(database);
});

//@handle PUT
app.put("/api/v1/users/:id", (request, response) => {
  const body = request.body;
  const id = request.params.id;

  //update databse
  database[id - 1] = { ...body, id: id };

  //send response
  response.status(200).json(database[id - 1]);
});

//@handle DELETE
app.delete("/api/v1/users/:id", (request, response) => {
  const id = request.params.id;

  //delete from databse
  database.splice(id - 1, 1);

  //send response
  response.status(200).json(database);
});

//@create server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
