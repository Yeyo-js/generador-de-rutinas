import { model } from "../config/gemini.js";

// --- MEMORIA TEMPORAL
const historial = [];

// --- CONTROLADORES ---

export const getHistory = (req, res) => {
  res.json(historial);
};

export const getStats = (req, res) => {
  const totalRutinas = historial.length;
  const totalMinutos = historial.reduce((total, item) => {
    return total + (parseInt(item.tiempo) || 0);
  }, 0);

  res.json({ totalRutinas, totalMinutos });
};

export const voteRoutine = (req, res) => {
  const { id, voto } = req.body;
  const rutinaEncontrada = historial.find((item) => item.id === id);

  if (rutinaEncontrada) {
    rutinaEncontrada.voto = voto;
    console.log(`📢 Voto registrado: ${id} -> ${voto}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Rutina no encontrada" });
  }
};

export const generateRoutine = async (req, res) => {
  try {
    const { materia, tiempo, dificultad, nivel } = req.body;

    // 1. Validaciones
    if (!materia || materia.trim().length < 2) {
      return res.status(400).json({ error: "Escribe una materia válida." });
    }
    if (!tiempo || parseInt(tiempo) <= 0) {
      return res.status(400).json({ error: "Tiempo inválido." });
    }

    // Filtro rápido para tiempos cortos
    if (parseInt(tiempo) < 5) {
      return res.json({
        rutinaSugerida:
          "🧘‍♂️ Menos de 5 minutos no es suficiente para estudiar. ¡Relájate y respira!",
      });
    }

    console.log(`🤖 Generando rutina para: ${materia} (${nivel})`);

    // 2. El Prompt
    const prompt = `
      Actúa como un Entrenador de Estudio Estricto.
      Genera una RUTINA DE EJECUCIÓN INMEDIATA para:
      - Materia: "${materia}"
      - Tiempo: "${tiempo} minutos"
      - Nivel: "${nivel}"
      - Dificultad: "${dificultad}"

      TU ÚNICO OBJETIVO: Decirle al estudiante qué hacer minuto a minuto.
      
      SI ES NIVEL "${nivel}":
      ${nivel === "primaria" ? "- Tareas simples y divertidas." : ""}
      ${nivel === "secundaria" ? "- Esquemas y resumenes directos." : ""}
      ${nivel === "instituto" ? "- Casos prácticos y simulaciones reales." : ""}
      ${nivel === "universidad" ? "- Análisis crítico y síntesis técnica." : ""}

      ESTRUCTURA VISUAL OBLIGATORIA (Markdown):
      ## 📅 Rutina: ${materia}
      
      **🔥 Calentamiento**
      - [ ] Acción de preparación.
      
      **⚡ Núcleo de Estudio**
      - [ ] [Min X-Y] **Acción 1:** Instrucción precisa.
      - [ ] [Min Y-Z] **Acción 2:** Instrucción precisa.
      
      **🏁 Cierre**
      - [ ] Acción de retención.

      ⛔ RESTRICCIONES: Sin saludos, sin teoría, solo acción imperativa.
    `;

    // 3. Llamada a la IA
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Guardar en historial
    const nuevoRegistro = {
      id: Date.now(),
      materia,
      tiempo,
      nivel,
      dificultad,
      rutina: text,
      fecha: new Date().toLocaleTimeString(),
    };
    historial.push(nuevoRegistro);

    res.json({ rutinaSugerida: text });
  } catch (error) {
    console.error("🔥 Error Backend:", error);
    let mensaje = "Error técnico al generar rutina.";
    if (error.message?.includes("429"))
      mensaje = "⚠️ Sistema saturado (Límite gratuito). Intenta en 1 min.";

    res.status(503).json({ error: mensaje });
  }
};
