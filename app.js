import express from "express"; //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
import errorHandler from "./core/errorHandler.js";
import mailService from './routes/emailService/index.js';

// api routes starts here
app.use(mailService);

// middleware for error handling
app.use(errorHandler);

export default app;



