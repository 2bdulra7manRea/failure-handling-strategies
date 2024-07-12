import express from "express";
import endpointCircuitBreaker from "./circuit-breaker/index.js";
const app = express();

app.get("/circuit-breaker", endpointCircuitBreaker);

app.listen(3000, () => {
  console.log("Server is running on 3000");
});
