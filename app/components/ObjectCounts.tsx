import { SWMS_Object } from "@/lib/types";

export default function ObjectCounts({ objectData }: { objectData: SWMS_Object[] }) {
    return (
        

            <div className="menu-subgroup">
            {objectData.map(obj => (
                    <div key={obj.object_name} className="menu-sub-group">
                        <span className="menu-subgroup-title">{obj.count}   {obj.object_name}</span>
                        
                    </div>
                
            ))}
            </div>

    );
}