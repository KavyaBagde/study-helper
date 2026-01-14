import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import AddSubjectModal from "./components/AddSubjectModal";
import AddCardModal from "./components/AddCardModal";
import RenameSubjectModal from "./components/RenameSubjectModal";
import { loadSubjects, saveSubjects } from "./utils/storage";
import "./styles.css";

export default function App() {

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState(() => loadSubjects());
  const [selectedId, setSelectedId] = useState(() => {
    const s = loadSubjects();
    return s.length ? s[0].id : null;
  });

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [renamingSubject, setRenamingSubject] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme === "light" ? "light" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  const selectedSubject = subjects.find((s) => s.id === selectedId);

  const searchResults = searchQuery
    ? subjects.flatMap((subject) =>
        subject.cards
          .filter(
            (card) =>
              card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              card.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((card) => ({
            ...card,
            subjectId: subject.id,
            subjectName: subject.name,
          }))
      )
    : [];

  useEffect(() => {
    function handleKeyDown(e) {
      if (!searchQuery || searchResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }

      // if (e.key === "Enter") {
      //   e.preventDefault();
      //   const card = searchResults[activeIndex];
      //   if (card) {
      //     setSelectedId(card.subjectId);
      //     setEditingCard(card);
      //     setShowAddCard(true);
      //     setSearchQuery("");
      //   }
      // }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, searchResults, activeIndex]);

  function handleDeleteSubject(subjectId) {
    if (!confirm("Delete this subject and all its cards?")) return;

    setSubjects((prev) => {
      const updated = prev.filter((s) => s.id !== subjectId);
      if (subjectId === selectedId) {
        setSelectedId(updated.length ? updated[0].id : null);
      }
      return updated;
    });
  }

  function handleRenameSubject(newName) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === renamingSubject.id ? { ...s, name: newName } : s
      )
    );
  }

  function handleAddOrUpdateCard(card) {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === selectedId
          ? {
              ...sub,
              cards: sub.cards.some((c) => c.id === card.id)
                ? sub.cards.map((c) => (c.id === card.id ? card : c))
                : [...sub.cards, card],
            }
          : sub
      )
    );
  }

  function handleDeleteCard(cardId) {
    if (!confirm("Delete this card?")) return;

    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === selectedId
          ? { ...sub, cards: sub.cards.filter((c) => c.id !== cardId) }
          : sub
      )
    );
  }

  function handleTogglePin(cardId) {
    setSubjects((prev) =>
      prev.map((subject) => ({
        ...subject,
        cards: subject.cards.map((card) =>
          card.id === cardId ? { ...card, pinned: !card.pinned } : card
        ),
      }))
    );
  }

  return (
    <div className="app">
      <Sidebar
        subjects={subjects}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAdd={() => setShowAddSubject(true)}
        onRename={setRenamingSubject}
        onDelete={handleDeleteSubject}
        setTheme={setTheme}
        theme={theme}
      />

      <MainContent
        subject={selectedSubject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        activeIndex={activeIndex}
        onResultSelect={(card) => {
          setSelectedId(card.subjectId);
          setSearchQuery("");
          setEditingCard(card);
          setShowAddCard(true);
        }}
        onAddCard={() => {
          setEditingCard(null);
          setShowAddCard(true);
        }}
        onEditCard={(card) => {
          setEditingCard(card);
          setShowAddCard(true);
        }}
        onDeleteCard={handleDeleteCard}
        onTogglePin={handleTogglePin}
      />

      {showAddSubject && (
        <AddSubjectModal
          onClose={() => setShowAddSubject(false)}
          onAdd={(name) => {
            const sub = { id: Date.now().toString(), name, cards: [] };
            setSubjects((prev) => [...prev, sub]);
            setSelectedId(sub.id);
          }}
        />
      )}

      {showAddCard && (
        <AddCardModal
          editingCard={editingCard}
          onClose={() => setShowAddCard(false)}
          onAdd={handleAddOrUpdateCard}
        />
      )}

      {renamingSubject && (
        <RenameSubjectModal
          subject={renamingSubject}
          onClose={() => setRenamingSubject(null)}
          onSave={handleRenameSubject}
        />
      )}
    </div>
  );
}
