'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { SubmenuGroup } from '../../lib/types';

const DEFAULT_MAX_VISIBLE = 6;

export default function CollapsibleSubgroup({ group }: { group: SubmenuGroup }) {
  const maxVisible = Math.min(group.maxVisible ?? DEFAULT_MAX_VISIBLE, DEFAULT_MAX_VISIBLE);
  const [modalOpen, setModalOpen] = useState(false);
  const hasMore = group.lines.length > maxVisible;
  const preview = group.lines.slice(0, maxVisible);

  return (
    <div className="menu-subgroup">
      <div className="menu-subgroup-title">{group.title}</div>
      <div>
        {preview.map((line, i) => (
          <div key={i} className="menu-sub-line">{line}</div>
        ))}
      </div>
      {hasMore && (
        <div
          onClick={() => setModalOpen(true)}
          className="syspar-box-more"
        >
          +{group.lines.length - maxVisible} more…
        </div>
      )}
      {hasMore && (
        <Modal
          title={group.title}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          width={600}
          centered
        >
          <div className="subgroup-modal-body">
            <table className="subgroup-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{group.title}</th>
                </tr>
              </thead>
              <tbody>
                {group.lines.map((line, i) => (
                  <tr key={i}>
                    <td className="subgroup-cell-seq">{i + 1}</td>
                    <td>{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
