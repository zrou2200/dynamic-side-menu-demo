import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { SWMS_Object } from '@/lib/types';


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


export async function GET() {
    let connection: oracledb.Connection | undefined;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            connectString: `${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
        });


        const result = await connection.execute<SWMS_Object>(`
            SELECT OBJECT_TYPE as "object_name",
                    COUNTS as "count"
            FROM SWMS.V_SWMS_OBJECT_COUNTS
        `);

        const rows = (result.rows  ?? []) as SWMS_Object[];
        return NextResponse.json(rows);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch object data' }, { status: 500 });

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