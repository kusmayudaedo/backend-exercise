// Create an app with express

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import { uuid } from "uuidv4";
import requestLogger from "./src/middleware/logger.js";
import apiKeyValidator from "./src/middleware/api.key.validator.js";

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
app.use(requestLogger);

//@Handle Get data user
app.get("/api/v1/users", apiKeyValidator, (request, response) => {
  try {
    //@Read data from JSON file
    const users = JSON.parse(fs.readFileSync("./json/users.json", "utf8"));
    //send response to client
    response.status(200).json(users);
  } catch (error) {
    console.error(error);
    response.status(500).json("Server error");
  }
});

//@handle api key request
app.post("/api/request-api-key", (request, response) => {
  try {
    //@generate api key using UUID
    const apiKey = uuid();

    //@read the file form api.keys.json
    const apiKeys = JSON.parse(fs.readFileSync("./json/api.keys.json", "utf8"));

    //@save API keys data
    apiKeys.push({
      key: apiKey,
      name: request.body.name,
      email: request.body.email,
    });

    //@write the api keys
    fs.writeFileSync("./json/api.keys.json", JSON.stringify(apiKeys));

    //@send response to client
    response.status(201).json({ key: apiKey });
  } catch (error) {
    console.error(error);
    response.status(500).json("Server error");
  }
});

//@create server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
