import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPost, upvotePost, deletePost } from "../services/posts";
import { addComment } from "../services/comments";
import { getCardById, getMarketPrice } from "../lib/pokemontcg";
export default function Post() {
  const { id } = useParams(),
    navigate = useNavigate();
  const [post, setPost] = useState(null),
    [comments, setComments] = useState([]),
    [text, setText] = useState(""),
    [card, setCard] = useState(null);
  const user_id = localStorage.getItem("pch_user_id");
  useEffect(() => {
    (async () => {
      const { post: p, comments: c } = await getPost(id);
      if (!p.error) {
        setPost(p.data);
        setComments(c.data || []);
        if (p.data?.card_id) {
          try {
            const res = await getCardById(p.data.card_id);
            setCard(res.data);
          } catch {}
        }
      }
    })();
  }, [id]);
  if (!post) return null;
  const isOwner = post.user_id && post.user_id === user_id;
  async function vote() {
    await upvotePost(post.id);
    setPost({ ...post, upvotes: (post.upvotes ?? 0) + 1 });
  }
  async function del() {
    if (!confirm("Delete this post?")) return;
    await deletePost(post.id);
    navigate("/");
  }
  async function add(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const { data, error } = await addComment({
      post_id: post.id,
      body: text,
      user_id,
    });
    if (!error) {
      setComments([...comments, data]);
      setText("");
    }
  }
  return (
    <article className="card postpage">
      <div className="muted">
        Posted {new Date(post.created_at).toLocaleString()}
      </div>
      <h2>{post.title}</h2>
      {post.flag ? <div className="badge">{post.flag}</div> : null}
      {post.content && <p className="content">{post.content}</p>}
      {post.image_url && (
        <img className="postimg" src={post.image_url} alt="" />
      )}
      {card ? (
        <div className="card-details">
          <img src={card.images?.small} alt={card.name} />
          <div>
            <div>
              <strong>{card.name}</strong> — {card.set?.name} (
              {card.rarity || "—"})
            </div>
            <div className="muted">
              Types: {(card.types || []).join(", ") || "—"}
            </div>
            <div className="muted">
              💰 Market: {getMarketPrice(card) ?? "—"}
            </div>
          </div>
        </div>
      ) : null}
      <div className="row">
        <button onClick={vote} className="iconbtn">
          👍
        </button>
        <span className="muted">{post.upvotes ?? 0} upvotes</span>
        <span style={{ flex: 1 }} />
        {isOwner && (
          <>
            <Link className="iconbtn" to={`/post/${post.id}/edit`}>
              ✏️
            </Link>
            <button className="iconbtn" onClick={del}>
              🗑️
            </button>
          </>
        )}
      </div>
      <h3>Comments</h3>
      <ul className="comments">
        {comments.map((c) => (
          <li key={c.id}>- {c.body}</li>
        ))}
      </ul>
      <form className="commentform" onSubmit={add}>
        <input
          placeholder="Leave a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </article>
  );
}
