import { useEffect, useState } from "preact/hooks";
import Fuse from "fuse.js";
import SearchPopup from "./SearchPopup";

export default function Search(props: any) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const options = {
    keys: ["header", "paragraph", "title", "body"],
    includeScore: true,
    distance: 100000,
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.1,
    // ignoreLocation: true,
  };
  const fuse = new Fuse(props.searchList, options);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("searchList", props.searchList);
  }, []);

  const handleChange = (event: any) => {
    // console.log(event.target.value);
    setQuery(event.target.value);
  };

  useEffect(() => {
    const posts: any = fuse
      .search(query)
      // .map((result) => result.item)
      .slice(0, 30);
    setPosts(posts);
    console.log("posts", posts);
  }, [query]);

  const openPopup = () => {
    document.body.style.overflow = "hidden";
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    document.body.style.overflow = "auto";
    setIsPopupOpen(false);
  };
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closePopup();
      }
    };

    const handleSlash = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        openPopup();
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleSlash);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleSlash);
    };
  }, []);

  return (
    <div>
      <div
        onClick={openPopup}
        className="py-1 px-2 border cursor-pointer hover:border-gray-900 border-gray-400 lg:flex flex-row justify-between gap-2 items-center rounded-full hidden"
      >
        <div className="flex flex-row items-center">
          {props.children}
          <span className="mr-12 select-none">Search</span>
        </div>
        <span className="inset-x-3/4 p-1 select-none items-center justify-center text-xs font-mono tracking-wide leading-3 pointer-events-none border border-gray-400 rounded-sm mr-2">
          <kbd aria-hidden="true">/</kbd>
        </span>
      </div>
      <div onClick={openPopup} className={"lg:hidden cursor-pointer flex justify-between items-center"}>
        {props.children}
      </div>
      <SearchPopup
        isOpen={isPopupOpen}
        closePopup={closePopup}
        query={query}
        setQuery={setQuery}
        handleChange={handleChange}
        posts={posts}
      />
      {isPopupOpen && (
        <div
          className="z-40 fixed top-0 left-0 w-screen h-screen bg-black/20"
          onClick={closePopup}
        />
      )}
    </div>
  );
}
