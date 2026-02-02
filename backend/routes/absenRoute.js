import express from "express";
import { 
    createAbsen,
    deleteAbsen,
    getAbsenByUserId,
    getAbsens,
    updateData_Absen
} from "../controllers/absenController.js"

const route = express.Router();

route.get("/absen", getAbsens);
route.get("/absen/:id", getAbsenByUserId);
route.post("/absen", createAbsen);
route.patch("/absen/:id", updateData_Absen);

export default route;