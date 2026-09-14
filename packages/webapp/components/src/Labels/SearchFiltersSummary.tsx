export type SearchFilterItem = {
  key: string;
  label: string;
  value: string;
};

type Props = {
  items?: SearchFilterItem[];
  emptyText?: string;
  className?: string;
};

export const SearchFiltersSummary = ({
  items,
  emptyText = "Sin filtros registrados",
  className = "",
}: Props) => {
  if (!items?.length) {
    return (
      <p className={`text-xs text-gray-400 ${className}`}>{emptyText}</p>
    );
  }

  return (
    <dl className={`flex flex-col gap-1 text-xs text-gray-700 ${className}`}>
      {items.map((item) => (
        <div key={item.key} className="flex flex-wrap items-baseline gap-x-1">
          <dt className="font-semibold text-gray-500">{item.label}:</dt>
          <dd className="text-gray-800">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
