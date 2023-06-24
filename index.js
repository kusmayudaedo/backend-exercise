// Create an app with express

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import { uuid } from "uuidv4";

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

//@Handle Get data user
app.get("/api/v1/users", (request, response) => {
  try {
    //@Read data from JSON file
    const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
    //send response to client
    response.status(200).json(users);
  } catch (error) {
    console.error(error);
    response.status(500).json("Server error");
  }
});

//@handle POST
app.post("/api/v1/users", (request, response) => {
  try {
    //@read the data from body
    const body = request.body;

    //@read data from JSON file
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

    const newUsers = {
      id: users.length + 1,
      uuid: uuid(),
      role: "user",
      ...body,
    };
    //@add data to file
    users.push(newUsers);

    //@Write data to file
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    //@send response
    response.status(201).json({ message: "Success", users: newUsers });
  } catch (error) {
    console.error(error);
    response.status(500).json("Server error");
  }
});

//@Handle get users by uuid
app.get("/api/v1/users/:uuid", (request, response) => {
  try {
    //@read data from json file
    const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

    //find user by uuid
    const user = users.find((user) => user.uuid === request.params.uuid);

    //check if user exists
    if (!user) {
      response.status(404).json({ message: "User not found" });
    } else {
      response.status(200).json({ user });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json("Server error");
  }
});

//@Update user by uuid
app.put("/api/v1/users/:uuid", (request, response) => {
  try {
    //@read body
    const body = request.body;

    //@read data from file
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

    const user = users.find((user) => user.uuid === request.params.uuid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = body.name;
    user.email = body.email;

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    response
      .status(200)
      .json({ message: "User updated successfully", user: user });
  } catch (error) {
    console.error(error);
    response.status(500).json("Server error");
  }
});

//@Handle DELETE

app.delete("/api/v1/users/:uuid", (request, response) => {
  try {
    // @read users from json file
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

    // @get user
    const user = users.find((user) => user.uuid === request.params.uuid);

    // @if user not found
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // @delete user
    users.splice(users.indexOf(user), 1);

    // @write users to json file
    fs.writeFileSync("users.json", JSON.stringify(users, null, 4));

    // @send response to client
    response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server Error" });
  }
});

//@create server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
