const FLAGS = ["", "Question", "Opinion", "Trade"];
export default function FlagFilter({ value, onChange }) {
  return (
    <div className="flagfilter">
      <span>Filter:</span>
      {FLAGS.map((f) => (
        <button
          key={f || "all"}
          className={value === f ? "pill active" : "pill"}
          onClick={() => onChange(f)}
        >
          {f || "All"}
        </button>
      ))}
    </div>
  );
}
