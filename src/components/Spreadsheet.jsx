import { useState } from "react";
import { Undo2, Redo2, Trash2 } from "lucide-react";
import Cell from "./Cell";
import { evaluateFormula } from "../utils/formula";

const MAX_ROWS = 100;
const MAX_COLS = 100;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const colLabel = (n) => {
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
};

export default function Spreadsheet() {
  const [cells, setCells] = useState({});
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(10);
  const [rowInput, setRowInput] = useState(10);
  const [colInput, setColInput] = useState(10);

  const [editingCell, setEditingCell] = useState(null);
  const [draft, setDraft] = useState("");

  const computeDisplay = () => {
    const display = {};
    for (const id of Object.keys(cells)) {
      try {
        display[id] = evaluateFormula(cells[id], cells, id);
      } catch (e) {
        display[id] = e.message === "CIRCULAR" ? "#CIRCULAR" : "#ERROR";
      }
    }
    return display;
  };

  const displayValues = computeDisplay();

  const commitDraft = () => {
    if (!editingCell) return;

    const prev = cells[editingCell] || "";
    if (draft === prev) return;

    setHistory((h) => [...h, { ...cells }]);
    setFuture([]);

    setCells((prevCells) => {
      const next = { ...prevCells };
      if (draft === "") delete next[editingCell];
      else next[editingCell] = draft;
      return next;
    });
  };

  const startEdit = (id) => {
    if (editingCell && editingCell !== id) {
      commitDraft();
    }
    setEditingCell(id);
    setDraft(cells[id] || "");
  };

  const stopEdit = () => {
    commitDraft();
    setEditingCell(null);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [cells, ...f]);
    setCells(prev);
    setEditingCell(null);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, cells]);
    setCells(next);
    setEditingCell(null);
  };

  const clearAll = () => {
    if (Object.keys(cells).length === 0) return;
    setHistory((h) => [...h, { ...cells }]);
    setFuture([]);
    setCells({});
    setEditingCell(null);
  };

  const handleResize = () => {
    const r = clamp(Number(rowInput) || 1, 1, MAX_ROWS);
    const c = clamp(Number(colInput) || 1, 1, MAX_COLS);
    setRowInput(r);
    setColInput(c);
    setRowCount(r);
    setColCount(c);
  };

  return (
    <div className="sheet-container">
      <h1>Spreadsheet Engine</h1>

      <div className="resize-bar">
        <label>
          Rows:
          <input
            value={rowInput}
            onChange={(e) => setRowInput(e.target.value)}
            onBlur={() => setRowInput(clamp(Number(rowInput) || 1, 1, MAX_ROWS))}
          />
        </label>
        <label>
          Columns:
          <input
            value={colInput}
            onChange={(e) => setColInput(e.target.value)}
            onBlur={() => setColInput(clamp(Number(colInput) || 1, 1, MAX_COLS))}
          />
        </label>
        <button className="primary" onClick={handleResize}>
          Resize Grid
        </button>
      </div>

      <div className="toolbar">
        <button onClick={undo} disabled={!history.length}>
          <Undo2 size={16} /> Undo
        </button>
        <button onClick={redo} disabled={!future.length}>
          <Redo2 size={16} /> Redo
        </button>
        <button className="danger" onClick={clearAll}>
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="grid-wrapper" onMouseDown={stopEdit}>
        <table className="grid">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: colCount }).map((_, c) => (
                <th key={c}>{colLabel(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, r) => (
              <tr key={r}>
                <th>{r + 1}</th>
                {Array.from({ length: colCount }).map((_, c) => {
                  const id = `${colLabel(c)}${r + 1}`;
                  return (
                    <Cell
                      key={id}
                      editing={editingCell === id}
                      display={displayValues[id] ?? ""}
                      draft={draft}
                      onEdit={() => startEdit(id)}
                      onChange={setDraft}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
