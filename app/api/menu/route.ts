import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { buildMenuTree, MenuItem } from '@/lib/menu';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


export async function GET() {
    let connection: oracledb.Connection | undefined;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            connectString: `${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
        });


        const result = await connection.execute<MenuItem>(`
            SELECT PK_ML_MODULES as "id",
                    PARENTMENU as "parent_name",
                    SUBMENU as "route", 
                    MENULABEL as "label",
                    ORDERIN as "sort_order",
                    OBJECT_URL as "object_url"
            FROM SWMS.SWMS_DOCUMENTS
        `);

        const rows = (result.rows  ?? []) as MenuItem[];
        const tree = buildMenuTree(rows);
        return NextResponse.json(tree);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch menu data' }, { status: 500 });

    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error('Error closing database connection:', closeError);
            }
        }
    }
}