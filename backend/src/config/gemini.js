import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Iniciamos las variables de entorno
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR CRÍTICO: No se encontró GEMINI_API_KEY en .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usamos el modelo que te funcionó (puedes cambiarlo si Google lanza uno nuevo)
export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-09-2025",
});
