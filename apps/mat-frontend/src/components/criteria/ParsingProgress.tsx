export default function ParsingProgress() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Parsing in progress...</p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/2 animate-pulse bg-primary" />
      </div>
    </div>
  );
}
