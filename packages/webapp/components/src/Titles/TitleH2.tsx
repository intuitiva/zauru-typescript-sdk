//H2 Title Component
export const TitleH2 = ({ texto }: any) => {
  return (
    <div className="py-1 ">
      <h2 className="text-2xl font-bold leading-normal mt-0 mb-2 text-zinc-800">
        {texto}
      </h2>
    </div>
  );
};
