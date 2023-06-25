//@Create middleware
function requestLogger(request, response, next) {
  console.log(`${request.method} : ${request.url}`);
  //Next to the next handler
  next();
}


export default requestLogger