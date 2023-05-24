import { useEffect, useRef, useState } from "preact/hooks";
import Fuse from "fuse.js";

export default function Search(props: any) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const options = {
    keys: ["slug", "body", "data.title"],
    includeMatches: true,
    minMatchCharLength: 0,
    threshold: 0,
    ignoreLocation: true,
  };
  const fuse = new Fuse(props.searchList, options);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setQuery(event.target.value);
  };

  useEffect(() => {
    const posts = fuse
      .search(query)
      .map((result) => result.item)
      .slice(0, 5);
    setPosts(posts);
  }, [query]);

  const openPopup = () => {
    document.body.style.overflow = "hidden";
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    document.body.style.overflow = "auto";
    setIsPopupOpen(false);
  };

  // popup component
  function Popup({ isOpen, onClose, children }: any) {
    if (!isOpen) {
      return null;
    }

    return (
      <div
        className={`z-50 fixed top-44 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[32rem] bg-white shadow-popup text-gray-hover rounded-t-md`}
      >
        <div class="relative bg-white rounded-t shadow-lg p-5">{children}</div>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={openPopup}
        className="py-1 px-2 border cursor-pointer hover:border-gray-900 border-gray-400 flex flex-row justify-between gap-2 items-center rounded-full"
      >
        <div className="flex flex-row items-center">
          {props.children}
          <span className="mr-12 select-none">Search</span>
        </div>
        <span className="inset-x-3/4 p-1 select-none items-center justify-center text-xs font-mono tracking-wide leading-3 pointer-events-none border border-gray-400 rounded-sm mr-2">
          <kbd aria-hidden="true">/</kbd>
        </span>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <input
          type="text"
          placeholder="Type to search..."
          className="outline-none p-2 w-full border-b border-gray-300"
          value={query}
          onChange={handleChange}
        />
        <div
          className="absolute top-full left-0 bg-white w-full p-5 rounded-b-md" // This is your search results container
        >
          {query.length > 1 && (
            <p>
              Found {posts.length} {posts.length === 1 ? "result" : "results"}{" "}
              for '{query}'
            </p>
          )}
          <ul>
            {posts &&
              posts.map((post: any) => (
                <li>
                  <a href={`/${post.slug}`}>{post.data.title}</a>
                  {post.body.slice(0, 20)}
                </li>
              ))}
          </ul>
        </div>
      </Popup>
      {isPopupOpen && (
        <div
          className="z-40 fixed top-0 left-0 w-screen h-screen bg-black/20"
          onClick={closePopup}
        />
      )}
    </div>
  );
}
