const Loading = () => {
  return (
    <div className="flex items-center justify-center p-8" role="status">
      <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      <span className="ml-3">Loading...</span>
    </div>
  );
};
export default Loading;
