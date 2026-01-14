import { useEffect, useRef } from "react";
import { hydrateImages } from "../utils/hydrateImages";

export default function QACard({
  card,
  subjectName,
  onEdit,
  onDelete,
  onTogglePin,
  isActive,
}) {
  const ref = useRef(null);

  useEffect(() => {
    hydrateImages(ref.current);
  }, [card.contentHTML, card.pinned]);

  return (
    <div
      className={`qa-card ${card.pinned ? "pinned" : ""}  ${
        isActive ? "active" : ""
      }`}
    >
      <div className="qa-card-header">
        <h2>{card.question}</h2>

        <div className="qa-actions">
          <button onClick={() => onTogglePin(card.id)}>
            {card.pinned ? "⭐" : "☆"}
          </button>
          <button onClick={() => onEdit(card)}>✏️</button>
          <button onClick={() => onDelete(card.id)}>🗑️</button>
        </div>
      </div>

      {subjectName && <div className="subject-badge">{subjectName}</div>}

      <div
        ref={ref}
        className="qa-content"
        dangerouslySetInnerHTML={{ __html: card.contentHTML }}
      />
    </div>
  );
}
