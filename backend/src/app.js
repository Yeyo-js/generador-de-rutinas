import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuración inicial
dotenv.config();
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// 1. CONFIGURACIÓN DE GEMINI (LA IA)
// ==========================================
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "❌ ERROR CRÍTICO: No se encontró GEMINI_API_KEY en el archivo .env"
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-09-2025",
});

const historial = [];

// ==========================================
// 2. RUTAS
// ==========================================

app.get("/", (req, res) => {
  res.send("🤖 Servidor de Rutinas con IA Inteligente: ACTIVO");
});

app.get("/api/history", (req, res) => {
  res.json(historial);
});

app.get("/api/stats", (req, res) => {
  const totalRutinas = historial.length;
  const totalMinutos = historial.reduce((total, item) => {
    return total + (parseInt(item.tiempo) || 0);
  }, 0);

  res.json({
    totalRutinas,
    totalMinutos,
  });
});

// ==========================================
// 3. EL ENDPOINT INTELIGENTE
// ==========================================
app.post("/api/recommend", async (req, res) => {
  try {
    const { materia, tiempo, dificultad, nivel } = req.body;

    // Validaciones
    if (!materia || materia.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Por favor escribe una materia válida." });
    }
    if (!tiempo || isNaN(tiempo) || parseInt(tiempo) <= 0) {
      return res
        .status(400)
        .json({ error: "El tiempo debe ser un número positivo." });
    }

    if (parseInt(tiempo) < 10) {
      return res.json({
        message: "Consejo rápido",
        rutinaSugerida:
          "🧘‍♂️ Tienes menos de 10 minutos. Honestamente, no es suficiente para una sesión de estudio profunda. Mejor usa este tiempo para estirar las piernas, beber agua y organizar tu escritorio para la próxima sesión. ¡Descansar también es productivo!",
      });
    }

    console.log(`🤖 Consultando a Gemini para: ${materia} (${tiempo} min)...`);

    const prompt = `
      Actúa como un Entrenador de Estudio Estricto.
      Genera una RUTINA DE EJECUCIÓN INMEDIATA para:
      
      - Materia: "${materia}"
      - Tiempo Total: "${tiempo} minutos"
      - Nivel: "${nivel}"
      - Dificultad: "${dificultad}"

      TU ÚNICO OBJETIVO: Decirle al estudiante qué hacer minuto a minuto.
      NO expliques qué es la técnica. APLÍCALA.

      SI ES NIVEL "${nivel}":
      ${
        nivel === "primaria"
          ? '- Usa emojis divertidos. Tareas simples como "Dibuja", "Lee en voz alta".'
          : ""
      }
      ${
        nivel === "secundaria"
          ? '- Tareas directas para aprobar: "Resume", "Haz esquema", "Memoriza", pero sin explicar conceptos, ni escoger un tema'
          : ""
      }
      ${
        nivel === "instituto"
          ? '- Enfoque profesional: "Simula un caso real", "Practica el procedimiento".'
          : ""
      }
      ${
        nivel === "universidad"
          ? '- Enfoque analítico: "Sintetiza", "Critica", "Conecta autores".'
          : ""
      }

      ESTRUCTURA VISUAL OBLIGATORIA (Markdown):
      
      ## 📅 Rutina: ${materia} (Modo ${dificultad})
      
      **🔥 Calentamiento (Primeros minutos)**
      - [ ] Acción concreta de preparación.
      
      **⚡ Núcleo de Estudio (El trabajo duro)**
      - [ ] [Min X-Y] **Acción 1:** Instrucción precisa.
      - [ ] [Min Y-Z] **Acción 2:** Instrucción precisa.
      
      **🏁 Cierre (Retención)**
      - [ ] Acción final para no olvidar.

      ⛔ RESTRICCIONES:
      - PROHIBIDO definir conceptos ("El método pomodoro consiste en..."). ¡ABURRIDO!
      - PROHIBIDO usar párrafos largos. Solo líneas de acción (Checklist).
      - Usa verbos imperativos: "Lee", "Escribe", "Dibuja", "Repite".
      - No pongas "En resumen" ni conclusiones.
      - empieza directamente con el titulo.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const nuevoRegistro = {
      id: Date.now(),
      materia,
      tiempo,
      dificultad,
      rutina: text,
      fecha: new Date().toLocaleTimeString(),
    };
    historial.push(nuevoRegistro);

    res.json({
      message: "Rutina generada con IA",
      rutinaSugerida: text,
    });
  } catch (error) {
    console.error("🔥 Error al llamar a Gemini:", error);

    let mensajeError = "Hubo un error técnico generando tu rutina.";

    if (error.message && error.message.includes("429")) {
      mensajeError =
        "⚠️ El sistema está saturado (Límite de cuota gratuito alcanzado). Intenta de nuevo en 1 minuto.";
    }

    res.status(503).json({
      error: mensajeError,
      rutinaSugerida: mensajeError,
    });
  }
});

app.post("/api/vote", (req, res) => {
  const { id, voto } = req.body;

  const rutinaEncontrada = historial.find((item) => item.id === id);

  if (rutinaEncontrada) {
    rutinaEncontrada.voto = voto;
    console.log(`Feedback recibido para la rutina ${id} -> ${voto}`);
    res.json({
      success: true,
      message: "voto registrado",
    });
  } else {
    res.status(404).json({
      error: "rutina no encontrada",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor IA corriendo en: http://localhost:${port}`);
});
