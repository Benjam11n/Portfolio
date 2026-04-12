import type { ReactNode } from "react";

interface LightweightMarkdownProps {
  children: string;
  className?: string;
}

const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_REGEX = /\*\*([^*]+)\*\*/g;

const renderStrongSegments = (text: string, keyPrefix: string): ReactNode[] => {
  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(BOLD_REGEX)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      result.push(text.slice(lastIndex, matchIndex));
    }

    result.push(
      <strong
        className="font-bold text-foreground/90"
        key={keyPrefix + matchIndex}
      >
        {match[1]}
      </strong>
    );

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
};

const renderInlineMarkdown = (text: string) => {
  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_REGEX)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      result.push(
        ...renderStrongSegments(
          text.slice(lastIndex, matchIndex),
          `text-${matchIndex}-`
        )
      );
    }

    result.push(
      <a
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        href={match[2]}
        key={`link-${matchIndex}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {renderStrongSegments(match[1], `link-text-${matchIndex}-`)}
      </a>
    );

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(
      ...renderStrongSegments(text.slice(lastIndex), `tail-${lastIndex}-`)
    );
  }

  return result;
};

export const LightweightMarkdown = ({
  children,
  className,
}: LightweightMarkdownProps) => (
  <span className={className}>{renderInlineMarkdown(children)}</span>
);
