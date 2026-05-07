import * as React from "react";

export function CodeBlock({
  children,
  language: _language = "tsx",
}: {
  children: string;
  language?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [children]);

  return (
    <div className="doc-code-block">
      <button
        type="button"
        className={"doc-code-copy" + (copied ? " copied" : "")}
        onClick={onCopy}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
