import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";

export default function AddCardModal({ onClose, onAdd, editingCard }) {
  const [question, setQuestion] = useState("");
  const [contentHTML, setContentHTML] = useState(
    editingCard?.contentHTML || ""
  );

  useEffect(() => {
    if (editingCard) {
      setQuestion(editingCard.question);
    }
  }, [editingCard]);


  function handleSubmit() {
    if (!question) return;

    onAdd({
      id: editingCard?.id || Date.now().toString(),
      question,
      contentHTML,
      pinned: editingCard?.pinned || false,
      createdAt: editingCard?.createdAt || Date.now(),
    });

    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{editingCard ? "Edit Card" : "Add Card"}</h3>

        <input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <RichTextEditor value={contentHTML} onChange={setContentHTML} />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>
            {editingCard ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
