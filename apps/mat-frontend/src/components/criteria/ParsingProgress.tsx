export default function ParsingProgress() {
  return (
    <div className="space-y-2">
      <h3 className="font-bold">AI Parsing in Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
      </div>
      <p className="text-sm text-gray-600">Parsing criteria... 60% complete</p>
    </div>
  );
}
