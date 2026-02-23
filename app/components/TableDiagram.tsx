import { ColumnCell, SWMS_Object } from "../../lib/types";
import ObjectCounts from "./ObjectCounts";

type Props = {
  columns: ColumnCell[];
};

export default function TableDiagram({ columns, objectData }: Props & { objectData: SWMS_Object[] }) {
  return (
    <div className="diagram-wrapper">
      <h1 className="diagram-title">SWMS at a Glance</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
            gap: 16,
            alignItems: 'start',   // ← critical
          }}
        >
          {columns.map(column => (
            <div key={column.id} className="menu-cell" style={{ background: column.color }}>
              <div className="menu-main-title" >
                {column.title}
              </div>

              {column.groups.map(group => (
                <div key={group.id} className="menu-subgroup">
                  <div className="menu-subgroup-title">
                    {group.title}
                  </div>
                  {group.lines.map((line, i) => (
                    <div key={i} className="menu-sub-line">
                      {line}
                    </div>
                  ))}
                </div>
                
              ))}
              
              {column.id === "18001" && (
                <div key={"18888"} className="menu-subgroup">
                  <div className="menu-subgroup-title">
                    SWMS Database Objects
                  </div>
                  {objectData.map(obj => (
                    <div key={obj.object_name} className="menu-sub-group">
                      <span className="menu-sub-line">{obj.count}   {obj.object_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      

    </div>
    </div>
  );
}
