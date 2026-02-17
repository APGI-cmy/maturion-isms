import { useState } from 'react';

interface CriterionNode {
  id: string;
  number: string;
  text: string;
  children?: CriterionNode[];
  domain?: string;
}

interface CriteriaTreeProps {
  criteria?: CriterionNode[];
  onSelect?: (criterion: CriterionNode) => void;
}

const CriteriaTreeNode = ({ 
  node, 
  level = 0, 
  onSelect 
}: { 
  node: CriterionNode; 
  level?: number; 
  onSelect?: (node: CriterionNode) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center space-x-2 py-2 px-3 hover:bg-gray-50 cursor-pointer rounded ${
          level > 0 ? `ml-${level * 4}` : ''
        }`}
        onClick={() => onSelect?.(node)}
        onKeyPress={(e) => e.key === 'Enter' && onSelect?.(node)}
        role="treeitem"
        tabIndex={0}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex-shrink-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-4"></div>}
        
        <span className="text-sm font-mono text-gray-600 flex-shrink-0">{node.number}</span>
        <span className="text-sm text-gray-900 flex-1">{node.text}</span>
        
        {node.domain && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {node.domain}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-4">
          {node.children!.map((child) => (
            <CriteriaTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CriteriaTree = ({ criteria = [], onSelect }: CriteriaTreeProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4" role="tree">
      <h3 className="text-lg font-semibold mb-4">Criteria Navigation</h3>
      
      {criteria.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No criteria available</p>
      ) : (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {criteria.map((node) => (
            <CriteriaTreeNode key={node.id} node={node} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CriteriaTree;
