import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { listPosts } from "../services/posts";
import PostCard from "../components/PostCard";
import SortBar from "../components/SortBar";
import SearchBox from "../components/SearchBox";
import FlagFilter from "../components/FlagFilter";
export default function Home() {
  const [params, setParams] = useSearchParams();
  const qParam = params.get("q") || "";
  const [q, setQ] = useState(qParam),
    [orderBy, setOrderBy] = useState("created_at"),
    [flag, setFlag] = useState(""),
    [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await listPosts({ q, orderBy, flag });
      setPosts(data || []);
    })();
  }, [q, orderBy, flag]);
  useEffect(() => {
    setParams((p) => {
      p.set("q", q);
      return p;
    });
  }, [q]);
  return (
    <>
      <div className="row">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Search posts by title"
        />
        <Link
          to="/new"
          className="primary"
          style={{
            textDecoration: "none",
            display: "inline-block",
            padding: "10px 12px",
          }}
        >
          New Post
        </Link>
      </div>
      <SortBar orderBy={orderBy} onChange={setOrderBy} />
      <FlagFilter value={flag} onChange={setFlag} />
      <div className="feed">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}
