import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { SYSPAR_Object } from '@/lib/types';


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


export async function GET() {
    let connection: oracledb.Connection | undefined;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            connectString: `${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
        });


        const result = await connection.execute<SYSPAR_Object>(`
            SELECT SYSTEMPARAMETER as "syspar",
                    PARAMVALUE as "param_value",
                    DESRIPTION as "description",
                    APP_NAME as "mapped_to",
                    CANOPCOCHANGEIT as "can_opco_change_it",
                    SYS_CONFIG_HELP as "config_help_text",
                    SEQNC as "sequence"
            FROM SWMS.V_SYSPARS
        `);

        const rows = (result.rows  ?? []) as SYSPAR_Object[];
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