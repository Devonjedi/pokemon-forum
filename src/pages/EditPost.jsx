import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost } from "../services/posts";
import CardPicker from "../components/CardPicker";
const FLAGS = ["", "Question", "Opinion", "Trade"];
export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState(""),
    [content, setContent] = useState(""),
    [image_url, setImageUrl] = useState(""),
    [flag, setFlag] = useState(""),
    [card, setCard] = useState(null),
    [show, setShow] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { post } = await getPost(id);
      if (post.data) {
        const p = post.data;
        setTitle(p.title || "");
        setContent(p.content || "");
        setImageUrl(p.image_url || "");
        setFlag(p.flag || "");
        setCard(
          p.card_id
            ? {
                id: p.card_id,
                name: p.card_name,
                set: { name: p.set_name },
                rarity: p.rarity,
                types: (p.types || "").split(", "),
              }
            : null
        );
      }
    })();
  }, [id]);
  async function onSubmit(e) {
    e.preventDefault();
    const patch = {
      title,
      content,
      image_url,
      flag,
      card_id: card?.id || null,
      card_name: card?.name || null,
      set_name: card?.set?.name || null,
      rarity: card?.rarity || null,
      types: (card?.types || []).join(", ") || null,
    };
    const { error } = await updatePost(id, patch);
    if (error) return alert(error.message);
    navigate(`/post/${id}`);
  }
  return (
    <form className="card form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content (optional)"
        rows={12}
      />
      <input
        value={image_url}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
      />
      <div className="grid2">
        <select value={flag} onChange={(e) => setFlag(e.target.value)}>
          {FLAGS.map((f) => (
            <option key={f} value={f}>
              {f || "No Flag"}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setShow(true)}>
          🔎 Pick a Card
        </button>
      </div>
      {card ? (
        <div className="badges">
          <span className="badge">
            <strong>Card:</strong> {card.name}
          </span>
          <span className="badge">
            <strong>Set:</strong> {card.set?.name}
          </span>
          <span className="badge">
            <strong>Rarity:</strong> {card.rarity || "—"}
          </span>
        </div>
      ) : null}
      <button type="submit" className="primary">
        Update Post
      </button>
      {show ? (
        <CardPicker
          onPick={(c) => {
            setCard(c);
            setShow(false);
          }}
          onClose={() => setShow(false)}
        />
      ) : null}
    </form>
  );
}
