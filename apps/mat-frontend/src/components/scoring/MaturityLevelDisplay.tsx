export default function MaturityLevelDisplay() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Maturity Level</p>
      <select className="rounded-md border p-2">
        <option>Select Level</option>
        <option>Level 1</option>
        <option>Level 2</option>
        <option>Level 3</option>
        <option>Level 4</option>
        <option>Level 5</option>
      </select>
    </div>
  );
}
