import { X, Copy, Trash2, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";
import MarkdownRenderer from "../atoms/MarkdownRenderer";
import "./RoutineModal.css";

const RoutineModal = ({ routine, onClose, onDelete }) => {
  const [copiado, setCopiado] = useState(false);
  const [votoLocal, setVotoLocal] = useState(routine?.voto || null);

  if (!routine) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(routine.rutina);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleVote = async (tipoVoto) => {
    setVotoLocal(tipoVoto);

    try {
      await fetch("http://localhost:3000/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: routine.id,
          voto: tipoVoto,
        }),
      });
    } catch (error) {
      console.error("Error envaindo Voto:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{routine.materia}</h2>
            <span className="modal-date">
              {routine.nivel?.toUpperCase()} • {routine.tiempo} MIN •{" "}
              {routine.dificultad?.toUpperCase()}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <MarkdownRenderer content={routine.rutina} />
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          {/* SECCIÓN DE FEEDBACK */}
          <div className="feedback-actions">
            <span className="feedback-label">¿Sirvió?</span>

            <button
              className={`icon-btn ${votoLocal === "up" ? "active-up" : ""}`}
              onClick={() => handleVote("up")}
              title="Buena Rutina"
            >
              <ThumbsUp size={20} />
            </button>

            <button
              className={`icon-btn ${
                votoLocal === "down" ? "active-down" : ""
              }`}
              onClick={() => handleVote("down")}
              title="Mala Rutina"
            >
              <ThumbsDown size={20} />
            </button>
          </div>

          <div className="utility-actions">
            <button
              className="icon-btn delete"
              onClick={() => onDelete(routine.id)}
              title="Borrar"
            >
              <Trash2 size={20} />
            </button>

            <button
              className={`copy-btn ${copiado ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copiado ? <Check size={18} /> : <Copy size={18} />}
              {copiado ? "COPIADO" : "COPIAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineModal;
