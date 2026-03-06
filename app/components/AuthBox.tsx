'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { DOC_Object } from '../../lib/types';

interface AuthBoxProps {
  auths: DOC_Object[];
  color?: string;
}

/**
 * Person icon in the column header that opens a modal listing authorizations.
 */
export default function AuthBox({ auths, color }: AuthBoxProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (auths.length === 0) return null;

  const sorted = [...auths].sort(
    (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
  );

  return (
    <>
      <button
        className="auth-icon-btn"
        title="Authorizations"
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(true);
        }}
      >
        {/* Person icon (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M12 13c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
        </svg>
      </button>

      <Modal
        title="Authorizations"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
        centered
      >
        <div className="auth-modal-body">
          <table className="auth-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((auth, i) => (
                <tr key={auth.value_code}>
                  <td className="auth-cell-seq">{i + 1}</td>
                  <td className="auth-cell-code">{auth.value_code}</td>
                  <td>{auth.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
