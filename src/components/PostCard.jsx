import { Link } from "react-router-dom";
function timeSince(d) {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  const h = Math.floor(diff / 3600);
  if (h < 24) return `Posted ${h} hour${h !== 1 ? "s" : ""} ago`;
  const x = Math.floor(h / 24);
  return `Posted ${x} day${x !== 1 ? "s" : ""} ago`;
}
export default function PostCard({ post }) {
  return (
    <article className="card">
      <div className="muted">{timeSince(post.created_at)}</div>
      <Link to={`/post/${post.id}`} className="titlelink">
        <h3>{post.title}</h3>
      </Link>
      <div className="muted">
        {post.upvotes} upvotes {post.flag ? "• " + post.flag : ""}
      </div>
    </article>
  );
}
