// Create an app with express
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import requestLogger from "./src/middleware/logger.js";

//@Create dotenv config
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

//@Roots
app.get("/", (request, response) => {
  response.status(200).send("<h1>Welcome to my REST-API</h1>");
});

//@import router
import ExpenseRouter from "./src/routers/index.js";
app.use("/api", ExpenseRouter);

//@create server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
