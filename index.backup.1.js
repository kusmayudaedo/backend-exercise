/* INDEX BACKUP
- belum menggunakan express js
*/

//@Import module http
//const http = require("http");

//using type : module
import http from "http";

//@Database
const database = [
  {
    id: 1,
    name: "jhon",
    birthdate: "1990-01-01",
    email: "jhon@example.com",
  },
];

/*@request URL
GET : http://localhost:3000/ -> "Welcome"
GET : http://localhost:3000/api/user -> "database"
POST : http://localhost:3000/api/user -> "createuser"
PUT : http://localhost:3000/api/user/:id -> "Update user"
DELETE : http://localhost:3000/api/user/:id -> "Delete user"
*/

/*@HTTP method
GET : Read data
POST : Write data
PUT/PATCH : Update data
DELETE : Delete data
*/

//@Create server instance
const server = http.createServer((request, response) => {
  /*@Request bisa digali lagi
  console.log(
    "Request received: " + request.url,
    request.method,
    request.headers
  ); */
  //handel the request
  if (request.url === "/" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/HTML" });
    response.end("Welcome to the API");
  }

  if (request.url === "/api/users" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });
    //@Change to plain text response
    response.end(JSON.stringify(database));
  }

  //Handle POST requests
  if (request.url === "/api/users" && request.method === "POST") {
    //Create a variable to hold the user information
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const { name, birthdate, email } = JSON.parse(body);
      database.push({
        id: database.length + 1,
        name,
        birthdate,
        email,
      });
      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify(database));
    });
  }

  //@Handle PUT request
  //Match the url
  if (request.url.match(/\/api\/users\/([0-9]+)/) && request.method === "PUT") {
    const id = request.url.split("/")[3];
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const { name, birthdate, email } = JSON.parse(body);
      //@Update data dengan ID = :id
      database[id - 1] = {
        id: Number(id),
        name,
        birthdate,
        email,
      };
    });
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(database));
  }

  //@Handle DELETE request
  if (
    request.url.match(/\/api\/users\/([0-9]+)/) &&
    request.method === "DELETE"
  ) {
    const id = request.url.split("/")[3];
    database.splice(id - 1, 1);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(database));
  }
});

//@Listening port
const PORT = 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

/*@ Note 
Ketika server nerima request di Port 3000 maka akan manggil callback function server akan jalan dan mengirimkan response */
