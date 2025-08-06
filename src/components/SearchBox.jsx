export default function SearchBox({ value, onChange, placeholder = "Search" }) {
  return (
    <input
      className="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
