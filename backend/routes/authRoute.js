import express from "express";
import { forgotPassword, login } from "../controllers/authController.js";

const route = express.Router();

route.post("/login", login);
route.post("/forgotPass", forgotPassword);

export default route;
