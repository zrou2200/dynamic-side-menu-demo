import { DOC_Object } from "./types";


export function processDocsData(docsData: DOC_Object[]) {
    const groupedData: Record<string, DOC_Object[]> = {};
    docsData.forEach(doc => {
        if (!groupedData[doc.type_code]) {
            groupedData[doc.type_code] = [];
        }
        groupedData[doc.type_code].push(doc);
    });
    return groupedData;
}