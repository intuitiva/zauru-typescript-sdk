export const LoadingInputSkeleton = () => {
  return (
    <div
      className="w-full h-full bg-gray-300 animate-pulse rounded"
      style={{
        maxWidth: "100%",
        height: "40px",
        boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};
