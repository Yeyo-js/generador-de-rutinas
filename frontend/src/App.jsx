import { useCallback, useState } from "react";
import { useEffect } from "react";
import MarkdownRenderer from "./components/atoms/MarkdownRenderer";
import RoutineModal from "./components/organisms/RoutineModal";
import { StatsCard } from "./components/molecules/StatsCard";
import { RoutineForm } from "./components/organisms/RoutineForm";
import { HistoryList } from "./components/organisms/HistoryList";
import { API_URL } from "./config/api"
import "./App.css";

function App() {
  const [rutinaGenerada, setRutinaGenerada] = useState("");
  const [historial, setHistorial] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalRutinas: 0,
    totalMinutos: 0,
  });

  const [loading, setLoading] = useState(false);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

  const obtenerHistorial = useCallback(async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/history`);
      const datos = await respuesta.json();

      setHistorial(datos);
    } catch (error) {
      console.error("Error la obtener historial", error);
    }
  }, []);

  const obtenerEstadisticas = useCallback(async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/stats`);
      const datos = await respuesta.json();
      setEstadisticas(datos);
    } catch (error) {
      console.error("Error stats", error);
    }
  }, []);

  useEffect(() => {
    obtenerHistorial();
    obtenerEstadisticas();
  }, [obtenerHistorial, obtenerEstadisticas]);

  const handleGenerateRoutine = async (formData) => {
    setLoading(true);
    setRutinaGenerada("Generando...");

    try {
      const respuesta = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const textoRespuesta = await respuesta.text();

      try {
        const data = JSON.parse(textoRespuesta);

        if (!respuesta.ok) {
          setRutinaGenerada(data.error || "Error desconocido del servidor.");
        } else {
          setRutinaGenerada(data.rutinaSugerida);
          obtenerHistorial();
          obtenerEstadisticas();
        }
      } catch (jsonError) {
        console.error(
          "El servidor no devolvió JSON:",
          jsonError,
          textoRespuesta
        );

        setRutinaGenerada(
          `Error crítico: El servidor devolvió algo inesperado. Revisa la consola. (Status: ${respuesta.status})`
        );
      }
    } catch (error) {
      console.error("Error", error);
      setRutinaGenerada("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarRutina = async (id) => {
    const nuevoHistorial = historial.filter((item) => item.id !== id);
    setHistorial(nuevoHistorial);
    setRutinaSeleccionada(null);

    await fetch(`http://localhost:3000/api/history/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <>
      <h1 className="titulo">Generador de Rutinas</h1>
      <div className="dashboard-grid">
        <StatsCard
          totalRutinas={estadisticas.totalRutinas}
          totalMinutos={estadisticas.totalMinutos}
        />

        <RoutineForm onSubmit={handleGenerateRoutine} loading={loading} />
      </div>

      <hr />

      {/* mostramos la respuesta del backend */}
      <div className="container-result">
        {rutinaGenerada && (
          <div className="result-panel">
            <div className="result-header">
              <span>RESULTADO DEL SISTEMA</span>
            </div>
            <MarkdownRenderer content={rutinaGenerada} />
          </div>
        )}

        <HistoryList historial={historial} onSelect={setRutinaSeleccionada} />
      </div>
      <RoutineModal
        routine={rutinaSeleccionada}
        onClose={() => setRutinaSeleccionada(null)}
        onDelete={eliminarRutina}
      />
    </>
  );
}

export default App;
