export default function Cell({
  editing,
  display,
  draft,
  onEdit,
  onChange,
}) {
  return (
    <td
      className="cell"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit();
      }}
    >
      {editing ? (
        <input
          autoFocus
          value={draft}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        display
      )}
    </td>
  );
}
