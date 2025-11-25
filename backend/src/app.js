import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();
const port = 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rutas ---
app.use("/api", apiRoutes);

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("🤖 Servidor de Rutinas: ONLINE");
});

// --- Iniciar Servidor ---
app.listen(port, () => {
  console.log(`🚀 Servidor modular corriendo en: http://localhost:${port}`);
});
