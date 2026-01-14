import { useState } from "react";

export default function AddSubjectModal({ onClose, onAdd }) {
  const [name, setName] = useState("");

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Subject</h3>

        <input
          placeholder="Subject name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              if (!name.trim()) return;
              onAdd(name);
              onClose();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
