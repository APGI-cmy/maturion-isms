export default function CriteriaTree() {
  return (
    <div className="space-y-2" role="tree">
      <div role="treeitem" tabIndex={0}>
        <button className="text-left w-full p-2 hover:bg-gray-100">
          ▶ Domain 1
        </button>
      </div>
      <div role="treeitem" tabIndex={0} className="ml-4">
        <button className="text-left w-full p-2 hover:bg-gray-100">
          ▶ MPS 1.1
        </button>
      </div>
    </div>
  );
}
