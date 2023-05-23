import { useEffect, useState } from "preact/hooks";
import type { TocItem } from "../util/generateToc";
import { unescape } from "../util/html-entities";

interface Props {
  toc: TocItem[];
  labels: {
    onThisPage: string;
  };
}

const TableOfContents = ({ toc = [], labels }: Props) => {
  const [currentHeading, setCurrentHeading] = useState({
    slug: toc[0].slug,
    text: toc[0].text,
  });
  const onThisPageID = "on-this-page-heading";

  useEffect(() => {
    const setCurrent: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { id } = entry.target;
          if (id === onThisPageID) continue;
          setCurrentHeading({
            slug: entry.target.id,
            text: entry.target.textContent || "",
          });
          break;
        }
      }
    };

    const observerOptions: IntersectionObserverInit = {
      // Negative top margin accounts for `scroll-margin`.
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      rootMargin: "-10px 0% -66%",
      threshold: 1,
    };

    const headingsObserver = new IntersectionObserver(
      setCurrent,
      observerOptions
    );

    // Observe all the headings in the main page content.
    document
      .querySelectorAll("article :is(h1,h2,h3)")
      .forEach((h) => headingsObserver.observe(h));

    // Stop observing when the component is unmounted.
    return () => headingsObserver.disconnect();
  }, []);

  const TableOfContentsItem = ({ heading }: { heading: TocItem }) => {
    const { depth, slug, text, children } = heading;

    let headerDepth = "pl-4 space-x-reverse";

    if (depth === 3) {
      headerDepth = "pl-8 space-x-reverse";
    }

    if (depth === 4) {
      headerDepth = "pl-12 space-x-reverse";
    }
    let currentHeaderLink = "";

    if (currentHeading.slug === slug) {
      currentHeaderLink = "bg-purple-100 w-full border-l-4 border-purple-500";
    }

    return (
      <li className="">
        <a
          className={`transition border-l-4 duration-200 ease-out pt-1 pb-1 leading-5 text-theme-text-lighter no-underline bidi-override text-base w-full inline-flex gap-2 ${headerDepth} ${currentHeaderLink} text-gray-600 hover:text-gray-900 hover:underline`.trim()}
          href={`#${slug}`}
        >
          {unescape(text)}
        </a>
        {children.length > 0 ? (
          <ul>
            {children.map((heading) => (
              <TableOfContentsItem key={heading.slug} heading={heading} />
            ))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <div>
      <h2
        className="font-bold cursor-pointer mb-2 text-lg select-none leading-6"
        id={onThisPageID}
      >
        {labels.onThisPage}
      </h2>
      <ul className="text-gray-700 text-sm leading-6">
        {toc.map((heading2) => (
          <TableOfContentsItem key={heading2.slug} heading={heading2} />
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
