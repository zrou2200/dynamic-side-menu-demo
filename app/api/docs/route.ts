import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { DOC_Object } from '@/lib/types';


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


export async function GET() {
    let connection: oracledb.Connection | undefined;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            connectString: `${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
        });


        const result = await connection.execute<DOC_Object>(`
            SELECT TYPE_CODE as "type_code",
                    VALUE_CODE as "value_code",
                    "DESCRIPTION" as "description",
                    "MAPPED_TO" as "mapped_to",
                    "CREATE_USER" as "create_user",
                    'CREATE_DATE' as "create_date",
                    "SEQNC" as "sequence"
            FROM SWMS.DOCS_LISTS
        `);

        const rows = (result.rows  ?? []) as DOC_Object[];
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