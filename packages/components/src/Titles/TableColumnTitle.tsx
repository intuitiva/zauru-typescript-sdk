export type tableColumnTitleProps = {
  textContent: String;
};
//column title for datatables
export const TableColumnTitle = ({ textContent }: tableColumnTitleProps) => {
  return (
    <p className="font-bold text-sm line-clamp-3 text-center">{textContent}</p>
  );
};
