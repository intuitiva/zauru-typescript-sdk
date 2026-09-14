import React from "react";

export type ActionListItem = {
  key: string;
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  badge?: string;
  badgeClassName?: string;
  disabled?: boolean;
  onClick: () => void;
};

type ActionListProps = {
  items: ActionListItem[];
  disabled?: boolean;
  className?: string;
};

export const ActionList = ({
  items,
  disabled = false,
  className = "",
}: ActionListProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {items.map((item) => {
        const itemBusy = Boolean(item.loading);
        const itemDisabled = disabled || item.disabled || itemBusy;

        return (
          <button
            key={item.key}
            type="button"
            disabled={itemDisabled}
            onClick={item.onClick}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-progress disabled:opacity-60"
          >
            {item.badge ? (
              <span
                className={`inline-flex min-w-[2.25rem] justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  item.badgeClassName ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {item.badge}
              </span>
            ) : null}
            <span>
              {itemBusy ? (item.loadingLabel ?? item.label) : item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
