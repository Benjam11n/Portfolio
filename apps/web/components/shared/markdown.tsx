import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
  className?: string;
}

export const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={className}>
    <ReactMarkdown
      components={{
        // By default, render paragraphs as spans to avoid block-level issues in flex containers
        // unless specifically overridden or needed.
        a: ({ href, children: linkChildren }) => (
          <a
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkChildren}
          </a>
        ),
        li: ({ children: listChildren }) => (
          <li className="pl-1">{listChildren}</li>
        ),
        p: ({ children: paragraphChildren }) => (
          <span className="inline">{paragraphChildren}</span>
        ),
        strong: ({ children: strongChildren }) => (
          <strong className="font-bold text-foreground/90">
            {strongChildren}
          </strong>
        ),
        ul: ({ children: unorderedListChildren }) => (
          <ul className="list-disc pl-4 marker:text-muted-foreground">
            {unorderedListChildren}
          </ul>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);
