import { useEffect, useRef, useState } from "preact/hooks";

export default function Popup({
  isOpen,
  closePopup,
  query,
  setQuery,
  handleChange,
  posts,
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery("");
    }
  }, [isOpen, setQuery]);

  if (!isOpen) {
    return null;
  }

  const [transformedContent, setTransformedContent] = useState([]);

  function transformContent(contentArray: any) {
    return contentArray.reduce((newArray: any, post: any) => {
      // const matches = post.matches;
      // can get key with paragraph, header, or title and add it to the object
      // console.log("post", post);
      console.log("matches", post.item);

      post.matches.forEach((match: any) => {
        match.indices.forEach((index: any) => {
          const chars = post.item[match.key].split("");
          chars[index[0]] = "<mark>" + chars[index[0]];
          chars[index[1]] = chars[index[1]] + "</mark>";

          if (!post.item.hasOwnProperty("highlight")) {
            post.item.highlight = {};
          }

          post.item.highlight[match.key] = chars.join("");
        });
      });

      // const score = post.score;
      // const refIndex = post.refIndex;
      // Try to find an existing object with the same title
      let item = post.item;
      let existingObj = newArray.find((obj: any) => obj.title === item.title);

      if (existingObj) {
        // If an object with the same title exists, try to find a content object with the same header
        let existingContent = existingObj.content.find(
          (content: any) => content.header === item.header
        );

        if (existingContent) {
          // If a content object with the same header exists, append the paragraph to its paragraphs array
          existingContent.paragraphs.push(item.paragraph);
        } else {
          // If no content object with the same header exists, create a new one
          existingObj.content.push({
            header: item.header,
            paragraphs: [item.paragraph],
            highlight: item.highlight,
          });
        }
      } else {
        // If no object with the same title exists, create a new one
        newArray.push({
          title: item.title,
          highlight: {
            title: item.highlight.title,
          },
          slug: item.slug,
          content: [
            {
              header: item.header,
              paragraphs: [item.paragraph],
              highlight: item.highlight,
            },
          ],
        });
      }

      return newArray;
    }, []);
  }

  useEffect(() => {
    const transformed = transformContent(posts);
    console.log("transformed", transformed);
    setTransformedContent(transformed);
  }, [posts]);

  function cleanHeaderLink(header: string) {
    return header
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  return (
    <div
      className={`z-50 fixed top-44 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white shadow-popup text-gray-hover rounded-t-md`}
    >
      <div class="relative bg-white rounded-t shadow-lg p-5">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type to search..."
          className="outline-none p-2 w-full border-b border-gray-300"
          value={query}
          onInput={handleChange}
        />
        <div className="absolute top-full left-0 bg-white w-full p-5 rounded-b-md overflow-y-auto max-h-96">
          <ul>
            {transformedContent &&
              transformedContent.map((content: any) => (
                <li key={content.slug}>
                  <h2 className={"font-bold pb-4"}>
                    <a className={"flex gap-2"} href={`/${content.slug}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"
                        />
                        <path
                          fill="currentColor"
                          d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"
                        />
                      </svg>
                      {content.highlight.title ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content.highlight.title,
                          }}
                        />
                      ) : (
                        content.title
                      )}
                    </a>
                  </h2>
                  {content.content.map((section: any) => (
                    <div>
                      <h3 className={""}>
                        <a
                          onClick={closePopup}
                          className={
                            "flex gap-2 mx-3 p-4 border-l-2 border-gray-300 hover:bg-gray-200"
                          }
                          href={`/${content.slug}#${cleanHeaderLink(
                            section.header
                          )}`}
                        >
                          <svg
                            className={"text-gray-500"}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="m5.41 21l.71-4h-4l.35-2h4l1.06-6h-4l.35-2h4l.71-4h2l-.71 4h6l.71-4h2l-.71 4h4l-.35 2h-4l-1.06 6h4l-.35 2h-4l-.71 4h-2l.71-4h-6l-.71 4h-2M9.53 9l-1.06 6h6l1.06-6h-6Z"
                            />
                          </svg>
                          {section.highlight.header ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: section.highlight.header,
                              }}
                            />
                          ) : (
                            section.header
                          )}
                        </a>
                      </h3>
                      {section.paragraphs.map((paragraph: any, index: any) => (
                        <p className={"w-full"} key={index}>
                          <a
                            onClick={closePopup}
                            className={
                              "flex gap-2 mx-3 p-4 border-l-2 w-full border-gray-300 hover:bg-gray-200"
                            }
                            href={`/${content.slug}#${cleanHeaderLink(
                              section.header
                            )}`}
                          >
                            <svg
                              className={"text-gray-500"}
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M21 6v2H3V6h18M3 18h9v-2H3v2m0-5h18v-2H3v2Z"
                              />
                            </svg>

                            {paragraph.slice(0, 70)}
                          </a>
                        </p>
                      ))}
                    </div>
                  ))}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
