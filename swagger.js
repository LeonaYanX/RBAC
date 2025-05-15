// backend/swagger.js
const swaggerAutogen = require("swagger-autogen")();

// Настройка документа: заголовок, описание и (при необходимости) авторизация
const doc = {
  info: {
    title: "RBAC API",
    description: "Документация API для системы RBAC",
  },
  // указываем, где будет работать ваш сервер (host + порт)
  host: "localhost:5000",
  schemes: ["http"],
};

// Список файлов с вашими маршрутизаторами (можно glob-паттерн)
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js", "./routes/*.js"];

// Генерируем swagger-output.json при старте
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // После генерации запускаем ваш сервер
  require("./app.js");
});
