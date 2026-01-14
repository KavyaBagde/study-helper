import SubjectCard from "./SubjectCard";

export default function Sidebar({
  subjects,
  selectedId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  setTheme,
  theme,
}) {
  return (
    <div className="sidebar">
      <h2>Subjects</h2>

      <div className="subject-list">
        {subjects.map((sub) => (
          <SubjectCard
            key={sub.id}
            subject={sub}
            isActive={sub.id === selectedId}
            onSelect={onSelect}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </div>

      <button className="add-btn" onClick={onAdd}>
        + Add Subject
      </button>

      <button
        id="theme-btn"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

    </div>
  );
}
