import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
dotenv.config();


const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use("/", router);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
