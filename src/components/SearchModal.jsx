import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/client";

export default function SearchModal({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return undefined;
    }

    let activeRequest = true;
    const timer = setTimeout(() => {
      apiGet(`/search?q=${encodeURIComponent(q)}`)
        .then((matches) => {
          if (activeRequest) setResults(matches);
        })
        .catch((requestError) => {
          if (activeRequest) {
            setResults([]);
            setError(requestError.message);
          }
        })
        .finally(() => {
          if (activeRequest) setSearching(false);
        });
    }, 150);
    return () => {
      activeRequest = false;
      clearTimeout(timer);
    };
  }, [query]);

  const open = (r) => {
    onClose();
    navigate(`/courses/${r.courseId}`);
  };

  const handleKey = (e) => {
    if (e.nativeEvent.isComposing) return; // กำลังพิมพ์ภาษาไทยอยู่ ยังไม่ต้องทำอะไร
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[active]) open(results[active]);
  };

  return (
    <div className="overlay search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search courses, notes and files..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setResults([]);
            setSearching(Boolean(e.target.value.trim()));
            setError("");
          }}
          onKeyDown={handleKey}
        />

        {query.trim() && results.length === 0 && (
          <p className={error ? "error small search-empty" : "muted small search-empty"}>
            {error || (searching ? "Searching..." : `No results for "${query.trim()}".`)}
          </p>
        )}

        {results.length > 0 && (
          <ul className="results">
            {results.map((r, i) => (
              <li key={r.key}>
                <button
                  className={`result ${i === active ? "active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => open(r)}
                >
                  <span className="tag">{r.type}</span>
                  <span className="result-title">{r.title}</span>
                  {r.detail && <span className="muted small">{r.detail}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}