export default function SubjectCard({
  subject,
  isActive,
  onSelect,
  onRename,
  onDelete
}) {
  return (
    <div
      className={`subject-card ${isActive ? "active" : ""}`}
      onClick={() => onSelect(subject.id)}
    >
      <span>{subject.name}</span>

      <div className="subject-actions" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onRename(subject)}>✏️</button>
        <button onClick={() => onDelete(subject.id)}>🗑️</button>
      </div>
    </div>
  );
}
