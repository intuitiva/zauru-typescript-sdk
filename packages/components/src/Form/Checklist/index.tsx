import React from "react";
import { CheckBox } from "../Checkbox/index.js";

export type ChecklistItem = {
  id: string;
  name: string;
  label: string;
  defaultValue?: boolean;
  disabled?: boolean;
};

type ChecklistProps = {
  items: ChecklistItem[];
  onChange?: (name: string, value: boolean) => void;
};

export const Checklist: React.FC<ChecklistProps> = ({ items, onChange }) => {
  const handleCheckboxChange = (name: string, value: boolean) => {
    if (onChange) {
      onChange(name, value);
    }
  };

  return (
    <div>
      {items.map((item) => (
        <CheckBox
          key={item.id}
          {...item}
          onChange={(value) => handleCheckboxChange(item.name, value)}
        />
      ))}
    </div>
  );
};
