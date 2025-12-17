const COLS = "ABCDEFGHIJ";

function expandRange(range) {
  const [s, e] = range.split(":").map((x) => x.trim());
  const sc = s[0],
    sr = +s.slice(1);
  const ec = e[0],
    er = +e.slice(1);

  const res = [];
  for (let c = COLS.indexOf(sc); c <= COLS.indexOf(ec); c++) {
    for (let r = sr; r <= er; r++) {
      res.push(`${COLS[c]}${r}`);
    }
  }
  return res;
}

export function evaluateFormula(raw, cells, rootId, visiting = new Set()) {

  if (!raw.startsWith("=")) {
    if (raw === "") return 0;
    const num = Number(raw);
    if (Number.isNaN(num)) return raw; 
    return num;
  }

  let expr = raw.slice(1);

  const evalCell = (id) => {
    if (visiting.has(id)) {
      throw new Error(id === rootId ? "CIRCULAR" : "REF");
    }

    visiting.add(id);
    const val = evaluateFormula(cells[id] || "", cells, rootId, visiting);
    visiting.delete(id);

    const num = Number(val);
    if (Number.isNaN(num)) throw new Error("VALUE");
    return num;
  };


  expr = expr.replace(
    /([A-J](10|[1-9]))\s*:\s*([A-J](10|[1-9]))/g,
    (_, s, __, e) => expandRange(`${s}:${e}`).map(evalCell).join(",")
  );

  expr = expr.replace(/\b([A-J](?:10|[1-9]))\b/g, (_, id) => evalCell(id));

  const SUM = (...a) => a.reduce((x, y) => x + y, 0);
  const AVG = (...a) => (a.length ? SUM(...a) / a.length : 0);
  const MAX = (...a) => (a.length ? Math.max(...a) : 0);
  const MIN = (...a) => (a.length ? Math.min(...a) : 0);

  const result = Function(
    "SUM",
    "AVG",
    "MAX",
    "MIN",
    `return ${expr}`
  )(SUM, AVG, MAX, MIN);

  if (!Number.isFinite(result)) throw new Error("MATH");
  return result;
}
