import React from "react";

interface SavedQuery {
  name: string;
  tickers: string[];
  data: Record<string, any>;
}

interface SavedQueriesListProps {
  savedQueries: SavedQuery[];
  onLoadQuery: (query: SavedQuery) => void;
  onRemoveQuery: (name: string) => void;
}

export default function SavedQueriesList({
  savedQueries,
  onLoadQuery,
  onRemoveQuery,
}: SavedQueriesListProps) {
  return (
    <div>
      <h3>Consultas Salvas</h3>
      {savedQueries.length === 0 && <p>Nenhuma consulta salva.</p>}
      <ul>
        {savedQueries.map((query) => (
          <li key={query.name}>
            <button onClick={() => onLoadQuery(query)}>{query.name}</button>
            <button onClick={() => onRemoveQuery(query.name)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
