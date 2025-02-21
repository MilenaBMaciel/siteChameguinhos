import express from "express";
import cors from "cors";
import router from "./routes"; // Verifique se o caminho está correto

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
