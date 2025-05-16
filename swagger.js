// backend/swagger.js
const swaggerAutogen = require("swagger-autogen")();

// Swagger documentation
//This file is used to generate the swagger-output.json file
// with the help of the swagger-autogen package.
const doc = {
  info: {
    title: "RBAC API",
    description: "Документация API для системы RBAC",
  },
  // Shows only the first level of the path
  host: "localhost:5000",
  schemes: ["http"],
};

// shows files with endpoints
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js", "./routes/*.js"];

// Generate swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // You can also start the server after the documentation is generated
  // require('./app.js');
  require("./app.js");
});
