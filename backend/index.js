import express from "express";
import barang from "./models/barangModel.js";
import barang_Route from "./routes/barangRoute.js";
import transaksi_Route from "./routes/transaksiRoute.js";
import cart_Route from "./routes/cartRoute.js";
import user_Route from "./routes/userRoute.js";
import auth_Route from "./routes/authRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import transaksi from "./models/absenModel.js";

// (async() => {
//     await transaksi.sync()
// })()

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(user_Route);
app.use(barang_Route);
app.use(transaksi_Route);
app.use(cart_Route);
app.use(auth_Route);

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(
            `server running on http://localhost:${process.env.PORT}`,
        );
    }
});
