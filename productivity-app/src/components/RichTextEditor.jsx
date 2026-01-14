import { useRef, useEffect, useState } from "react";
import { saveImage } from "../utils/imageDB";
import { hydrateImages } from "../utils/hydrateImages";

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    bullet: false,
  });

  function updateFormats() {
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      bullet: document.queryCommandState("insertUnorderedList"),
    });
  }

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.addEventListener("keyup", updateFormats);
    editor.addEventListener("mouseup", updateFormats);

    return () => {
      editor.removeEventListener("keyup", updateFormats);
      editor.removeEventListener("mouseup", updateFormats);
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  function emitChange() {
    onChange(editorRef.current.innerHTML);
  }

  function format(cmd) {
    document.execCommand(cmd);
    emitChange();
  }

  async function insertImage(file) {
    if (!file) return;

    const blob = file.slice(0, file.size, file.type);
    const imageId = await saveImage(blob);
    const url = URL.createObjectURL(blob);

    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Create image node
    const img = document.createElement("img");
    img.src = url;
    img.dataset.imgId = imageId;
    img.style.width = "300px";

    // Insert image at cursor
    range.deleteContents();
    range.insertNode(img);

    // Move cursor AFTER image
    range.setStartAfter(img);
    range.setEndAfter(img);
    selection.removeAllRanges();
    selection.addRange(range);

    emitChange();
  }

  function selectImage(img) {
    document
      .querySelectorAll(".rte-editor img.selected")
      .forEach((i) => i.classList.remove("selected"));

    img.classList.add("selected");
    addResizeHandles(img);
  }

  function addResizeHandles(img) {
    removeHandles();

    const handle = document.createElement("div");
    handle.className = "resize-handle";

    img.parentElement.style.position = "relative";
    img.parentElement.appendChild(handle);

    handle.onmousedown = (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = img.offsetWidth;

      function onMove(ev) {
        const newWidth = startWidth + (ev.clientX - startX);
        img.style.width = `${Math.max(80, newWidth)}px`;
      }

      function onUp() {
        emitChange();
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
  }

  function removeHandles() {
    document.querySelectorAll(".resize-handle").forEach((h) => h.remove());
  }

  useEffect(() => {
    function handleClick(e) {
      if (e.target.tagName === "IMG") {
        selectImage(e.target);
      }
    }

    editorRef.current?.addEventListener("click", handleClick);
    return () => editorRef.current?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    hydrateImages(editorRef.current);
  }, [value]);

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button
          className={formats.bold ? "active" : ""}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => format("bold")}
        >
          B
        </button>

        <button
          className={formats.italic ? "active" : ""}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => format("italic")}
        >
          I
        </button>

        <button
          className={formats.bullet ? "active" : ""}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => format("insertUnorderedList")}
        >
          •
        </button>

        <label className="img-btn">
          🖼
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => insertImage(e.target.files[0])}
          />
        </label>
      </div>

      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        onInput={emitChange}
        placeholder="Write answer..."
        suppressContentEditableWarning
      />
    </div>
  );
}
