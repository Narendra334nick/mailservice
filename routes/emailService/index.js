import express from "express";
const app = express.Router();
import upload from '../../services/upload.js';

import { sendMail } from "./controller.js";

app.get("/", (req, res) => {
	res.send('working fine');
});

app.post('/sendMail',upload.single('file'),sendMail);

export default app;