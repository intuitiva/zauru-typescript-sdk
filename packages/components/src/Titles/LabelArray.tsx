import { SelectFieldOption } from "@zauru-sdk/types";

//Component to show all information in an array
export const LabelArray = ({ info }: { info: SelectFieldOption[] }) => {
  return (
    <div className="divide-y divide-gray-100">
      {info?.map((x: any) => {
        return (
          <div key={x?.label} className="my-1 pt-2">
            <p className="inline font-bold text-lg">{x?.label}: </p>
            <p className="inline text-lg">{x?.value}</p>
          </div>
        );
      })}
    </div>
  );
};
