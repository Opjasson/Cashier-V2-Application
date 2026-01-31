import express from "express";
import { addCart, getCartAll } from "../controllers/cartControllers.js";

const route = express.Router();

route.get("/cart", getCartAll);
route.post("/cart", addCart);

export default route;
