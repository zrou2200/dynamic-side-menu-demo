'use client';

import { DOC_Object } from '../../lib/types';

interface ErpDiagramProps {
  docs: DOC_Object[];
}

export default function ErpDiagram({ docs }: ErpDiagramProps) {
  const erpDocs = docs
    .filter(d => d.type_code === 'ERP')
    .sort((a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity));

  if (erpDocs.length === 0) return null;

  return (
    <div className="erp-diagram">
      <div className="erp-diagram-title">ERP Systems</div>
      <div className="erp-diagram-grid">
        {erpDocs.map(erp => (
          <div key={erp.value_code} className="erp-diagram-card">
            <div className="erp-card-label">{erp.description}</div>
            {/* <div className="erp-card-mapped">{erp.mapped_to}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
