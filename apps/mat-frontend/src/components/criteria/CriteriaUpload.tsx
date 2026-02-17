export default function CriteriaUpload() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
      <input type="file" accept=".pdf,.docx,.xlsx" className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <p className="text-lg">Drop criteria document here or click to upload</p>
        <p className="text-sm text-gray-500">Supported: PDF, DOCX, XLSX</p>
      </label>
    </div>
  );
}
