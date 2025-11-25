import { useState } from "react";
import { Terminal, Clock, BarChart2, GraduationCap, Zap } from "lucide-react";
import "./RoutineForm.css";

const RoutineForm = ({ onSubmit, loading }) => {
  const [materia, setMateria] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [nivel, setNivel] = useState("instituto");
  const [dificultad, setDificultad] = useState("medio");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      materia,
      tiempo,
      nivel,
      dificultad,
    });
  };

  return (
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

        {/* NIVEL ACADÉMICO */}
        <div className="input-group">
          <label>
            <GraduationCap size={16} color="#39ff14" />
            NIVEL ACADÉMICO
          </label>
          <div className="select-wrapper">
            <select
              className="input"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            >
              <option value="primaria">Primaria (Básico/Niños)</option>
              <option value="secundaria">Secundaria (Adolescentes)</option>
              <option value="instituto">Instituto / Técnico</option>
              <option value="universidad">Universidad / Posgrado</option>
            </select>
          </div>
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
  );
};

export { RoutineForm };
