import { useEffect } from "react";

export default function useDocumentMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    let tag = null;
    let previousDescription = null;
    if (description) {
      tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      previousDescription = tag.getAttribute("content");
      tag.setAttribute("content", description);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}${window.location.pathname}`);

    return () => {
      if (title) document.title = previousTitle;
      if (tag && previousDescription != null) tag.setAttribute("content", previousDescription);
    };
  }, [title, description]);
}