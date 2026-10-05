import { NavLink } from "@remix-run/react";

export type RouteTabNavItem = {
  to: string;
  label: string;
  hide?: boolean;
  end?: boolean;
};

type Props = {
  items: RouteTabNavItem[];
  ariaLabel?: string;
  selectedColor?: "indigo" | "slate" | "blue" | "green";
};

const ACTIVE: Record<NonNullable<Props["selectedColor"]>, string> = {
  indigo: "border-indigo-600 text-indigo-700",
  slate: "border-slate-700 text-slate-800",
  blue: "border-blue-600 text-blue-700",
  green: "border-green-600 text-green-700",
};

export const RouteTabNav = ({
  items,
  ariaLabel = "Secciones",
  selectedColor = "indigo",
}: Props) => {
  const visible = items.filter((item) => !item.hide);

  if (visible.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="border-b border-gray-200"
    >
      <ul className="flex flex-wrap gap-1 -mb-px">
        {visible.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "inline-flex items-center cursor-pointer rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  isActive
                    ? ACTIVE[selectedColor]
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
