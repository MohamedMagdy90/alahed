import sanitizeHtml from "sanitize-html";

export function cleanHtml(dirty: string) {
  return sanitizeHtml(dirty || "", {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "img", "figure", "figcaption", "hr", "code", "pre", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      p: ["style", "dir"],
      h2: ["style", "dir"],
      h3: ["style", "dir"],
      h4: ["style", "dir"],
      span: ["style"],
    },
    allowedStyles: {
      "*": { "text-align": [/^(left|right|center|justify|start|end)$/] },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer", ...(attribs.href?.startsWith("http") ? { target: "_blank" } : {}) },
      }),
    },
  });
}

export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `post-${Date.now().toString(36)}`
  );
}

export function stripHtml(html: string) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function readingMinutes(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
