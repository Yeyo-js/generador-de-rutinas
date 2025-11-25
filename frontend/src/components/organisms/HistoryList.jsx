import { Cpu, AlertCircle, Clock, Terminal, ChevronRight } from "lucide-react";
import "./HistoryList.css";

const HistoryList = ({ historial, onSelect }) => {
  return (
    <div className="history-section">
      <div className="history-title-container">
        <h2 className="history-title">
          <Cpu size={24} /> LOG DE ACTIVIDAD
        </h2>
        <div className="history-deco-line"></div>
      </div>

      <div className="history-grid custom-scrollbar">
        {historial.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={40} style={{ marginBottom: 10, opacity: 0.5 }} />
            <p>SISTEMA EN ESPERA... NO HAY DATOS.</p>
          </div>
        ) : (
          historial.map((item, index) => (
            <div
              key={item.id}
              className="history-card-modern"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-corner top-left"></div>
              <div className="card-corner bottom-right"></div>

              <div className="h-card-header">
                <span className="h-id">LOG_0{historial.length - index}</span>
                <span className={`h-badge ${item.dificultad}`}>
                  {item.dificultad ? item.dificultad.toUpperCase() : "N/A"}
                </span>
              </div>

              <div className="h-card-body">
                <h4 className="h-materia">{item.materia}</h4>
                <div className="h-meta">
                  <span>
                    <Clock size={12} /> {item.tiempo} MIN
                  </span>
                  <span>
                    <Terminal size={12} />{" "}
                    {item.nivel ? item.nivel.toUpperCase() : "GENERAL"}
                  </span>
                </div>
                <p className="h-rutina">{item.rutina}</p>
              </div>

              <div className="h-card-footer">
                <button className="h-action-btn" onClick={() => onSelect(item)}>
                  VER DETALLES <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { HistoryList };
