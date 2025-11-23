import { useCallback, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart2,
  Clock,
  Cpu,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [materia, setMateria] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [rutinaGenerada, setRutinaGenerada] = useState("");
  const [historial, setHistorial] = useState([]);
  const [dificultad, setDificultad] = useState("media");
  const [estadisticas, setEstadisticas] = useState({
    totalRutinas: 0,
    totalMinutos: 0,
  });

  const [loading, setLoading] = useState(false);

  const obtenerHistorial = useCallback(async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/history");
      const datos = await respuesta.json();

      setHistorial(datos);
    } catch (error) {
      console.error("Error la obtener historial", error);
    }
  }, []);

  const obtenerEstadisticas = useCallback(async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/stats");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setRutinaGenerada("Generando...");

    try {
      const respuesta = await fetch("http://localhost:3000/api/recommend", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          materia: materia,
          tiempo: tiempo,
          dificultad: dificultad,
        }),
      });

      const data = await respuesta.json();

      setRutinaGenerada(data.rutinaSugerida);

      obtenerHistorial();
      obtenerEstadisticas();
    } catch (error) {
      console.error("error la conectar con el backend", error);
      setRutinaGenerada("Error al generar la rutina");
    }
  };

  // PARA EFECTO 3D EN LA TARJETA DE ESTADISTICAS
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const { innerWidth, innerHeight } = window;

    const xAxis = (innerWidth / 2 - e.pageX) / 25;
    const yAxis = (innerHeight / 2 - e.pageY) / 25;

    cardRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease";
      cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  };

  return (
    <>
      <h1 className="titulo">Generador de Rutinas</h1>
      <div className="dashboard-grid">
        <div
          className="tarjeta-estadisticas"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="card" ref={cardRef}>
            <div className="scan-line"></div>
            <div className="circle-bg"></div>

            <div className="content">
              <div className="icon-box">
                <Activity size={40} />
              </div>

              <h3 className="text-stats">Sesiones</h3>
              <div className="stat-number">
                <p className="points-">{estadisticas.totalRutinas}</p>
              </div>

              <div className="divider"></div>

              <h3 className="text-stats">Minutos Totales</h3>
              <div className="stat-number">
                <p>{estadisticas.totalMinutos}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-header">
            <h3 className="form-title">GENERADOR DE SESIONES</h3>
          </div>

          <form className="formulario" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>
                <Terminal size={16} color="#39ff14" />
                CURSO
              </label>
              <input
                type="text"
                className="input"
                placeholder="Ej: pogramacion, matematica..."
                value={materia}
                onChange={(e) => {
                  setMateria(e.target.value);
                }}
              />
            </div>

            <div className="input-group">
              <label>
                <Clock size={16} color="#39ff14" />
                TIEMPO DISPONIBLE (MIN)
              </label>
              <input
                type="number"
                className="input"
                min="5"
                placeholder="Ej: 60"
                value={tiempo}
                onChange={(e) => {
                  setTiempo(e.target.value);
                }}
              />
            </div>

            <div className="input-group">
              <label>
                <BarChart2 size={16} color="#39ff14" />
                NIVEL DE DIFICULTAD
              </label>
              <div className="select-wrapper">
                <select
                  className="input"
                  value={dificultad}
                  onChange={(e) => {
                    setDificultad(e.target.value);
                  }}
                >
                  <option value="facil">Fácil (Repaso)</option>
                  <option value="medio">Medio (Estándar)</option>
                  <option value="dificil">Difícil (Complejo)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={`btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Generando..." : "Generar Rutina"}
              {!loading && <Zap size={18} fill="currentColor" />}
            </button>
          </form>
        </div>
      </div>

      <hr />

      {/* mostramos la respuesta del backend */}
      <div className="container-result">
        {rutinaGenerada && (
          <div className="result-panel">
            <div className="result-header">
              <span>RESULTADO DEL SISTEMA</span>
            </div>
            <p className="typewriter-text">{rutinaGenerada}</p>
          </div>
        )}

        {/* mostramos el historial */}
        <div className="seccion-historial">
          <div className="history-title-container">
            <h2 className="history-title">
              <Cpu size={24} /> LOG DE ACTIVIDAD
            </h2>
            <div className="history-deco-line"></div>
          </div>

          <div className="history-grid custom-scrollbar">
            {historial.length === 0 ? (
              <div className="empty-state">
                <AlertCircle
                  size={40}
                  style={{ marginBottom: 10, opacity: 0.5 }}
                />
                <p>SISTEMA EN ESPERA... NO HAY DATOS.</p>
              </div>
            ) : (
              historial.map((item, index) => {
                <div
                  key={item.id}
                  className="history-card-modern"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-corner top-left"></div>
                  <div className="card-corner bottom-right"></div>

                  <div className="h-card-header">
                    <span className="h-id">
                      LOG_0{historial.length - index}
                    </span>
                    <span className={`h-badge ${item.dificultad}`}>
                      {item.dificultad.toUpperCase()}
                    </span>
                  </div>

                  <div className="h-card-body">
                    <h4 className="h-materia">{item.materia}</h4>
                    <div className="h-meta">
                      <span>
                        <Clock size={12} /> {item.tiempo} MIN
                      </span>

                      <span>
                        <Terminal size={12} /> REACT
                      </span>
                    </div>
                    <p className="h-rutina">{item.rutinaGenerada}</p>
                  </div>

                  <div className="h-card-footer">
                    <button className="h-action-btn">
                      VER DETALLES <ChevronRight size={14} />
                    </button>
                  </div>
                </div>;
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
