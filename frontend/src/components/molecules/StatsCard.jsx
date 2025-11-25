import { useRef } from "react";
import { Activity } from "lucide-react";
import "./StatsCard.css";

const StatsCard = ({ totalRutinas, totalMinutos }) => {
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
            <p className="points-">{totalRutinas}</p>
          </div>

          <div className="divider"></div>

          <h3 className="text-stats">Minutos Totales</h3>
          <div className="stat-number">
            <p>{totalMinutos}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StatsCard };
