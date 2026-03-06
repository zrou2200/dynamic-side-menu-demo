'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { SYSPAR_Object } from '../../lib/types';

interface SysparBoxProps {
  syspars: SYSPAR_Object[];
  color?: string;
}

const MAX_PREVIEW_ROWS = 3;

function SysparTable({ rows, compact }: { rows: SYSPAR_Object[]; compact?: boolean }) {
  if (compact) {
    return (
      <table className="syspar-table">
        <thead>
          <tr>
            <th>Syspar</th>
            <th>Value</th>
            <th>Opco?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(sp => (
            <tr key={sp.syspar}>
              <td className="syspar-cell-name" title={sp.description}>{sp.syspar}</td>
              <td className="syspar-cell-value">{sp.param_value ?? '—'}</td>
              <td className="syspar-cell-opco">{sp.can_opco_change_it}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className="syspar-table syspar-table--full">
      <thead>
        <tr>
          <th>Syspar</th>
          <th>Value</th>
          <th>Description</th>
          <th>Opco?</th>
          <th>Help</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(sp => (
          <tr key={sp.syspar}>
            <td className="syspar-cell-name">{sp.syspar}</td>
            <td className="syspar-cell-value">{sp.param_value ?? '—'}</td>
            <td>{sp.description}</td>
            <td className="syspar-cell-opco">{sp.can_opco_change_it}</td>
            <td>{sp.config_help_text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function SysparBox({ syspars, color }: SysparBoxProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (syspars.length === 0) return null;

  const sorted = [...syspars].sort(
    (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
  );
  const preview = sorted.slice(0, MAX_PREVIEW_ROWS);
  const hasMore = sorted.length > MAX_PREVIEW_ROWS;

  return (
    <>
      <div
        className="syspar-box"
        style={{ borderColor: color ?? '#d9d9d9', cursor: 'pointer' }}
        onClick={() => setModalOpen(true)}
      >
        <div className="syspar-box-title">System Parameters</div>
        <SysparTable rows={preview} compact />
        {hasMore && (
          <div className="syspar-box-more">
            +{sorted.length - MAX_PREVIEW_ROWS} more…
          </div>
        )}
      </div>
      <Modal
        title="System Parameters"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="syspar-modal-body">
          <SysparTable rows={sorted} />
        </div>
      </Modal>
    </>
  );
}
