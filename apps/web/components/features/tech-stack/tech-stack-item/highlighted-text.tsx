const escapeRegExp = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createHighlightMatcher = (searchTerms: string[]) => {
  const uniqueTerms = [...new Set(searchTerms.filter(Boolean))];

  if (uniqueTerms.length === 0) {
    return null;
  }

  return new RegExp(
    `(${uniqueTerms.map((term) => escapeRegExp(term)).join("|")})`,
    "gi"
  );
};

interface HighlightedTextProps {
  searchTerms: string[];
  text: string;
}

export const HighlightedText = ({
  searchTerms,
  text,
}: HighlightedTextProps) => {
  const matcher = createHighlightMatcher(searchTerms);
  if (!matcher) {
    return text;
  }

  const isMatch = new RegExp(matcher.source, "i");
  const segments = text.split(matcher);
  let offset = 0;

  return segments.map((segment) => {
    const key = `${segment}-${offset}`;
    offset += segment.length;

    return isMatch.test(segment) ? (
      <mark
        className="rounded-[0.35rem] bg-primary/15 px-1 py-0.5 text-foreground"
        key={key}
      >
        {segment}
      </mark>
    ) : (
      segment
    );
  });
};
