export default function SortBar({ orderBy, onChange }) {
  return (
    <div className="sortbar">
      <span>Order by:</span>
      <button
        className={orderBy === "created_at" ? "pill active" : "pill"}
        onClick={() => onChange("created_at")}
      >
        Newest
      </button>
      <button
        className={orderBy === "upvotes" ? "pill active" : "pill"}
        onClick={() => onChange("upvotes")}
      >
        Most Popular
      </button>
    </div>
  );
}
