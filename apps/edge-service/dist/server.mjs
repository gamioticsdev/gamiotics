// src/server.ts
import * as hypExp from "hyper-express";
var port = 8080;
var server = new hypExp.Server();
server.listen(port).then((_socket) => console.log("Webserver started on port " + port)).catch((_error) => console.log("Failed to start webserver on port " + port));
