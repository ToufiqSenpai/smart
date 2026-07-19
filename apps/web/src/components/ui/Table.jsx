export default function Table({ headers = [], className = "", children }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border-subtle text-text-muted text-xs font-bold uppercase tracking-wider">
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">{children}</tbody>
      </table>
    </div>
  );
}
