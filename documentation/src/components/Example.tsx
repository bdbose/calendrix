import * as React from "react";
import { CodeBlock } from "./CodeBlock";

export function Example({
  preview,
  code,
}: {
  preview: React.ReactNode;
  code: string;
}) {
  return (
    <div className="doc-example">
      <div className="doc-example-preview">{preview}</div>
      <div className="doc-example-code">
        <CodeBlock>{code}</CodeBlock>
      </div>
    </div>
  );
}
