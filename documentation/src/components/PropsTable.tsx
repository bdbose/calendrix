import * as React from "react";

export type PropDef = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: React.ReactNode;
};

export function PropsTable({ rows }: { rows: PropDef[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="doc-props-table">
        <thead>
          <tr>
            <th style={{ minWidth: 160 }}>Prop</th>
            <th style={{ minWidth: 200 }}>Type</th>
            <th style={{ minWidth: 100 }}>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <span className="prop-name">{row.name}</span>
                {row.required && (
                  <span className="prop-required" title="Required">
                    *
                  </span>
                )}
              </td>
              <td>
                <span className="prop-type">{row.type}</span>
              </td>
              <td>
                <span className="prop-default">{row.default ?? "—"}</span>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
