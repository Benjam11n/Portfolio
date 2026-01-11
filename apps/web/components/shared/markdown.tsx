import ReactMarkdown from "react-markdown";

type MarkdownProps = {
  children: string;
  className?: string;
};

export const Markdown = ({ children, className }: MarkdownProps) => {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          // By default, render paragraphs as spans to avoid block-level issues in flex containers
          // unless specifically overridden or needed.
          p: ({ children }) => <span className="inline">{children}</span>,
          strong: ({ children }) => (
            <strong className="font-bold text-foreground/90">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
