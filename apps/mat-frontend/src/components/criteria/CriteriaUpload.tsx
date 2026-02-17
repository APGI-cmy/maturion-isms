export default function CriteriaUpload() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Criteria Document</h3>
      <input
        type="file"
        accept=".pdf,.docx,.xlsx"
        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
      />
    </div>
  );
}
