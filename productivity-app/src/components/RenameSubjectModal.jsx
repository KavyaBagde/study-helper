import { useState } from "react";

export default function RenameSubjectModal({ subject, onClose, onSave }) {
  const [name, setName] = useState(subject.name);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Rename Subject</h3>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              if (!name.trim()) return;
              onSave(name);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
